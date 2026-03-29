import io
import sys
import unittest
import zipfile
from datetime import date
from pathlib import Path

from fastapi.testclient import TestClient
from openpyxl import load_workbook

BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from main import app


class GenerateMultiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_single_file_populates_signature_and_common_fields(self):
        response = self.client.post(
            "/generate-multi",
            json={
                "equipment_items": [
                    {
                        "equipment_type": "circuit_breaker",
                        "bay_name": "Circuit Breaker",
                        "panel_numbers": ["+C02-Q10"],
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
                "date": "2026-03-16",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            response.headers["content-type"].startswith(
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
        )

        workbook = load_workbook(io.BytesIO(response.content))
        worksheet = workbook["+C02-Q10"]

        self.assertEqual(worksheet["A1"].value, "Circuit Breaker +C02-Q10 SAT")
        self.assertEqual(worksheet["G9"].value, "Tailem Bend 3")
        self.assertEqual(worksheet["G12"].value, "+C02-Q10")
        self.assertEqual(worksheet["G18"].value, "F Maloney")
        self.assertEqual(worksheet["T11"].value, "205 Cormack Road")
        self.assertEqual(worksheet["G15"].number_format, "DD/MM/YYYY")
        self.assertEqual(worksheet["G19"].number_format, "DD/MM/YYYY")
        self.assertEqual(worksheet["G15"].value.date(), date(2026, 3, 16))
        self.assertEqual(worksheet["G19"].value.date(), date(2026, 3, 16))

    def test_multiple_files_return_zip_grouped_by_equipment_type(self):
        response = self.client.post(
            "/generate-multi",
            json={
                "equipment_items": [
                    {
                        "equipment_type": "circuit_breaker",
                        "bay_name": "Circuit Breaker",
                        "panel_numbers": ["+C02-Q10"],
                    },
                    {
                        "equipment_type": "ac_board",
                        "bay_name": "AC Board",
                        "panel_numbers": ["+AC-01"],
                    },
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
                "date": "2026-03-16",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.headers["content-type"].startswith("application/zip"))

        with zipfile.ZipFile(io.BytesIO(response.content)) as archive:
            names = sorted(archive.namelist())

        self.assertEqual(
            names,
            [
                "Ac Board/AC_01.xlsx",
                "Circuit Breaker/C02_Q10.xlsx",
            ],
        )


if __name__ == "__main__":
    unittest.main()
