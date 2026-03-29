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

from generators import circuit_breaker, generic

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ITC Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMPLATES_ROOT = Path(__file__).parent / "templates"

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

TEMPLATE_FILENAMES = {
    "circuit_breaker": "Circuit_Breaker.xlsx",
    "current_transformer": "Current_Transformer.xlsx",
    "voltage_transformer": "Voltage_Transformer.xlsx",
    "neutral_ct": "Neutral_CT.xlsx",
    "isolator": "Isolator.xlsx",
    "earth_switch": "Earth_Switch.xlsx",
    "ows": "OWS.xlsx",
    "net": "NET.xlsx",
    "power_transformer": "Power_Transformer.xlsx",
    "surge_arrestor": "Surge_Arrestor.xlsx",
    "sel_751_feeder_relay": "SEL_751_Feeder_Relay.xlsx",
    "ac_board": "AC_Board.xlsx",
    "aux_tf": "Aux_TF.xlsx",
    "bess_pcs": "BESS_PCS.xlsx",
    "dc_panel": "DC_Panel.xlsx",
    "feeder_panel": "Feeder_Panel.xlsx",
}

LABELS = {
    "circuit_breaker": "Circuit Breaker",
    "current_transformer": "Current Transformer",
    "voltage_transformer": "Voltage Transformer",
    "neutral_ct": "Neutral CT",
    "isolator": "Isolator",
    "earth_switch": "Earth Switch",
    "ows": "OWS",
    "net": "NET",
    "power_transformer": "Power Transformer",
    "surge_arrestor": "Surge Arrestor",
    "sel_751_feeder_relay": "SEL 751 Feeder Relay",
    "ac_board": "AC Board",
    "aux_tf": "Auxiliary Transformer",
    "bess_pcs": "BESS PCS",
    "dc_panel": "DC Panel",
    "feeder_panel": "Feeder Panel",
}


def find_template(equipment_type: str, template_folder: str) -> Path:
    """Find template in client folder first, fall back to legacy subfolders."""
    filename = TEMPLATE_FILENAMES.get(equipment_type)
    if not filename:
        raise FileNotFoundError(f"Unknown equipment type: {equipment_type}")

    # 1. Check client-specific folder
    if template_folder:
        client_path = TEMPLATES_ROOT / template_folder / filename
        if client_path.exists():
            return client_path

    # 2. Fall back to Primary_ITCs subfolder
    primary_path = TEMPLATES_ROOT / "Primary_ITCs" / filename
    if primary_path.exists():
        return primary_path

    # 3. Fall back to Protection_Secondary_ITCs subfolder
    secondary_path = TEMPLATES_ROOT / "Protection_Secondary_ITCs" / filename
    if secondary_path.exists():
        return secondary_path

    # 4. Fall back to templates root
    root_path = TEMPLATES_ROOT / filename
    if root_path.exists():
        return root_path

    raise FileNotFoundError(
        f"Template '{filename}' not found for client folder '{template_folder}'"
    )


class EquipmentItem(BaseModel):
    equipment_type: str
    bay_name: str
    panel_numbers: list[str]
    reference: str = ""
    functional_location: str = ""


class MultiITCRequest(BaseModel):
    equipment_items: list[EquipmentItem]
    template_folder: str = ""
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


class LoginRequest(BaseModel):
    password: str


@app.get("/")
def root():
    return {"status": "ITC Generator API running"}


@app.get("/equipment-types")
def get_equipment_types():
    return {"equipment_types": EQUIPMENT_TYPES}


@app.post("/login")
def login(req: LoginRequest):
    correct = os.environ.get("ITC_PASSWORD", "CPPCommissioning@1")
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

    tmp_dir = Path(tempfile.mkdtemp())
    generated_files = []

    try:
        for item in req.equipment_items:
            logger.info(f"Processing: {item.equipment_type} — {item.panel_numbers}")

            if item.equipment_type not in EQUIPMENT_TYPES:
                raise HTTPException(status_code=400, detail=f"Unknown equipment type: {item.equipment_type}")

            # Find template in client folder or fallback
            try:
                template_path = find_template(item.equipment_type, req.template_folder)
            except FileNotFoundError as e:
                raise HTTPException(status_code=400, detail=str(e))

            item_data = {
                **data,
                "bay_name": item.bay_name,
                "reference": item.reference,
                "functional_location": item.functional_location,
            }

            for panel_num in item.panel_numbers:
                safe_name = panel_num.replace("+", "").replace("-", "_").replace("/", "_")
                output_path = tmp_dir / f"{item.equipment_type}_{safe_name}.xlsx"

                if item.equipment_type == "circuit_breaker":
                    circuit_breaker.generate(item_data, [panel_num], output_path, template_path)
                else:
                    generic.generate(item.equipment_type, item_data, [panel_num], output_path, template_path)

                logger.info(f"Generated: {output_path}")
                generated_files.append((panel_num, item.equipment_type, output_path, item.reference))

        # Single file — return xlsx directly
        if len(generated_files) == 1:
            panel_num, _, output_path, reference = generated_files[0]
            safe_panel = panel_num.replace("/", "-")
            safe_ref = reference if reference else ""
            filename = f"{safe_ref} {safe_panel}.xlsx".strip() if safe_ref else f"{safe_panel}.xlsx"
            return FileResponse(
                path=str(output_path),
                filename=filename,
                media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )

        # Multiple files — zip with equipment type subfolders
        safe_project = req.cpp_project_name.replace(" ", "_")
        zip_path = tmp_dir / f"{safe_project}_ITCs.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
            for panel_num, eq_type, xlsx_path, reference in generated_files:
                safe_panel = panel_num.replace("/", "-")
                safe_ref = reference if reference else ""
                filename = f"{safe_ref} {safe_panel}.xlsx".strip() if safe_ref else f"{safe_panel}.xlsx"
                folder = LABELS.get(eq_type, eq_type).replace(" ", "_")
                zf.write(xlsx_path, arcname=f"{folder}/{filename}")

        return FileResponse(
            path=str(zip_path),
            filename=f"{safe_project}_ITCs.zip",
            media_type="application/zip",
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))
