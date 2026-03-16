from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import date
from pathlib import Path
import tempfile
import os

from generators import circuit_breaker, generic

app = FastAPI(title="ITC Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

EQUIPMENT_TYPES = [
    "circuit_breaker",
    "current_transformer",
    "voltage_transformer",
    "neutral_ct",
    "isolator",
    "earth_switch",
    "ows",
    "net",
    "power_transformer",
    "surge_arrestor",
]


class ITCRequest(BaseModel):
    equipment_type: str
    panel_numbers: list[str]
    cpp_project_name: str
    cpp_job_no: str
    bay_name: str
    prepared_by_name: str
    prepared_by_position: str
    checked_by_name: str
    checked_by_position: str
    checked_by_signature: str = ""
    client_project_title: str
    client_project_number: str
    site_location: str
    client_checked_by_name: str
    client_checked_by_position: str
    date: date


@app.get("/")
def root():
    return {"status": "ITC Generator API running"}


@app.get("/equipment-types")
def get_equipment_types():
    return {"equipment_types": EQUIPMENT_TYPES}


@app.post("/generate")
def generate_itc(req: ITCRequest):
    if req.equipment_type not in EQUIPMENT_TYPES:
        raise HTTPException(status_code=400, detail=f"Unknown equipment type: {req.equipment_type}")
    if not req.panel_numbers:
        raise HTTPException(status_code=400, detail="At least one panel number is required")

    from datetime import datetime
    data = req.model_dump()
    data["date"] = datetime.combine(req.date, datetime.min.time())

    with tempfile.NamedTemporaryFile(suffix=".xlsx", delete=False) as tmp:
        output_path = Path(tmp.name)

    try:
        if req.equipment_type == "circuit_breaker":
            circuit_breaker.generate(data, req.panel_numbers, output_path)
        else:
            generic.generate(req.equipment_type, data, req.panel_numbers, output_path)

        filename = f"{req.equipment_type}_ITCs.xlsx"
        return FileResponse(
            path=str(output_path),
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
    except Exception as e:
        if output_path.exists():
            os.unlink(output_path)
        raise HTTPException(status_code=500, detail=str(e))
