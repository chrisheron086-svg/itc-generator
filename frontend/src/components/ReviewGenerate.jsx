import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { StepTitle, StepDesc, BtnRow, Btn } from "./ui";

const API = process.env.REACT_APP_API_URL || "";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
  font-size: 13px;
  tr { border-bottom: 1px solid var(--border); }
  td {
    padding: 9px 6px;
    &:first-child { color: var(--text-muted); width: 40%; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    &:last-child { color: var(--text); font-weight: 500; }
  }
`;

const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent);
  margin: 20px 0 8px;
  padding-bottom: 6px;
  border-bottom: 2px solid var(--accent);
`;

const PreviewTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin-bottom: 20px;
  th { background: var(--accent); color: white; padding: 7px 8px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 6px 8px; border-bottom: 1px solid var(--border); }
  tr:nth-child(even) td { background: var(--surface2); }
`;

const Tag = styled.span`
  background: rgba(158,5,59,0.07);
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 3px;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 700;
  display: inline-block;
  margin: 2px;
`;

const Status = styled.div`
  padding: 14px 16px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  margin-top: 16px;
  background: ${p => p.error ? "rgba(158,5,59,0.07)" : "rgba(42,122,42,0.07)"};
  border: 1px solid ${p => p.error ? "var(--danger)" : "var(--success)"};
  color: ${p => p.error ? "var(--danger)" : "var(--success)"};
`;

const TotalBadge = styled.div`
  background: var(--accent);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: var(--radius);
  margin-bottom: 20px;
  display: inline-block;
`;

export default function ReviewGenerate({ form, mode, back }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Work out total ITCs
  const totalITCs = mode === "index"
    ? (form.index_items || []).filter(i => i.selected).length
    : form.equipment_items.reduce((sum, e) => sum + e.panel_numbers.length, 0);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      let payload;

      if (mode === "index") {
        const selected = (form.index_items || []).filter(i => i.selected);
        // Group by equipment type, pass reference and colB
        const equipment_items = [];
        for (const item of selected) {
          equipment_items.push({
            equipment_type: item.equipment_type,
            bay_name: item.colB,
            panel_numbers: [item.panel_number],
            reference: item.reference,
            functional_location: item.colB,
          });
        }
        payload = {
          equipment_items,
          cpp_project_name: form.cpp_project_name,
          cpp_job_no: form.cpp_job_no,
          client_project_title: form.client_project_title,
          client_project_number: form.client_project_number,
          site_location: form.site_location,
          prepared_by_name: form.prepared_by_name,
          prepared_by_position: form.prepared_by_position,
          checked_by_name: form.checked_by_name,
          checked_by_position: form.checked_by_position,
          checked_by_signature: form.checked_by_signature,
          client_checked_by_name: form.client_checked_by_name,
          client_checked_by_position: form.client_checked_by_position,
          date: form.date,
        };
      } else {
        payload = {
          equipment_items: form.equipment_items,
          cpp_project_name: form.cpp_project_name,
          cpp_job_no: form.cpp_job_no,
          client_project_title: form.client_project_title,
          client_project_number: form.client_project_number,
          site_location: form.site_location,
          prepared_by_name: form.prepared_by_name,
          prepared_by_position: form.prepared_by_position,
          checked_by_name: form.checked_by_name,
          checked_by_position: form.checked_by_position,
          checked_by_signature: form.checked_by_signature,
          client_checked_by_name: form.client_checked_by_name,
          client_checked_by_position: form.client_checked_by_position,
          date: form.date,
        };
      }

      const res = await axios.post(`${API}/generate-multi`, payload, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = totalITCs === 1 ? `ITC.xlsx` : `${form.cpp_project_name}_ITCs.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.detail || e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedIndexItems = (form.index_items || []).filter(i => i.selected);

  return (
    <div>
      <StepTitle>Review & Generate</StepTitle>
      <StepDesc>Confirm all details before generating your ITCs</StepDesc>

      <TotalBadge>{totalITCs} ITC{totalITCs !== 1 ? "s" : ""} ready to generate</TotalBadge>

      <SectionTitle>Project Details</SectionTitle>
      <Table>
        <tbody>
          <tr><td>CPP Project</td><td>{form.cpp_project_name}</td></tr>
          <tr><td>CPP Job No</td><td>{form.cpp_job_no}</td></tr>
          <tr><td>Client Project</td><td>{form.client_project_title}</td></tr>
          <tr><td>Client Job No</td><td>{form.client_project_number}</td></tr>
          <tr><td>Site Location</td><td>{form.site_location}</td></tr>
          <tr><td>Date</td><td>{form.date}</td></tr>
        </tbody>
      </Table>

      <SectionTitle>Personnel</SectionTitle>
      <Table>
        <tbody>
          <tr><td>Prepared By</td><td>{form.prepared_by_name} — {form.prepared_by_position}</td></tr>
          <tr><td>Checked By</td><td>{form.checked_by_name} — {form.checked_by_position}</td></tr>
          <tr><td>Client Checked By</td><td>{form.client_checked_by_name} — {form.client_checked_by_position}</td></tr>
        </tbody>
      </Table>

      <SectionTitle>Equipment & Panels</SectionTitle>

      {mode === "index" ? (
        <PreviewTable>
          <thead>
            <tr>
              <th>Functional Location</th>
              <th>Reference</th>
              <th>ITC Type</th>
              <th>Panel No.</th>
            </tr>
          </thead>
          <tbody>
            {selectedIndexItems.map(item => (
              <tr key={item.id}>
                <td>{item.colB}</td>
                <td style={{ color: "var(--text-muted)", fontSize: 11 }}>{item.reference}</td>
                <td>{item.itcType}</td>
                <td style={{ color: "var(--accent)", fontWeight: 700 }}>{item.panel_number}</td>
              </tr>
            ))}
          </tbody>
        </PreviewTable>
      ) : (
        form.equipment_items.map(item => (
          <div key={item.equipment_type} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
            <div style={{ fontWeight: 700, minWidth: 160 }}>{item.bay_name}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "flex-end" }}>
              {item.panel_numbers.map(p => <Tag key={p}>{p}</Tag>)}
            </div>
          </div>
        ))
      )}

      {error && <Status error>⚠ {error}</Status>}
      {success && <Status>✓ ITCs generated! Check your downloads folder.</Status>}

      <BtnRow>
        <Btn onClick={back}>← Back</Btn>
        <Btn primary onClick={generate} disabled={loading}>
          {loading ? "Generating..." : `Generate ${totalITCs} ITC${totalITCs !== 1 ? "s" : ""} ↓`}
        </Btn>
      </BtnRow>
    </div>
  );
}
