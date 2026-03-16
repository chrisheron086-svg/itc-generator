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

  tr {
    border-bottom: 1px solid var(--border);
  }

  td {
    padding: 9px 6px;
    &:first-child {
      color: var(--text-muted);
      width: 44%;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    &:last-child {
      color: var(--text);
      font-weight: 500;
    }
  }
`;

const Tag = styled.span`
  background: rgba(158,5,59,0.07);
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 3px;
  padding: 2px 7px;
  font-size: 11px;
  font-weight: 700;
  margin: 2px;
  display: inline-block;
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

const LABELS = {
  circuit_breaker: "Circuit Breaker",
  current_transformer: "Current Transformer",
  voltage_transformer: "Voltage Transformer",
  neutral_ct: "Neutral CT",
  isolator: "Isolator",
  earth_switch: "Earth Switch",
  ows: "OWS",
  net: "NET",
  power_transformer: "Power Transformer",
  surge_arrestor: "Surge Arrestor",
};

export default function ReviewGenerate({ form, back }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await axios.post(`${API}/generate`, form, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${form.equipment_type}_ITCs.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.detail || e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StepTitle>Review & Generate</StepTitle>
      <StepDesc>Confirm details before generating your ITCs</StepDesc>

      <Table>
        <tbody>
          <tr><td>Equipment Type</td><td>{LABELS[form.equipment_type]}</td></tr>
          <tr><td>CPP Project</td><td>{form.cpp_project_name}</td></tr>
          <tr><td>CPP Job No</td><td>{form.cpp_job_no}</td></tr>
          <tr><td>Client Project</td><td>{form.client_project_title}</td></tr>
          <tr><td>Client Job No</td><td>{form.client_project_number}</td></tr>
          <tr><td>Site Location</td><td>{form.site_location}</td></tr>
          <tr><td>Date</td><td>{form.date}</td></tr>
          <tr><td>Prepared By</td><td>{form.prepared_by_name} — {form.prepared_by_position}</td></tr>
          <tr><td>Checked By</td><td>{form.checked_by_name} — {form.checked_by_position}</td></tr>
          <tr><td>Client Checked By</td><td>{form.client_checked_by_name} — {form.client_checked_by_position}</td></tr>
          <tr>
            <td>Panel Numbers ({form.panel_numbers.length})</td>
            <td>{form.panel_numbers.map(p => <Tag key={p}>{p}</Tag>)}</td>
          </tr>
        </tbody>
      </Table>

      {error && <Status error>⚠ {error}</Status>}
      {success && <Status>✓ ITCs generated and downloaded successfully!</Status>}

      <BtnRow>
        <Btn onClick={back}>← Back</Btn>
        <Btn primary onClick={generate} disabled={loading}>
          {loading ? "Generating..." : `Generate ${form.panel_numbers.length} ITC${form.panel_numbers.length !== 1 ? "s" : ""} ↓`}
        </Btn>
      </BtnRow>
    </div>
  );
}
