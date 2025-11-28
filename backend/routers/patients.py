from typing import List, Optional
import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend import models, schemas
from backend.auth import get_current_user
from backend.database import get_db

router = APIRouter(prefix="/api/patients", tags=["patients"])
logger = logging.getLogger(__name__)


@router.get("", response_model=List[schemas.PatientRead])
def list_patients(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Patient)
    if search:
        like = f"%{search}%"
        query = query.filter(
            (models.Patient.full_name.ilike(like))
            | (models.Patient.nhi.ilike(like))
            | (models.Patient.local_patient_id.ilike(like))
        )
    patients = query.offset((page - 1) * page_size).limit(page_size).all()
    return patients


@router.post("", response_model=schemas.PatientRead, status_code=201)
def create_patient(
    patient_in: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if patient_in.nhi:
        existing = db.query(models.Patient).filter(models.Patient.nhi == patient_in.nhi).first()
        if existing:
            return existing
    patient = models.Patient(**patient_in.dict())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    logger.info("Created patient %s", patient.id)
    return patient
