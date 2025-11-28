import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.config import get_settings
from backend.database import Base, engine
from backend import auth
from backend.routers import patients, studies, uploads, reports, seed

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

# Create tables on startup (ok for SQLite/local dev)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AlloyDX Radiomed API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.exists(settings.upload_dir):
    os.makedirs(settings.upload_dir, exist_ok=True)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(studies.router)
app.include_router(uploads.router)
app.include_router(reports.router)
app.include_router(seed.router)

app.mount("/static", StaticFiles(directory="backend/static"), name="static")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
