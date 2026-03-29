import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Field, Row, Btn } from "./ui";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); }`;

const Shell = styled.div`
  min-height: 100vh;
  background: var(--bg);
  padding: 40px 20px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: var(--accent);
`;

const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 28px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
`;

const ClientHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ClientName = styled.h2`
  font-size: 16px;
  font-weight: 800;
  color: var(--text);
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const GoldLine = styled.div`
  width: 100%;
  height: 1px;
  background: var(--border);
  margin: 20px 0;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
`;

const AddBtn = styled.button`
  width: 100%;
  max-width: 800px;
  padding: 14px;
  border-radius: var(--radius);
  border: 2px dashed var(--border);
  background: none;
  color: var(--text-muted);
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: var(--accent); color: var(--accent); }
`;

const SaveMsg = styled.div`
  background: rgba(42,122,42,0.07);
  border: 1px solid var(--success);
  color: var(--success);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  width: 100%;
  max-width: 800px;
`;

const EMPTY_CLIENT = {
  id: "",
  name: "",
  cpp_project_name: "",
  cpp_job_no: "",
  client_project_title: "",
  client_project_number: "",
  site_location: "",
  prepared_by_name: "",
  prepared_by_position: "",
  checked_by_name: "",
  checked_by_position: "",
  checked_by_signature: "",
  client_checked_by_name: "",
  client_checked_by_position: "",
};

export default function AdminPanel({ onClose, initialClients }) {
  const [clients, setClients] = useState(initialClients);
  const [editing, setEditing] = useState(null);
  const [saved, setSaved] = useState(false);

  const startEdit = (client) => setEditing({ ...client });
  const startNew = () => setEditing({ ...EMPTY_CLIENT, id: `client_${Date.now()}` });

  const updateField = (key, val) => setEditing(e => ({ ...e, [key]: val }));

  const saveClient = () => {
    const exists = clients.find(c => c.id === editing.id);
    const updated = exists
      ? clients.map(c => c.id === editing.id ? editing : c)
      : [...clients, editing];
    setClients(updated);
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Save to localStorage for persistence within session
    sessionStorage.setItem("itc_clients", JSON.stringify(updated));
  };

  const deleteClient = (id) => {
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    sessionStorage.setItem("itc_clients", JSON.stringify(updated));
  };

  return (
    <Shell>
      <Header>
        <Title>Admin — Client Profiles</Title>
        <Btn onClick={onClose}>← Back to App</Btn>
      </Header>

      {saved && <SaveMsg>✓ Client profile saved successfully!</SaveMsg>}

      {editing ? (
        <Card>
          <ClientHeader>
            <ClientName>{editing.name || "New Client"}</ClientName>
            <BtnGroup>
              <Btn onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn primary onClick={saveClient} disabled={!editing.name}>Save Client</Btn>
            </BtnGroup>
          </ClientHeader>

          <SectionLabel>Client Profile Name</SectionLabel>
          <Field>
            <label>Display Name</label>
            <input value={editing.name} onChange={e => updateField("name", e.target.value)} placeholder="e.g. Tailem Bend 3 BESS" />
          </Field>

          <GoldLine />
          <SectionLabel>CPP Project Details</SectionLabel>
          <Row>
            <Field>
              <label>CPP Project Name</label>
              <input value={editing.cpp_project_name} onChange={e => updateField("cpp_project_name", e.target.value)} placeholder="e.g. Tailem Bend 3" />
            </Field>
            <Field>
              <label>CPP Job No</label>
              <input value={editing.cpp_job_no} onChange={e => updateField("cpp_job_no", e.target.value)} placeholder="e.g. 13279" />
            </Field>
          </Row>
          <Row>
            <Field>
              <label>Client Project Title</label>
              <input value={editing.client_project_title} onChange={e => updateField("client_project_title", e.target.value)} placeholder="e.g. Tailem Bend 3 BESS" />
            </Field>
            <Field>
              <label>Client Project Number</label>
              <input value={editing.client_project_number} onChange={e => updateField("client_project_number", e.target.value)} placeholder="e.g. 13279" />
            </Field>
          </Row>
          <Field>
            <label>Site Location</label>
            <input value={editing.site_location} onChange={e => updateField("site_location", e.target.value)} placeholder="e.g. 261 Lime Kiln Road, Tailem Bend SA" />
          </Field>

          <GoldLine />
          <SectionLabel>CPP Personnel</SectionLabel>
          <Row>
            <Field>
              <label>Prepared By — Name</label>
              <input value={editing.prepared_by_name} onChange={e => updateField("prepared_by_name", e.target.value)} placeholder="e.g. Chris Heron" />
            </Field>
            <Field>
              <label>Prepared By — Position</label>
              <input value={editing.prepared_by_position} onChange={e => updateField("prepared_by_position", e.target.value)} placeholder="e.g. Senior Commissioning Officer" />
            </Field>
          </Row>
          <Row>
            <Field>
              <label>Checked By — Name</label>
              <input value={editing.checked_by_name} onChange={e => updateField("checked_by_name", e.target.value)} placeholder="e.g. Frank Maloney" />
            </Field>
            <Field>
              <label>Checked By — Position</label>
              <input value={editing.checked_by_position} onChange={e => updateField("checked_by_position", e.target.value)} placeholder="e.g. Commissioning Manager" />
            </Field>
          </Row>
          <Field>
            <label>Checked By — Signature</label>
            <input value={editing.checked_by_signature} onChange={e => updateField("checked_by_signature", e.target.value)} placeholder="e.g. F Maloney" />
          </Field>

          <GoldLine />
          <SectionLabel>Client Personnel</SectionLabel>
          <Row>
            <Field>
              <label>Client Checked By — Name</label>
              <input value={editing.client_checked_by_name} onChange={e => updateField("client_checked_by_name", e.target.value)} placeholder="e.g. Andrew Pezzuto" />
            </Field>
            <Field>
              <label>Client Checked By — Position</label>
              <input value={editing.client_checked_by_position} onChange={e => updateField("client_checked_by_position", e.target.value)} placeholder="e.g. Senior Electrical Engineer" />
            </Field>
          </Row>
        </Card>
      ) : (
        <>
          {clients.map(client => (
            <Card key={client.id}>
              <ClientHeader>
                <div>
                  <ClientName>{client.name}</ClientName>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                    Job No: {client.cpp_job_no} — {client.site_location}
                  </div>
                </div>
                <BtnGroup>
                  <Btn onClick={() => deleteClient(client.id)}>Delete</Btn>
                  <Btn primary onClick={() => startEdit(client)}>Edit</Btn>
                </BtnGroup>
              </ClientHeader>
            </Card>
          ))}
          <AddBtn onClick={startNew}>+ Add New Client Profile</AddBtn>
        </>
      )}
    </Shell>
  );
}
