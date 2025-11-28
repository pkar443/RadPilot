from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, date

from backend.database import Base
from backend.main import app
from backend import models
from backend.auth import get_password_hash, get_current_user
from backend.database import get_db

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


def override_current_user():
    db = TestingSessionLocal()
    user = db.query(models.User).filter(models.User.email == "tester@example.com").first()
    if not user:
        user = models.User(
            email="tester@example.com",
            full_name="Tester",
            hashed_password=get_password_hash("Password123!"),
            role="radiologist",
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    db.close()
    return user


app.dependency_overrides[get_current_user] = override_current_user

client = TestClient(app)


def test_draft_report(monkeypatch):
    db = TestingSessionLocal()
    user = override_current_user()
    patient = models.Patient(
        full_name="John Doe",
        nhi="ABC1234",
        local_patient_id="JD-001",
        dob=date(1970, 1, 1),
        sex="Male",
    )
    db.add(patient)
    db.commit()
    db.refresh(patient)

    study = models.Study(
        patient_id=patient.id,
        radiologist_id=user.id,
        modality=models.ModalityEnum.ABDOMINAL_ULTRASOUND,
        region="Abdomen",
        clinical_indication="RUQ pain",
        study_datetime=datetime.utcnow(),
    )
    db.add(study)
    db.commit()
    db.refresh(study)

    async def fake_generate(_messages, response_format=None):
        return {
            "content": '{"technique":"Test technique","findings":"Test findings","impression":"Test impression","internal_checks":["No inconsistencies detected."]}',
            "raw": {},
        }

    monkeypatch.setattr("backend.services.report_builder.generate_chat_completion", fake_generate)

    payload = {"structured_answers": {"liver": "Normal", "gallbladder_status": "Present"}}
    response = client.post(f"/api/studies/{study.id}/report/draft", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["technique"] == "Test technique"
    # Ensure report persisted
    report = db.query(models.Report).filter(models.Report.study_id == study.id).first()
    assert report is not None
    assert report.findings == "Test findings"
    db.close()
