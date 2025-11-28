import logging
import os
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend import models, schemas
from backend.auth import get_current_user
from backend.database import get_db
from backend.services import report_builder, pdf_generator
from backend.config import get_settings

router = APIRouter(prefix="/api", tags=["reports"])
logger = logging.getLogger(__name__)
settings = get_settings()


def _get_study(db: Session, study_id: int) -> models.Study:
    study = db.query(models.Study).filter(models.Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study


@router.post("/studies/{study_id}/report/draft", response_model=schemas.ReportDraftResponse)
async def generate_draft_report(
    study_id: int,
    draft: schemas.ReportDraftRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    study = _get_study(db, study_id)
    patient = db.query(models.Patient).filter(models.Patient.id == study.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    logger.info("Generating draft report for study %s", study_id)
    llm_output = await report_builder.build_and_call_llm(study, patient, draft.structured_answers)

    report = db.query(models.Report).filter(models.Report.study_id == study_id).first()
    if not report:
        report = models.Report(
          study_id=study_id,
          technique=llm_output["technique"],
          findings=llm_output["findings"],
          impression=llm_output["impression"],
          internal_checks=llm_output.get("internal_checks", []),
          raw_llm_response=llm_output.get("raw_llm_response"),
          is_finalized=False,
        )
        db.add(report)
    else:
        report.technique = llm_output["technique"]
        report.findings = llm_output["findings"]
        report.impression = llm_output["impression"]
        report.internal_checks = llm_output.get("internal_checks", [])
        report.raw_llm_response = llm_output.get("raw_llm_response")
        report.is_finalized = False
        report.finalized_at = None
    db.commit()

    return schemas.ReportDraftResponse(
        study_id=study_id,
        technique=report.technique or "",
        findings=report.findings or "",
        impression=report.impression or "",
        internal_checks=report.internal_checks or [],
    )


@router.post("/studies/{study_id}/report/finalize")
def finalize_report(
    study_id: int,
    payload: schemas.ReportFinalizeRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    study = _get_study(db, study_id)
    report = db.query(models.Report).filter(models.Report.study_id == study_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found. Generate draft first.")

    report.technique = payload.technique or report.technique
    report.findings = payload.findings
    report.impression = payload.impression
    report.is_finalized = True
    report.finalized_at = datetime.utcnow()
    db.add(report)

    study.status = models.StudyStatus.finalized
    db.add(study)

    patient = db.query(models.Patient).filter(models.Patient.id == study.patient_id).first()
    pdf_path = pdf_generator.generate_report_pdf(patient, study, report, current_user, qr_url=None)
    report.pdf_path = pdf_path
    db.commit()

    pdf_url = f"/api/reports/{report.id}/download" if pdf_path else None
    return {"report_id": report.id, "pdf_url": pdf_url}


@router.get("/studies/{study_id}/report", response_model=schemas.ReportRead)
def get_report(
    study_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    report = db.query(models.Report).filter(models.Report.study_id == study_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.get("/reports/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report or not report.pdf_path:
        raise HTTPException(status_code=404, detail="PDF not available")
    if not os.path.exists(report.pdf_path):
        raise HTTPException(status_code=404, detail="PDF file missing on disk")
    return FileResponse(report.pdf_path, media_type="application/pdf", filename=os.path.basename(report.pdf_path))
