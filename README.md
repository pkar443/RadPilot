# **AlloyDX Radiomed**
### *Guided, Consistent, AI-Assisted Radiology Reporting*

AlloyDX Radiomed is a web-based radiology reporting platform under the **AlloyDX.ai** ecosystem.  
It enables radiologists to generate **accurate, structured, and LLM-assisted reports** faster, with fewer errors, and with a standardized workflow that reduces variability between practitioners.

Radiomed combines a modern two-pane interface with structured questionnaires, DICOM viewing (via OHIF), and AI-powered report generation to streamline clinical reporting.

> ⚠️ **Pilot Use Only**  
> This tool is currently in **pilot testing**. All reports must be reviewed, corrected, and signed by a qualified radiologist. Uploaded images and metadata may be used in **de-identified form** for quality improvement and AI model training.

---

## 🚀 **Features**

### **Two-Pane Radiology Workspace**
- **Left Pane:** Full OHIF-powered DICOM viewer  
  - Pan / Zoom  
  - Window-level  
  - Slice scroll  
  - Multi-series support  
  - Measurements & annotations  
- **Right Pane:** Structured, one-question-at-a-time reporting assistant

### **Minimal Input, Maximum Accuracy**
- Radiologist only answers focused, organ-specific questions  
- System captures structured JSON  
- LLM generates a complete draft report:  
  - Technique  
  - Findings (organ-wise)  
  - Impression  

### **Supported Modalities (MVP)**
- **Abdominal Ultrasound**  
- **Abdominal CT Scan**  
- **Chest X-ray**  

### **Patient & Study Management**
- New patient via NHI lookup or manual entry  
- Existing patient history with previous studies  
- Secure upload of DICOM or JPG/PNG images  
- Auto-linking studies via StudyInstanceUID  
- Radiologist dashboard with recent activity

### **Report Generation & Export**
- AI-generated but fully editable report  
- Standardized formatting with:
  - Logo  
  - Patient details  
  - Organ-wise findings  
  - Final impression  
  - Radiologist details (from login profile)  
  - Study metadata  
- **Download PDF**, print, or **email to patient**  
- **QR code** embedded in PDF for secure digital download

### **Data Collection for Future AI Training**
- Stores:
  - Structured answers  
  - LLM-generated draft  
  - Radiologist final report  
  - Study metadata  
- Used to build future multimodal training datasets  
- Fully de-identified pipeline

### **Part of AlloyDX Platform**
- Radiomed (Radiologists) — *current app*  
- Multimodal Precision Health (Doctors) — *coming soon*  
  - Fuse radiology reports, lab results, & clinical findings  
  - Inspired by MedGemma-style multimodal architectures

---

## 🧱 **System Architecture**

### **Frontend**
- React / Next.js
- Embedded OHIF Viewer (iframe or native integration)
- Styled components / Material UI
- Secure sign-in & role-based workflow

### **Backend**
- FastAPI or Node.js  
- PostgreSQL / Supabase for structured storage  
- S3-compatible storage for DICOM files  
- Orthanc DICOM server with DICOMweb enabled  
- LLM report generation via OpenAI or local models

### **Data Flow**
`Radiologist → Upload Images → Orthanc → OHIF Viewer → Structured Q&A → LLM → Editable Report → Export/Save`

---

## 📁 **Suggested Project Structure**

```plaintext
AlloyDX-Radiomed/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── ohif-viewer/ (embedded or forked OHIF)
│   └── utils/
│
├── backend/
│   ├── api/
│   ├── models/
│   ├── services/
│   ├── routers/
│   └── utils/
│
├── dicom/
│   └── orthanc-config/
│
├── docs/
│   └── specs/
│
└── README.md

## Backend (FastAPI) Quickstart

1) Install deps  
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2) Set env vars (example)  
```bash
export OPENAI_API_KEY=sk-...
export JWT_SECRET_KEY=supersecret
export FRONTEND_ORIGIN=http://localhost:5173
export UPLOAD_DIR=./uploads
```

3) Run API  
```bash
uvicorn backend.main:app --reload --port 8000
```

4) Run tests  
```bash
pytest backend/tests/test_reports.py
```

4) Seed dummy data (radiologist + patient + US study)  
```bash
curl -X POST http://localhost:8000/api/seed
```

5) Example auth + draft report  
```bash
# login (after seed)
curl -X POST -d "username=dr.test@example.com&password=Password123!" http://localhost:8000/api/auth/login

# generate draft (replace TOKEN and STUDY_ID)
curl -X POST http://localhost:8000/api/studies/1/report/draft \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"structured_answers":{"liver":"Normal","gallbladder_status":"Present","gallstones":"No"}}'
```

Backend entrypoint: `backend/main.py` (FastAPI). CORS is enabled for `FRONTEND_ORIGIN`, uploads land in `UPLOAD_DIR/{study_id}/`, and draft/finalize/report download endpoints live under `/api`.
