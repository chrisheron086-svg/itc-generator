import React, { useState } from "react";
import styled from "styled-components";
import { StepTitle, StepDesc, BtnRow, Btn } from "./ui";


const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const Tile = styled.button`
  padding: 18px 16px;
  border-radius: var(--radius);
  border: 2px solid ${p => p.selected ? "var(--accent)" : "var(--border)"};
  background: ${p => p.selected ? "rgba(158,5,59,0.06)" : "var(--surface2)"};
  color: ${p => p.selected ? "var(--accent)" : "var(--text)"};
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  flex-direction: column;
  gap: 4px;
  &:hover { border-color: var(--accent); color: var(--accent); }
`;

const TileSub = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.selected ? "var(--accent-dim)" : "var(--text-muted)"};
`;

const NewClientTile = styled(Tile)`
  border-style: dashed;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--text-muted);
  flex-direction: row;
  gap: 8px;
`;

const SkipBtn = styled.button`
  width: 100%;
  padding: 11px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: none;
  color: var(--text-muted);
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.15s;
  &:hover { border-color: var(--accent); color: var(--accent); }
`;

export default function ClientSelect({ form, update, next, clients: CLIENTS }) {
  const [selected, setSelected] = useState(form._client_id || null);

  const selectClient = (client) => {
    setSelected(client.id);
    // Pre-fill all form fields from client profile
    update({
      _client_id: client.id,
      cpp_project_name: client.cpp_project_name,
      cpp_job_no: client.cpp_job_no,
      client_project_title: client.client_project_title,
      client_project_number: client.client_project_number,
      site_location: client.site_location,
      prepared_by_name: client.prepared_by_name,
      prepared_by_position: client.prepared_by_position,
      checked_by_name: client.checked_by_name,
      checked_by_position: client.checked_by_position,
      checked_by_signature: client.checked_by_signature,
      client_checked_by_name: client.client_checked_by_name,
      client_checked_by_position: client.client_checked_by_position,
    });
  };

  const skip = () => {
    setSelected(null);
    update({ _client_id: null });
    next();
  };

  return (
    <div>
      <StepTitle>Select Client</StepTitle>
      <StepDesc>Choose a client profile to pre-fill all project and personnel details</StepDesc>

      <Grid>
        {CLIENTS.map(client => (
          <Tile
            key={client.id}
            type="button"
            selected={selected === client.id}
            onClick={() => selectClient(client)}
          >
            {client.name}
            <TileSub selected={selected === client.id}>
              Job No: {client.cpp_job_no} — {client.site_location}
            </TileSub>
          </Tile>
        ))}
        <NewClientTile
          type="button"
          onClick={skip}
        >
          + New / Manual Entry
        </NewClientTile>
      </Grid>

      <BtnRow>
        <SkipBtn onClick={skip}>Skip — fill in manually →</SkipBtn>
      </BtnRow>

      <BtnRow>
        <Btn primary disabled={!selected} onClick={next}>
          Continue with {selected ? CLIENTS.find(c => c.id === selected)?.name : "..."} →
        </Btn>
      </BtnRow>
    </div>
  );
}
