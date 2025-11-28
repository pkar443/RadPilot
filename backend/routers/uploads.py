import os
import logging
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from backend import models
from backend.auth import get_current_user
from backend.config import get_settings
from backend.database import get_db

router = APIRouter(prefix="/api/uploads", tags=["uploads"])
logger = logging.getLogger(__name__)
settings = get_settings()


@router.post("/{study_id}")
async def upload_files(
    study_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    study = db.query(models.Study).filter(models.Study.id == study_id).first()
    if not study:
        raise HTTPException(status_code=404, detail="Study not found")

    dest_dir = os.path.join(settings.upload_dir, str(study_id))
    os.makedirs(dest_dir, exist_ok=True)

    stored_files = []
    for file in files:
        dest_path = os.path.join(dest_dir, file.filename)
        with open(dest_path, "wb") as f:
            content = await file.read()
            f.write(content)
        file_type = "dicom" if file.filename.lower().endswith((".dcm", ".dicom")) else os.path.splitext(file.filename)[1].lstrip(".")
        stored_files.append({"filename": file.filename, "stored_path": dest_path, "type": file_type})

    # Update study image paths
    current_paths = study.image_paths or []
    current_paths.extend([f["stored_path"] for f in stored_files])
    study.image_paths = current_paths
    db.add(study)
    db.commit()
    logger.info("Uploaded %s files for study %s", len(stored_files), study_id)

    return {"study_id": study_id, "files": stored_files}
