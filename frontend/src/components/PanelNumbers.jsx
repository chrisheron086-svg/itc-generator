import React, { useState } from "react";
import styled from "styled-components";
import { StepTitle, StepDesc, BtnRow, Btn } from "./ui";

const EquipmentSection = styled.div`
  margin-bottom: 28px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: var(--accent);
  color: white;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionCount = styled.span`
  background: rgba(255,255,255,0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
`;

const SectionBody = styled.div`
  padding: 16px;
  background: var(--surface);
`;

const TagWrap = styled.div`
  min-height: 40px;
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(158,5,59,0.07);
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
`;

const Remove = styled.button`
  background: none;
  border: none;
  color: var(--accent);
  font-size: 14px;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

const AddRow = styled.div`
  display: flex;
  gap: 8px;
  input { flex: 1; }
`;

const EmptyHint = styled.p`
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 12px;
`;

export default function PanelNumbers({ form, update, next, back }) {
  const [inputs, setInputs] = useState(
    Object.fromEntries(form.equipment_items.map(e => [e.equipment_type, ""]))
  );

  const setInput = (type, val) => setInputs(prev => ({ ...prev, [type]: val }));

  const addPanel = (type) => {
    const val = (inputs[type] || "").trim();
    if (!val) return;
    const items = form.equipment_items.map(e => {
      if (e.equipment_type !== type) return e;
      if (e.panel_numbers.includes(val)) return e;
      return { ...e, panel_numbers: [...e.panel_numbers, val] };
    });
    update({ equipment_items: items });
    setInput(type, "");
  };

  const removePanel = (type, panel) => {
    const items = form.equipment_items.map(e => {
      if (e.equipment_type !== type) return e;
      return { ...e, panel_numbers: e.panel_numbers.filter(p => p !== panel) };
    });
    update({ equipment_items: items });
  };

  const handleKey = (e, type) => {
    if (e.key === "Enter") { e.preventDefault(); addPanel(type); }
  };

  const allHavePanels = form.equipment_items.every(e => e.panel_numbers.length > 0);
  const totalPanels = form.equipment_items.reduce((sum, e) => sum + e.panel_numbers.length, 0);

  return (
    <div>
      <StepTitle>Panel Numbers</StepTitle>
      <StepDesc>Add panel numbers for each equipment type — one ITC will be generated per panel</StepDesc>

      {form.equipment_items.map(item => (
        <EquipmentSection key={item.equipment_type}>
          <SectionHeader>
            {item.bay_name}
            <SectionCount>{item.panel_numbers.length} panel{item.panel_numbers.length !== 1 ? "s" : ""}</SectionCount>
          </SectionHeader>
          <SectionBody>
            {item.panel_numbers.length === 0
              ? <EmptyHint>No panels added yet — add at least one below</EmptyHint>
              : (
                <TagWrap>
                  {item.panel_numbers.map(p => (
                    <Tag key={p}>
                      {p}
                      <Remove onClick={() => removePanel(item.equipment_type, p)}>×</Remove>
                    </Tag>
                  ))}
                </TagWrap>
              )
            }
            <AddRow>
              <input
                value={inputs[item.equipment_type] || ""}
                onChange={e => setInput(item.equipment_type, e.target.value)}
                onKeyDown={e => handleKey(e, item.equipment_type)}
                placeholder={`e.g. +C02-Q10`}
              />
              <Btn onClick={() => addPanel(item.equipment_type)} disabled={!inputs[item.equipment_type]?.trim()}>
                Add
              </Btn>
            </AddRow>
          </SectionBody>
        </EquipmentSection>
      ))}

      <BtnRow>
        <Btn onClick={back}>← Back</Btn>
        <Btn primary disabled={!allHavePanels} onClick={next}>
          Next → ({totalPanels} ITC{totalPanels !== 1 ? "s" : ""} total)
        </Btn>
      </BtnRow>
    </div>
  );
}
