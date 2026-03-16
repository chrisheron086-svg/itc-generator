# ITC Generator — Consolidated Power Projects

A web app for generating pre-filled Inspection and Test Certificate (ITC) Excel files for commissioning equipment.

## Features

- Supports 10 equipment types (Circuit Breaker, CT, VT, Isolator, and more)
- Step-by-step form — Equipment → Project → Personnel → Panel Numbers → Generate
- Generates one ITC sheet per panel number in a single `.xlsx` file
- A4 landscape, all columns fit to one page wide
- All formatting and test content preserved from original templates

---

## Project Structure

```
itc-generator/
├── backend/                  # FastAPI Python backend
│   ├── main.py               # API routes
│   ├── generators/
│   │   ├── base.py           # Shared copy + fill logic
│   │   ├── circuit_breaker.py
│   │   └── generic.py        # All other equipment types
│   ├── templates/            # Blank .xlsx ITC templates
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── App.jsx           # Step wizard shell
│   │   └── components/
│   │       ├── EquipmentSelect.jsx
│   │       ├── ProjectDetails.jsx
│   │       ├── PersonnelDetails.jsx
│   │       ├── PanelNumbers.jsx
│   │       └── ReviewGenerate.jsx
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml        # Local dev environment
└── .github/workflows/
    └── deploy.yml            # CI/CD pipeline
```

---

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 20+
- (Optional) Docker & Docker Compose

### Option 1 — Run with Docker Compose

```bash
git clone https://github.com/YOUR_ORG/itc-generator.git
cd itc-generator
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2 — Run manually

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

---

## Deployment

### Backend — Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Set root directory to `backend`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend — Vercel
1. Import repo on [vercel.com](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com`

### CI/CD
The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:
- Lints and tests the backend
- Builds the frontend
- Add your Render/Vercel deploy hooks to the `deploy` job

---

## Adding New Equipment Types

1. Add the blank `.xlsx` template to `backend/templates/`
2. Add the key/label to `TEMPLATES` and `LABELS` in `backend/generators/generic.py`
3. Add the option to the `EQUIPMENT` array in `frontend/src/components/EquipmentSelect.jsx`

---

## API Reference

### `POST /generate`

Generates and returns an `.xlsx` file.

**Request body:**
```json
{
  "equipment_type": "circuit_breaker",
  "panel_numbers": ["+C02-Q10", "+C02-Q20"],
  "cpp_project_name": "Tailem Bend 3",
  "cpp_job_no": "12345",
  "bay_name": "Circuit Breaker",
  "client_project_title": "Tailem Bend 3 BESS",
  "client_project_number": "12345",
  "site_location": "205 Cormack Road",
  "prepared_by_name": "Chris Heron",
  "prepared_by_position": "Senior Commissioning Officer",
  "checked_by_name": "Frank Maloney",
  "checked_by_position": "Commissioning Manager",
  "checked_by_signature": "F Maloney",
  "client_checked_by_name": "Andrew Pezzuto",
  "client_checked_by_position": "Senior Electrical Engineer",
  "date": "2026-03-16"
}
```

**Response:** `.xlsx` file download

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, styled-components |
| Backend | Python 3.11, FastAPI |
| Excel | openpyxl |
| Containerisation | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Hosting | Render (backend) + Vercel (frontend) |
