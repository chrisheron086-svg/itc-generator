import React from "react";
import styled from "styled-components";
import { StepTitle, StepDesc, BtnRow, Btn } from "./ui";

const EQUIPMENT = [
  { value: "circuit_breaker", label: "Circuit Breaker" },
  { value: "current_transformer", label: "Current Transformer" },
  { value: "voltage_transformer", label: "Voltage Transformer" },
  { value: "neutral_ct", label: "Neutral CT" },
  { value: "isolator", label: "Isolator" },
  { value: "earth_switch", label: "Earth Switch" },
  { value: "ows", label: "OWS" },
  { value: "net", label: "NET" },
  { value: "power_transformer", label: "Power Transformer" },
  { value: "surge_arrestor", label: "Surge Arrestor" },
];

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 8px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Tile = styled.button`
  padding: 16px 12px;
  border-radius: var(--radius);
  border: 1px solid ${p => p.selected ? "var(--accent)" : "var(--border)"};
  background: ${p => p.selected ? "rgba(158,5,59,0.06)" : "var(--surface2)"};
  color: ${p => p.selected ? "var(--accent)" : "var(--text-light)"};
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${p => p.selected ? "var(--accent)" : "var(--border)"};
    flex-shrink: 0;
    transition: background 0.15s;
  }
`;

export default function EquipmentSelect({ form, update, next }) {
  return (
    <div>
      <StepTitle>Equipment Type</StepTitle>
      <StepDesc>Select the type of equipment ITC you want to generate</StepDesc>
      <Grid>
        {EQUIPMENT.map(eq => (
          <Tile
            key={eq.value}
            selected={form.equipment_type === eq.value}
            onClick={() => update({ equipment_type: eq.value, bay_name: eq.label })}
            type="button"
          >
            {eq.label}
          </Tile>
        ))}
      </Grid>
      <BtnRow>
        <Btn primary disabled={!form.equipment_type} onClick={next}>
          Next →
        </Btn>
      </BtnRow>
    </div>
  );
}
