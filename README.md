# ITC Generator - Consolidated Power Projects

Internal web app for generating pre-filled Inspection and Test Certificate (ITC) Excel files for commissioning equipment.

## What It Does

- Password-protected login for internal use
- Step-by-step wizard: Project -> Personnel -> Equipment -> Panels -> Review
- Supports multiple equipment types in a single request
- Generates one ITC sheet per panel number
- Returns a single `.xlsx` for one ITC, or a `.zip` grouped by equipment type for multiple ITCs
- Preserves the original template layout, merged cells, and print settings
- Fills the standard CPP/client header fields, including checked-by signature in `G18`

## Supported Equipment Types

- Circuit Breaker
- Current Transformer
- Voltage Transformer
- Neutral CT
- Isolator
- Earth Switch
- OWS
- NET
- Power Transformer
- Surge Arrestor
- SEL 751 Feeder Relay
- AC Board
- Auxiliary Transformer
- BESS PCS
- DC Panel
- Feeder Panel

## Project Structure

```text
itc-generator/
|-- backend/
|   |-- main.py
|   |-- requirements.txt
|   |-- Dockerfile
|   |-- generators/
|   |   |-- base.py
|   |   |-- circuit_breaker.py
|   |   `-- generic.py
|   |-- templates/
|   |   |-- Primary_ITCs/
|   |   `-- Protection_Secondary_ITCs/
|   `-- tests/
|       `-- test_generate_multi.py
|-- frontend/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- index.js
|   |   |-- index.css
|   |   `-- components/
|   |-- Dockerfile
|   `-- nginx.conf
|-- docs/
|   `-- ADD_TEMPLATE_PROCEDURE.md
|-- docker-compose.yml
`-- .github/workflows/deploy.yml
```

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 20+
- Docker Desktop (optional)

### Option 1 - Run with Docker Compose

```bash
docker compose up --build
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

The frontend Docker image accepts `REACT_APP_API_URL` as a build-time argument. The compose file leaves it blank so the bundled nginx config can proxy `/login`, `/equipment-types`, and `/generate-multi` to the backend container.

### Option 2 - Run Manually

Backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm start
```

`frontend/package.json` contains a development proxy to `http://localhost:8000`, so `npm start` does not require `REACT_APP_API_URL`.

## Authentication

The backend reads the app password from the `ITC_PASSWORD` environment variable. If it is not set, the fallback password is `CPP2024!`.

Set it explicitly in any shared or deployed environment.

## Testing

Backend:

```bash
cd backend
python -m unittest discover -s tests
```

Frontend:

```bash
cd frontend
npm run build
```

## Deployment

### Backend

Deploy the `backend/` folder to Render, Railway, or another Python host. Set:

- `ITC_PASSWORD`

### Frontend

For standalone frontend deployments, set `REACT_APP_API_URL` to the backend base URL at build time, for example:

```bash
REACT_APP_API_URL=https://your-backend.example.com npm run build
```

### GitHub Actions

`.github/workflows/deploy.yml` now:

- installs backend dependencies
- lints the backend with Ruff
- runs backend generation tests
- installs frontend dependencies
- builds the frontend
- triggers Render/Vercel deploy hooks when `RENDER_DEPLOY_HOOK_URL` and/or `VERCEL_DEPLOY_HOOK_URL` repository secrets are configured

## Adding New Equipment Types

Templates are now grouped under:

- `backend/templates/Primary_ITCs/`
- `backend/templates/Protection_Secondary_ITCs/`

See `docs/ADD_TEMPLATE_PROCEDURE.md` for the current template onboarding procedure.

## API Reference

### `POST /login`

```json
{
  "password": "CPP2024!"
}
```

### `GET /equipment-types`

Returns the list of supported equipment keys.

### `POST /generate-multi`

Generates and returns either:

- a single `.xlsx` file when one ITC is requested
- a `.zip` file when multiple ITCs are requested

Example request body:

```json
{
  "equipment_items": [
    {
      "equipment_type": "circuit_breaker",
      "bay_name": "Circuit Breaker",
      "panel_numbers": ["+C02-Q10", "+C02-Q20"]
    },
    {
      "equipment_type": "ac_board",
      "bay_name": "AC Board",
      "panel_numbers": ["+AC-01"]
    }
  ],
  "cpp_project_name": "Tailem Bend 3",
  "cpp_job_no": "12345",
  "prepared_by_name": "Chris Heron",
  "prepared_by_position": "Senior Commissioning Officer",
  "checked_by_name": "Frank Maloney",
  "checked_by_position": "Commissioning Manager",
  "checked_by_signature": "F Maloney",
  "client_project_title": "Tailem Bend 3 BESS",
  "client_project_number": "12345",
  "site_location": "205 Cormack Road",
  "client_checked_by_name": "Andrew Pezzuto",
  "client_checked_by_position": "Senior Electrical Engineer",
  "date": "2026-03-16"
}
```

## Tech Stack

- Frontend: React 18, styled-components, axios
- Backend: FastAPI, Pydantic, openpyxl
- Containers: Docker, Docker Compose, nginx
- CI/CD: GitHub Actions plus optional deploy hooks
