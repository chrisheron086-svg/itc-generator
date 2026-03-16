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
  margin-bottom: 16px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Tile = styled.button`
  padding: 14px 12px;
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
  &:hover { border-color: var(--accent); color: var(--accent); }
`;

const Checkbox = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 3px;
  border: 2px solid ${p => p.checked ? "var(--accent)" : "var(--border)"};
  background: ${p => p.checked ? "var(--accent)" : "transparent"};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  transition: all 0.15s;
`;

const SelectionCount = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 16px;
  padding: 8px 12px;
  background: rgba(158,5,59,0.06);
  border-radius: var(--radius);
  border: 1px solid rgba(158,5,59,0.15);
  display: ${p => p.visible ? "block" : "none"};
`;

export default function EquipmentSelect({ form, update, next, back }) {
  const selectedTypes = form.equipment_items.map(e => e.equipment_type);

  const toggle = (eq) => {
    const exists = form.equipment_items.find(e => e.equipment_type === eq.value);
    if (exists) {
      // Remove it
      update({ equipment_items: form.equipment_items.filter(e => e.equipment_type !== eq.value) });
    } else {
      // Add it with empty panel_numbers
      update({
        equipment_items: [
          ...form.equipment_items,
          { equipment_type: eq.value, bay_name: eq.label, panel_numbers: [] }
        ]
      });
    }
  };

  return (
    <div>
      <StepTitle>Equipment Types</StepTitle>
      <StepDesc>Select all equipment types you need ITCs for — you can choose multiple</StepDesc>

      <SelectionCount visible={selectedTypes.length > 0}>
        {selectedTypes.length} equipment type{selectedTypes.length !== 1 ? "s" : ""} selected
      </SelectionCount>

      <Grid>
        {EQUIPMENT.map(eq => {
          const isSelected = selectedTypes.includes(eq.value);
          return (
            <Tile key={eq.value} selected={isSelected} onClick={() => toggle(eq)} type="button">
              <Checkbox checked={isSelected}>{isSelected ? "✓" : ""}</Checkbox>
              {eq.label}
            </Tile>
          );
        })}
      </Grid>

      <BtnRow>
        <Btn onClick={back}>← Back</Btn>
        <Btn primary disabled={selectedTypes.length === 0} onClick={next}>
          Next → ({selectedTypes.length} selected)
        </Btn>
      </BtnRow>
    </div>
  );
}
