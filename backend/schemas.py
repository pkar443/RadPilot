from datetime import datetime, date
from typing import List, Optional, Dict, Any

from pydantic import BaseModel, EmailStr, Field

from backend.models import ModalityEnum, StudyStatus


# Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "radiologist"
    

class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# Patients
class PatientBase(BaseModel):
    full_name: str
    nhi: Optional[str] = None
    local_patient_id: Optional[str] = None
    dob: Optional[date] = None
    sex: Optional[str] = None
    contact_email: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientRead(PatientBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


# Studies
class StudyCreate(BaseModel):
    patient_id: int
    modality: ModalityEnum
    region: Optional[str] = None
    clinical_indication: Optional[str] = None
    study_datetime: Optional[datetime] = None


class StudyRead(BaseModel):
    id: int
    patient_id: int
    radiologist_id: int
    modality: ModalityEnum
    region: Optional[str] = None
    clinical_indication: Optional[str] = None
    study_datetime: datetime
    status: StudyStatus
    image_paths: List[str] = []
    created_at: datetime

    class Config:
        orm_mode = True


# Reports
class ReportDraftRequest(BaseModel):
    structured_answers: Dict[str, Any]


class ReportDraftResponse(BaseModel):
    study_id: int
    technique: str
    findings: str
    impression: str
    internal_checks: List[str]


class ReportFinalizeRequest(BaseModel):
    technique: Optional[str] = None
    findings: str
    impression: str


class ReportRead(BaseModel):
    id: int
    study_id: int
    technique: Optional[str] = None
    findings: Optional[str] = None
    impression: Optional[str] = None
    internal_checks: List[str] = []
    is_finalized: bool
    finalized_at: Optional[datetime] = None
    pdf_path: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
