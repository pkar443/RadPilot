import os
from datetime import datetime, date
from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
import qrcode

from backend.config import get_settings
from backend.models import Patient, Study, Report, User, ModalityEnum

settings = get_settings()


def _age(dob: date | None) -> str:
    if not dob:
        return "N/A"
    today = date.today()
    return str(today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day)))


def _report_title(modality: ModalityEnum) -> str:
    if modality == ModalityEnum.ABDOMINAL_ULTRASOUND:
        return "Ultrasound Abdomen Report"
    if modality == ModalityEnum.ABDOMINAL_CT:
        return "CT Abdomen Report"
    if modality == ModalityEnum.CHEST_XRAY:
        return "Chest X-ray Report"
    return "Radiology Report"


def generate_report_pdf(
    patient: Patient,
    study: Study,
    report: Report,
    radiologist: User,
    qr_url: str | None = None,
) -> str:
    dest_dir = os.path.join(settings.upload_dir, str(study.id))
    os.makedirs(dest_dir, exist_ok=True)
    pdf_path = os.path.join(dest_dir, "report_final.pdf")

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    c.setTitle("AlloyDX Radiomed Report")
    c.setFont("Helvetica-Bold", 16)
    c.drawString(20 * mm, height - 20 * mm, "AlloyDX Radiomed")

    c.setFont("Helvetica-Bold", 14)
    c.drawString(20 * mm, height - 30 * mm, _report_title(study.modality))

    # Patient details
    c.setFont("Helvetica-Bold", 12)
    c.drawString(20 * mm, height - 45 * mm, "Patient Details")
    c.setFont("Helvetica", 10)
    patient_lines = [
        f"Name: {patient.full_name}",
        f"NHI: {patient.nhi or 'N/A'}",
        f"Local ID: {patient.local_patient_id or 'N/A'}",
        f"DOB: {patient.dob or 'N/A'} (Age: {_age(patient.dob)})",
        f"Sex: {patient.sex or 'N/A'}",
    ]
    for idx, line in enumerate(patient_lines):
        c.drawString(20 * mm, height - (55 + idx * 6) * mm, line)

    # Study details
    c.setFont("Helvetica-Bold", 12)
    y = height - 90 * mm
    c.drawString(20 * mm, y, "Study Details")
    c.setFont("Helvetica", 10)
    study_lines = [
        f"Modality: {study.modality.value}",
        f"Region: {study.region or 'N/A'}",
        f"Study Date/Time: {study.study_datetime}",
        f"Clinical indication: {study.clinical_indication or 'N/A'}",
    ]
    for idx, line in enumerate(study_lines):
        c.drawString(20 * mm, y - ((idx + 1) * 6) * mm, line)

    # Report content
    def draw_wrapped(label: str, text: str, start_y: float):
        c.setFont("Helvetica-Bold", 12)
        c.drawString(20 * mm, start_y, label)
        c.setFont("Helvetica", 10)
        max_width = width - 40 * mm
        y_offset = start_y - 6 * mm
        for paragraph in text.split("\n"):
            words = paragraph.split(" ")
            line = ""
            for word in words:
                test_line = f"{line} {word}".strip()
                if c.stringWidth(test_line, "Helvetica", 10) > max_width:
                    c.drawString(20 * mm, y_offset, line)
                    y_offset -= 5 * mm
                    line = word
                else:
                    line = test_line
            if line:
                c.drawString(20 * mm, y_offset, line)
                y_offset -= 5 * mm
        return y_offset

    y = y - 40 * mm
    y = draw_wrapped("TECHNIQUE", report.technique or "", y)
    y = draw_wrapped("FINDINGS", report.findings or "", y - 10 * mm)
    y = draw_wrapped("IMPRESSION", report.impression or "", y - 10 * mm)

    # Footer
    footer_y = 25 * mm
    c.setFont("Helvetica", 10)
    c.drawString(20 * mm, footer_y + 10 * mm, f"Reported by: {radiologist.full_name} ({radiologist.role})")
    c.drawString(20 * mm, footer_y + 4 * mm, f"Finalized at: {report.finalized_at or datetime.utcnow()}")
    disclaimer = (
        "This report was generated with assistance from AlloyDX Radiomed. "
        "All findings and impressions have been reviewed and verified by the reporting radiologist. "
        "Interpret in clinical context."
    )
    c.drawString(20 * mm, footer_y - 4 * mm, disclaimer[:90])
    c.drawString(20 * mm, footer_y - 10 * mm, disclaimer[90:180])

    if qr_url:
        qr_img = qrcode.make(qr_url)
        qr_buffer = BytesIO()
        qr_img.save(qr_buffer, format="PNG")
        qr_buffer.seek(0)
        c.drawInlineImage(qr_buffer, width - 50 * mm, 15 * mm, 30 * mm, 30 * mm)

    c.showPage()
    c.save()

    with open(pdf_path, "wb") as f:
        f.write(buffer.getvalue())

    return pdf_path
