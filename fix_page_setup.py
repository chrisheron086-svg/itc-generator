"""
Run this script from your itc-generator folder:
python fix_page_setup.py

It will update all xlsx files in backend/templates/Primary_ITCs/
to A4 Portrait with all columns fit to one page.
"""
import openpyxl
from openpyxl.worksheet.page import PageMargins
from openpyxl.worksheet.properties import WorksheetProperties, PageSetupProperties
from pathlib import Path

TEMPLATES_DIR = Path("backend/templates/Primary_ITCs")

files = list(TEMPLATES_DIR.glob("*.xlsx"))
print(f"Found {len(files)} files to update...\n")

for path in files:
    try:
        wb = openpyxl.load_workbook(path)
        for sheet_name in wb.sheetnames:
            ws = wb[sheet_name]
            ws.sheet_properties = WorksheetProperties(
                pageSetUpPr=PageSetupProperties(fitToPage=True)
            )
            ws.page_setup.paperSize = ws.PAPERSIZE_A4
            ws.page_setup.orientation = ws.ORIENTATION_PORTRAIT
            ws.page_setup.fitToWidth = 1
            ws.page_setup.fitToHeight = 0
            ws.page_margins = PageMargins(
                left=0.5, right=0.5, top=0.75, bottom=0.75,
                header=0.3, footer=0.3
            )
        wb.save(path)
        print(f"  ✓ {path.name}")
    except Exception as e:
        print(f"  ✗ {path.name}: {e}")

print("\nDone! All templates updated to A4 Portrait.")
