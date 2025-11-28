from datetime import datetime
import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend import models, schemas
from backend.auth import get_current_user
from backend.database import get_db

router = APIRouter(prefix="/api/studies", tags=["studies"])
logger = logging.getLogger(__name__)


@router.post("", response_model=schemas.StudyRead, status_code=201)
def create_study(
    study_in: schemas.StudyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    patient = db.query(models.Patient).filter(models.Patient.id == study_in.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    study = models.Study(
        patient_id=study_in.patient_id,
        radiologist_id=current_user.id,
        modality=study_in.modality,
        region=study_in.region,
        clinical_indication=study_in.clinical_indication,
        study_datetime=study_in.study_datetime or datetime.utcnow(),
    )
    db.add(study)
    db.commit()
    db.refresh(study)
    logger.info("Created study %s", study.id)
    return study


@router.get("/{study_id}", response_model=schemas.StudyRead)
def get_study(
    study_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    study = db.query(models.Study).filter(models.Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")
    return study


@router.get("", response_model=List[schemas.StudyRead])
def list_studies(
    patient_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Study)
    if patient_id:
        query = query.filter(models.Study.patient_id == patient_id)
    return query.order_by(models.Study.created_at.desc()).all()
