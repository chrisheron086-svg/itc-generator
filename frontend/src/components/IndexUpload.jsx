import React, { useState } from "react";
import styled from "styled-components";
import * as XLSX from "xlsx";
import { StepTitle, StepDesc, BtnRow, Btn } from "./ui";

const UploadZone = styled.div`
  border: 2px dashed ${p => p.dragging ? "var(--accent)" : "var(--border)"};
  border-radius: var(--radius);
  padding: 40px 20px;
  text-align: center;
  background: ${p => p.dragging ? "rgba(158,5,59,0.04)" : "var(--surface2)"};
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
  &:hover { border-color: var(--accent); background: rgba(158,5,59,0.04); }
`;

const UploadIcon = styled.div`
  font-size: 36px;
  margin-bottom: 12px;
`;

const UploadLabel = styled.p`
  font-size: 13px;
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 4px;
`;

const UploadHint = styled.p`
  font-size: 11px;
  color: var(--text-muted);
`;

const PreviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 16px;
  th {
    background: var(--accent);
    color: white;
    padding: 8px 10px;
    text-align: left;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  td {
    padding: 7px 10px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
  }
  tr:nth-child(even) td { background: var(--surface2); }
  tr:hover td { background: rgba(158,5,59,0.04); }
`;

const CheckTd = styled.td`
  width: 36px;
  text-align: center;
`;

const Checkbox = styled.input`
  width: 15px;
  height: 15px;
  cursor: pointer;
  accent-color: var(--accent);
`;

const SummaryBar = styled.div`
  background: rgba(158,5,59,0.06);
  border: 1px solid rgba(158,5,59,0.2);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectAll = styled.button`
  background: none;
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  color: var(--accent);
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  cursor: pointer;
  &:hover { background: rgba(158,5,59,0.08); }
`;

const ErrorBox = styled.div`
  background: rgba(158,5,59,0.07);
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const EQUIPMENT_TYPE_MAP = {
  "circuit breaker": "circuit_breaker",
  "current transformer": "current_transformer",
  "voltage transformer": "voltage_transformer",
  "neutral ct": "neutral_ct",
  "isolator": "isolator",
  "earth switch": "earth_switch",
  "ows": "ows",
  "net": "net",
  "power transformer": "power_transformer",
  "surge arrestor": "surge_arrestor",
  "surge arrester": "surge_arrestor",
  "sel 751 feeder relay": "sel_751_feeder_relay",
  "ac board": "ac_board",
  "aux tf": "aux_tf",
  "auxiliary transformer": "aux_tf",
  "bess pcs": "bess_pcs",
  "dc panel": "dc_panel",
  "feeder panel": "feeder_panel",
};

function extractPanelNumber(colB) {
  const match = colB.match(/\+[\w\-]+/);
  return match ? match[0] : colB;
}

function parseIndex(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets["ITP SAT"];
        if (!ws) { reject("Could not find 'ITP SAT' sheet in the file."); return; }
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });

        const items = [];
        for (let i = 16; i < rows.length; i++) {
          const row = rows[i];
          const colB = row[1];
          const colI = row[8];
          const colQ = row[16];
          if (!colQ || !colB || !colI) continue;
          const typeKey = XLSX.utils.format_cell ? String(colQ).trim().toLowerCase() : String(colQ).trim().toLowerCase();
          const equipType = EQUIPMENT_TYPE_MAP[typeKey];
          if (!equipType) continue;
          const panelNum = extractPanelNumber(String(colB));
          items.push({
            id: i,
            colB: String(colB).trim(),
            reference: String(colI).trim(),
            itcType: String(colQ).trim(),
            equipment_type: equipType,
            panel_number: panelNum,
            selected: true,
          });
        }
        resolve(items);
      } catch (err) {
        reject("Error reading file: " + err.message);
      }
    };
    reader.onerror = () => reject("Failed to read file.");
    reader.readAsArrayBuffer(file);
  });
}

export default function IndexUpload({ form, update, next, back }) {
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState(form.index_items || []);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState(form.index_file_name || "");

  const handleFile = async (file) => {
    setError("");
    try {
      const parsed = await parseIndex(file);
      if (parsed.length === 0) {
        setError("No rows with an ITC Type found in Column Q of the ITP SAT sheet.");
        return;
      }
      setItems(parsed);
      setFileName(file.name);
      update({ index_items: parsed, index_file_name: file.name });
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to parse file.");
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  const toggleItem = (id) => {
    const updated = items.map(item => item.id === id ? { ...item, selected: !item.selected } : item);
    setItems(updated);
    update({ index_items: updated });
  };

  const toggleAll = () => {
    const allSelected = items.every(i => i.selected);
    const updated = items.map(item => ({ ...item, selected: !allSelected }));
    setItems(updated);
    update({ index_items: updated });
  };

  const selectedCount = items.filter(i => i.selected).length;
  const allSelected = items.length > 0 && items.every(i => i.selected);

  return (
    <div>
      <StepTitle>Upload Index</StepTitle>
      <StepDesc>Upload your ITC Index spreadsheet — ITCs will be generated from the ITP SAT tab</StepDesc>

      <UploadZone
        dragging={dragging}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById("index-file-input").click()}
      >
        <UploadIcon>📋</UploadIcon>
        <UploadLabel>{fileName || "Click or drag & drop your index file here"}</UploadLabel>
        <UploadHint>.xlsx or .xlsm — ITP SAT tab, Column B, I and Q</UploadHint>
        <input id="index-file-input" type="file" accept=".xlsx,.xlsm" style={{ display: "none" }} onChange={onFileChange} />
      </UploadZone>

      {error && <ErrorBox>⚠ {error}</ErrorBox>}

      {items.length > 0 && (
        <>
          <SummaryBar>
            <span>{selectedCount} of {items.length} ITCs selected</span>
            <SelectAll onClick={toggleAll}>{allSelected ? "Deselect All" : "Select All"}</SelectAll>
          </SummaryBar>

          <PreviewTable>
            <thead>
              <tr>
                <th style={{ width: 36 }}></th>
                <th>Functional Location</th>
                <th>Reference</th>
                <th>ITC Type</th>
                <th>Panel No.</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} onClick={() => toggleItem(item.id)} style={{ cursor: "pointer" }}>
                  <CheckTd>
                    <Checkbox
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleItem(item.id)}
                      onClick={e => e.stopPropagation()}
                    />
                  </CheckTd>
                  <td>{item.colB}</td>
                  <td>{item.reference}</td>
                  <td>{item.itcType}</td>
                  <td style={{ color: "var(--accent)", fontWeight: 700 }}>{item.panel_number}</td>
                </tr>
              ))}
            </tbody>
          </PreviewTable>
        </>
      )}

      <BtnRow>
        <Btn onClick={back}>← Back</Btn>
        <Btn primary disabled={selectedCount === 0} onClick={next}>
          Next → ({selectedCount} ITC{selectedCount !== 1 ? "s" : ""})
        </Btn>
      </BtnRow>
    </div>
  );
}
