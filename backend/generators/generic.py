import openpyxl
from pathlib import Path
from .base import copy_sheet, copy_data_sheet, fill_common_fields

TEMPLATES = {
    "current_transformer": Path(__file__).parent.parent / "templates" / "Current_Transformer.xlsx",
    "voltage_transformer": Path(__file__).parent.parent / "templates" / "Voltage_Transformer.xlsx",
    "neutral_ct": Path(__file__).parent.parent / "templates" / "Neutral_CT.xlsx",
    "isolator": Path(__file__).parent.parent / "templates" / "Isolator.xlsx",
    "earth_switch": Path(__file__).parent.parent / "templates" / "Earth_Switch.xlsx",
    "ows": Path(__file__).parent.parent / "templates" / "OWS.xlsx",
    "net": Path(__file__).parent.parent / "templates" / "NET.xlsx",
    "power_transformer": Path(__file__).parent.parent / "templates" / "Power_Transformer.xlsx",
    "surge_arrestor": Path(__file__).parent.parent / "templates" / "Surge_Arrestor.xlsx",
}

LABELS = {
    "current_transformer": "Current Transformer",
    "voltage_transformer": "Voltage Transformer",
    "neutral_ct": "Neutral CT",
    "isolator": "Isolator",
    "earth_switch": "Earth Switch",
    "ows": "OWS",
    "net": "NET",
    "power_transformer": "Power Transformer",
    "surge_arrestor": "Surge Arrestor",
}


def generate(equipment_type: str, data: dict, panel_numbers: list[str], output_path: Path):
    template = TEMPLATES[equipment_type]
    label = LABELS[equipment_type]

    wb_orig = openpyxl.load_workbook(template)
    ws_src = wb_orig[wb_orig.sheetnames[0]]

    wb_new = openpyxl.Workbook()
    wb_new.remove(wb_new.active)
    copy_data_sheet(wb_orig, wb_new)

    for panel_num in panel_numbers:
        title = f"{label} {panel_num} SAT"
        ws = copy_sheet(ws_src, wb_new, panel_num)
        fill_common_fields(ws, data, panel_num, title)

    wb_new.save(output_path)
