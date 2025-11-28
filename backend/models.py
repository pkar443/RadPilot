import enum
from datetime import datetime
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from backend.database import Base


class ModalityEnum(str, enum.Enum):
    ABDOMINAL_ULTRASOUND = "ABDOMINAL_ULTRASOUND"
    ABDOMINAL_CT = "ABDOMINAL_CT"
    CHEST_XRAY = "CHEST_XRAY"


class StudyStatus(str, enum.Enum):
    draft = "draft"
    finalized = "finalized"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="radiologist")
    created_at = Column(DateTime, default=datetime.utcnow)

    studies = relationship("Study", back_populates="radiologist")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    nhi = Column(String, unique=True, nullable=True)
    local_patient_id = Column(String, nullable=True)
    dob = Column(Date, nullable=True)
    sex = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    studies = relationship("Study", back_populates="patient")


class Study(Base):
    __tablename__ = "studies"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    radiologist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    modality = Column(Enum(ModalityEnum), nullable=False)
    region = Column(String, nullable=True)
    clinical_indication = Column(Text, nullable=True)
    study_datetime = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(StudyStatus), default=StudyStatus.draft)
    image_paths = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="studies")
    radiologist = relationship("User", back_populates="studies")
    report = relationship("Report", back_populates="study", uselist=False)


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(Integer, ForeignKey("studies.id"), nullable=False, unique=True)
    technique = Column(Text, nullable=True)
    findings = Column(Text, nullable=True)
    impression = Column(Text, nullable=True)
    internal_checks = Column(JSON, default=list)
    raw_llm_response = Column(JSON, nullable=True)
    is_finalized = Column(Boolean, default=False)
    finalized_at = Column(DateTime, nullable=True)
    pdf_path = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    study = relationship("Study", back_populates="report")
