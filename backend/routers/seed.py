from datetime import date, datetime
import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend import models
from backend.auth import get_password_hash
from backend.database import get_db

router = APIRouter(prefix="/api/seed", tags=["seed"])
logger = logging.getLogger(__name__)


@router.post("")
def seed(db: Session = Depends(get_db)):
    # User
    user = db.query(models.User).filter(models.User.email == "dr.test@example.com").first()
    if not user:
        user = models.User(
            email="dr.test@example.com",
            full_name="Dr Test Radiologist",
            hashed_password=get_password_hash("Password123!"),
            role="radiologist",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    patient = db.query(models.Patient).filter(models.Patient.nhi == "ABC1234").first()
    if not patient:
        patient = models.Patient(
            full_name="John Doe",
            nhi="ABC1234",
            local_patient_id="JD-001",
            dob=date(1970, 1, 1),
            sex="Male",
            contact_email="john.doe@example.com",
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

    study = db.query(models.Study).filter(models.Study.patient_id == patient.id).first()
    if not study:
        study = models.Study(
            patient_id=patient.id,
            radiologist_id=user.id,
            modality=models.ModalityEnum.ABDOMINAL_ULTRASOUND,
            region="Abdomen",
            clinical_indication="Right upper quadrant pain, query cholecystitis.",
            study_datetime=datetime.utcnow(),
        )
        db.add(study)
        db.commit()
        db.refresh(study)

    logger.info("Seeded dummy user/patient/study")
    return {"user_id": user.id, "patient_id": patient.id, "study_id": study.id}
