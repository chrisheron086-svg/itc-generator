from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import date
from pathlib import Path
import tempfile
import zipfile
import os
import logging
import traceback
import shutil

from starlette.background import BackgroundTask

from generators import circuit_breaker, generic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TMP_ROOT = Path(__file__).parent / ".tmp"
TMP_ROOT.mkdir(exist_ok=True)

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
    "sel_751_feeder_relay",
    "ac_board",
    "aux_tf",
    "bess_pcs",
    "dc_panel",
    "feeder_panel",
]


class EquipmentItem(BaseModel):
    equipment_type: str
    bay_name: str
    panel_numbers: list[str]


class MultiITCRequest(BaseModel):
    equipment_items: list[EquipmentItem]
    cpp_project_name: str
    cpp_job_no: str
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


def cleanup_dir(path: Path):
    shutil.rmtree(path, ignore_errors=True)


@app.get("/")
def root():
    return {"status": "ITC Generator API running"}


@app.get("/equipment-types")
def get_equipment_types():
    return {"equipment_types": EQUIPMENT_TYPES}



class LoginRequest(BaseModel):
    password: str


@app.post("/login")
def login(req: LoginRequest):
    correct = os.environ.get("ITC_PASSWORD", "CPP2024!")
    if req.password == correct:
        return {"success": True}
    return {"success": False}


@app.post("/generate-multi")
def generate_multi(req: MultiITCRequest):
    if not req.equipment_items:
        raise HTTPException(status_code=400, detail="No equipment items provided")

    from datetime import datetime
    data = req.model_dump()
    data["date"] = datetime.combine(req.date, datetime.min.time())

    tmp_dir = Path(tempfile.mkdtemp(dir=TMP_ROOT))
    generated_files = []

    try:
        for item in req.equipment_items:
            logger.info(f"Processing equipment type: {item.equipment_type}")
            if item.equipment_type not in EQUIPMENT_TYPES:
                raise HTTPException(status_code=400, detail=f"Unknown equipment type: {item.equipment_type}")

            item_data = {**data, "bay_name": item.bay_name}

            for panel_num in item.panel_numbers:
                logger.info(f"Generating ITC for panel: {panel_num}")
                safe_name = panel_num.replace("+", "").replace("-", "_").replace("/", "_")
                output_path = tmp_dir / f"{item.equipment_type}_{safe_name}.xlsx"

                if item.equipment_type == "circuit_breaker":
                    circuit_breaker.generate(item_data, [panel_num], output_path)
                else:
                    generic.generate(item.equipment_type, item_data, [panel_num], output_path)

                logger.info(f"Successfully generated: {output_path}")
                generated_files.append((panel_num, item.equipment_type, output_path))

        # Single file — return xlsx directly
        if len(generated_files) == 1:
            _, _, output_path = generated_files[0]
            panel_num = generated_files[0][0]
            safe_name = panel_num.replace("+", "").replace("-", "_").replace("/", "_")
            return FileResponse(
                path=str(output_path),
                filename=f"{safe_name}.xlsx",
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                background=BackgroundTask(cleanup_dir, tmp_dir),
            )

        # Multiple files — zip with equipment type subfolders
        zip_path = tmp_dir / f"{req.cpp_project_name}_ITCs.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for panel_num, eq_type, xlsx_path in generated_files:
                safe_panel = panel_num.replace("+", "").replace("-", "_").replace("/", "_")
                folder = eq_type.replace("_", " ").title()
                zf.write(xlsx_path, arcname=f"{folder}/{safe_panel}.xlsx")

        safe_project = req.cpp_project_name.replace(" ", "_")
        return FileResponse(
            path=str(zip_path),
            filename=f"{safe_project}_ITCs.zip",
            media_type="application/zip",
            background=BackgroundTask(cleanup_dir, tmp_dir),
        )

    except HTTPException:
        cleanup_dir(tmp_dir)
        raise
    except Exception as e:
        logger.error(f"Error generating ITC: {traceback.format_exc()}")
        cleanup_dir(tmp_dir)
        raise HTTPException(status_code=500, detail=str(e))
