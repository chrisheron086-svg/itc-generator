import React, { useState } from "react";
import styled from "styled-components";
import { StepTitle, StepDesc, BtnRow, Btn } from "./ui";

const PRIMARY = [
  { value: "circuit_breaker", label: "Circuit Breaker" },
  { value: "current_transformer", label: "Current Transformer" },
  { value: "voltage_transformer", label: "Voltage Transformer" },
  { value: "power_transformer", label: "Power Transformer" },
  { value: "isolator", label: "Isolator" },
  { value: "surge_arrestor", label: "Surge Arrestor" },
  { value: "neutral_ct", label: "Neutral CT" },
  { value: "earth_switch", label: "Earth Switch" },
  { value: "ows", label: "OWS" },
  { value: "net", label: "NET" },
];

const SECONDARY = [
  { value: "sel_751_feeder_relay", label: "SEL 751 Feeder Relay" },
];

const CategoryRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const CategoryBtn = styled.button`
  padding: 16px 12px;
  border-radius: var(--radius);
  border: 2px solid ${p => p.active ? "var(--accent)" : "var(--border)"};
  background: ${p => p.active ? "var(--accent)" : "var(--surface2)"};
  color: ${p => p.active ? "#fff" : "var(--text-light)"};
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
  &:hover {
    border-color: var(--accent);
    color: ${p => p.active ? "#fff" : "var(--accent)"};
  }
`;

const CategoryLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${p => p.active ? "rgba(255,255,255,0.75)" : "var(--text-muted)"};
  margin-bottom: 4px;
`;

const CategoryTitle = styled.div`
  font-size: 13px;
  font-weight: 800;
`;

const Divider = styled.div`
  height: 1px;
  background: var(--border);
  margin-bottom: 20px;
`;

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(158,5,59,0.2);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 20px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Tile = styled.button`
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid ${p => p.selected ? "var(--accent)" : "var(--border)"};
  background: ${p => p.selected ? "rgba(158,5,59,0.06)" : "var(--surface2)"};
  color: ${p => p.selected ? "var(--accent)" : "var(--text-light)"};
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover { border-color: var(--accent); color: var(--accent); }
`;

const Checkbox = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 3px;
  border: 2px solid ${p => p.checked ? "var(--accent)" : "var(--border)"};
  background: ${p => p.checked ? "var(--accent)" : "transparent"};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 9px;
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
`;

const NoCategory = styled.div`
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
  padding: 24px 0;
  font-style: italic;
`;

export default function EquipmentSelect({ form, update, next, back }) {
  const [activeCategories, setActiveCategories] = useState({
    primary: false,
    secondary: false,
  });

  const selectedTypes = form.equipment_items.map(e => e.equipment_type);
  const totalSelected = selectedTypes.length;

  const toggleCategory = (cat) => {
    setActiveCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleEquipment = (eq) => {
    const exists = form.equipment_items.find(e => e.equipment_type === eq.value);
    if (exists) {
      update({ equipment_items: form.equipment_items.filter(e => e.equipment_type !== eq.value) });
    } else {
      update({
        equipment_items: [
          ...form.equipment_items,
          { equipment_type: eq.value, bay_name: eq.label, panel_numbers: [] }
        ]
      });
    }
  };

  const showAny = activeCategories.primary || activeCategories.secondary;

  return (
    <div>
      <StepTitle>Equipment Types</StepTitle>
      <StepDesc>Select a category then tick the equipment you need ITCs for</StepDesc>

      <CategoryRow>
        <CategoryBtn
          type="button"
          active={activeCategories.primary}
          onClick={() => toggleCategory("primary")}
        >
          <CategoryLabel active={activeCategories.primary}>Category</CategoryLabel>
          <CategoryTitle>Primary Equipment</CategoryTitle>
        </CategoryBtn>
        <CategoryBtn
          type="button"
          active={activeCategories.secondary}
          onClick={() => toggleCategory("secondary")}
        >
          <CategoryLabel active={activeCategories.secondary}>Category</CategoryLabel>
          <CategoryTitle>Secondary & Protection</CategoryTitle>
        </CategoryBtn>
      </CategoryRow>

      <Divider />

      {!showAny && (
        <NoCategory>Select a category above to see available equipment</NoCategory>
      )}

      {activeCategories.primary && (
        <>
          <SectionLabel>Primary Equipment</SectionLabel>
          <Grid>
            {PRIMARY.map(eq => {
              const isSelected = selectedTypes.includes(eq.value);
              return (
                <Tile key={eq.value} selected={isSelected} onClick={() => toggleEquipment(eq)} type="button">
                  <Checkbox checked={isSelected}>{isSelected ? "✓" : ""}</Checkbox>
                  {eq.label}
                </Tile>
              );
            })}
          </Grid>
        </>
      )}

      {activeCategories.secondary && (
        <>
          <SectionLabel>Secondary Equipment & Protection</SectionLabel>
          <Grid>
            {SECONDARY.map(eq => {
              const isSelected = selectedTypes.includes(eq.value);
              return (
                <Tile key={eq.value} selected={isSelected} onClick={() => toggleEquipment(eq)} type="button">
                  <Checkbox checked={isSelected}>{isSelected ? "✓" : ""}</Checkbox>
                  {eq.label}
                </Tile>
              );
            })}
          </Grid>
        </>
      )}

      {totalSelected > 0 && (
        <SelectionCount>
          ✓ {totalSelected} equipment type{totalSelected !== 1 ? "s" : ""} selected
          {" — "}{form.equipment_items.map(e => e.bay_name).join(", ")}
        </SelectionCount>
      )}

      <BtnRow>
        <Btn onClick={back}>← Back</Btn>
        <Btn primary disabled={totalSelected === 0} onClick={next}>
          Next → ({totalSelected} selected)
        </Btn>
      </BtnRow>
    </div>
  );
}
