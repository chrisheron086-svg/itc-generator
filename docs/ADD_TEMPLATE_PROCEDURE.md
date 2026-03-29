# ITC Generator - Add Template Procedure

Current internal procedure for adding a new equipment template to the ITC Generator.

## Prerequisites

- Git installed
- Project checked out locally
- New blank ITC template saved as `.xlsx`

## Step 1 - Prepare the Excel Template

Your blank template should follow the standard CPP ITC layout. The generator fills these cells automatically at runtime:

| Cell | Field |
| --- | --- |
| `A1` | Title |
| `G9` | CPP Project Name |
| `G10` | CPP Job No |
| `G11` | Bay / Equipment Name |
| `G12` | Panel Number |
| `G13` | Prepared By - Name |
| `G14` | Prepared By - Position |
| `G15` | Prepared By - Date |
| `G16` | Checked By - Name |
| `G17` | Checked By - Position |
| `G18` | Checked By - Signature |
| `G19` | Checked By - Date |
| `T9` | Client Project Title |
| `T10` | Client Project Number |
| `T11` | Site Location |
| `T13` | Client Checked By - Name |
| `T14` | Client Checked By - Position |

Notes:

- Save the template as `.xlsx`, not `.xlsm`
- Avoid merged cells that block the writable cells above
- Keep the first worksheet as the main ITC sheet
- If the workbook has a `Data` sheet, it will be copied into generated workbooks

## Step 2 - Copy the Template File

Copy the template into the correct category folder:

```text
backend/templates/Primary_ITCs/
```

or

```text
backend/templates/Protection_Secondary_ITCs/
```

Use a clear filename with underscores, for example:

```text
My_New_Equipment.xlsx
```

## Step 3 - Register It in the Backend

Open:

```text
backend/generators/generic.py
```

Add the new template path to `TEMPLATES`:

```python
"my_new_equipment": PRIMARY_TEMPLATES_DIR / "My_New_Equipment.xlsx",
```

For protection or secondary templates, use:

```python
"my_new_equipment": PROTECTION_SECONDARY_TEMPLATES_DIR / "My_New_Equipment.xlsx",
```

Add the label to `LABELS`:

```python
"my_new_equipment": "My New Equipment",
```

Then open:

```text
backend/main.py
```

Add the key to `EQUIPMENT_TYPES`:

```python
"my_new_equipment",
```

Use lowercase letters and underscores for the key, and keep it identical everywhere.

## Step 4 - Add It to the Frontend

Open:

```text
frontend/src/components/EquipmentSelect.jsx
```

Add the new option to either `PRIMARY` or `SECONDARY`:

```javascript
{ value: "my_new_equipment", label: "My New Equipment" },
```

## Step 5 - Test It Locally

Recommended quick checks:

```bash
cd backend
python -m unittest discover -s tests
```

```bash
cd frontend
npm run build
```

Then run the app and generate at least one real ITC using the new template.

## Step 6 - Push and Deploy

```bash
git add .
git commit -m "Add my new equipment template"
git push
```

If deploy hooks are configured in GitHub Actions, pushes to `main` will trigger them automatically.

## Checklist

- Template saved as `.xlsx`
- Required writable cells exist
- Template copied into the correct `backend/templates/...` subfolder
- Key added to `TEMPLATES`
- Label added to `LABELS`
- Key added to `EQUIPMENT_TYPES`
- Frontend option added to the correct equipment category
- Backend tests pass
- Frontend build passes
- New equipment type generates a valid workbook locally
