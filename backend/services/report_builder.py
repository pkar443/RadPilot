import json
import logging
from typing import Dict, Any, List

from backend.models import Study, ModalityEnum, Patient
from backend.services.openai_client import generate_chat_completion

logger = logging.getLogger(__name__)


def modality_prompt(modality: ModalityEnum) -> str:
    if modality == ModalityEnum.ABDOMINAL_ULTRASOUND:
        return (
            "Focus on liver, gallbladder, biliary tree, pancreas, spleen, kidneys, aorta/IVC, free fluid. "
            "Use ultrasound terminology (echogenicity, echotexture, etc.)."
        )
    if modality == ModalityEnum.ABDOMINAL_CT:
        return (
            "Focus on phases and solid organs (liver, pancreas, spleen, adrenals, kidneys), bowel, peritoneum, nodes, vessels, bones. "
            "Use CT terms: attenuation, enhancement patterns, solid/cystic."
        )
    if modality == ModalityEnum.CHEST_XRAY:
        return (
            "Focus on technique, lungs/pleura, heart/mediastinum, bones, soft tissues. "
            "Use CXR terminology: consolidation, effusion, pneumothorax, cardiomegaly, etc."
        )
    return ""


def build_system_prompt(study: Study) -> str:
    return (
        "You are an expert radiologist report writer. You will receive structured inputs and must ONLY: "
        "convert them into concise radiology report language and flag internal contradictions. "
        "Do not invent findings or diagnoses beyond the provided data. "
        "Do not alter demographics. If data is missing, omit rather than guess. "
        f"Modality context: {modality_prompt(study.modality)} "
        "Output strictly in JSON with keys: technique, findings, impression, internal_checks (array of strings). "
        "If no inconsistency is detected, return ['No inconsistencies detected.'] in internal_checks."
    )


def build_user_prompt(study: Study, patient: Patient | None, structured_answers: Dict[str, Any]) -> str:
    patient_info = f"Patient: {patient.full_name if patient else 'Unknown'}, Sex: {patient.sex}, DOB: {patient.dob}" if patient else "Patient: Unknown"
    return (
        f"{patient_info}\n"
        f"Study modality: {study.modality}\n"
        f"Clinical indication: {study.clinical_indication}\n"
        f"Structured answers JSON:\n{json.dumps(structured_answers, indent=2)}\n"
        "Generate JSON: {\"technique\":..., \"findings\":..., \"impression\":..., \"internal_checks\":[...]} only."
    )


def validate_answers(structured_answers: Dict[str, Any], patient: Patient | None) -> List[str]:
    warnings: List[str] = []
    sex = (patient.sex or "").lower() if patient else ""
    # Simple examples
    if sex == "male":
        for key in structured_answers.keys():
            if "ovary" in key.lower() or "uterus" in key.lower():
                warnings.append("Patient sex is male but gynecologic findings provided.")
                break
    gallbladder_status = structured_answers.get("gallbladder_status")
    gallstones = structured_answers.get("gallstones")
    if gallbladder_status and str(gallbladder_status).lower() in {"absent", "surgically absent"}:
        if gallstones and str(gallstones).lower() not in {"no", "absent", "none"}:
            warnings.append("Gallbladder marked absent but stones flagged present.")
    impression = structured_answers.get("impression_hint", "").lower()
    appendix_visibility = structured_answers.get("appendix_visualized")
    if appendix_visibility and str(appendix_visibility).lower() in {"not visualized", "not seen"}:
        if "appendicitis" in impression:
            warnings.append("Appendix not visualized but impression suggests appendicitis.")
    return warnings


async def build_and_call_llm(study: Study, patient: Patient | None, structured_answers: Dict[str, Any]) -> Dict[str, Any]:
    system_prompt = build_system_prompt(study)
    user_prompt = build_user_prompt(study, patient, structured_answers)

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    result = await generate_chat_completion(messages, response_format={"type": "json_object"})

    try:
        parsed = json.loads(result["content"])
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse LLM response: %s", exc)
        raise

    # Ensure keys
    for key in ["technique", "findings", "impression", "internal_checks"]:
        parsed.setdefault(key, "" if key != "internal_checks" else [])

    warnings = validate_answers(structured_answers, patient)
    parsed_checks = parsed.get("internal_checks") or []
    if warnings:
        parsed_checks.extend(warnings)
    if not parsed_checks:
        parsed_checks = ["No inconsistencies detected."]
    parsed["internal_checks"] = parsed_checks
    parsed["raw_llm_response"] = result.get("raw")
    return parsed
