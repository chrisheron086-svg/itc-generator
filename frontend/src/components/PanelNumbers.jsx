import React, { useState } from "react";
import styled from "styled-components";
import { StepTitle, StepDesc, Field, BtnRow, Btn } from "./ui";

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(232,255,71,0.1);
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  margin: 4px;
`;

const Remove = styled.button`
  background: none;
  border: none;
  color: var(--accent);
  font-size: 16px;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  &:hover { opacity: 1; }
`;

const TagWrap = styled.div`
  min-height: 48px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 6px;
  margin-bottom: 18px;
  background: var(--surface2);
`;

const AddRow = styled.div`
  display: flex;
  gap: 10px;
  input { flex: 1; }
`;

export default function PanelNumbers({ form, update, next, back }) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val && !form.panel_numbers.includes(val)) {
      update({ panel_numbers: [...form.panel_numbers, val] });
    }
    setInput("");
  };

  const remove = (num) => {
    update({ panel_numbers: form.panel_numbers.filter(p => p !== num) });
  };

  const handleKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); add(); }
  };

  return (
    <div>
      <StepTitle>Panel Numbers</StepTitle>
      <StepDesc>Add all bay/panel numbers. One ITC sheet will be created per panel.</StepDesc>

      <Field>
        <label>Panel Numbers ({form.panel_numbers.length} added)</label>
        <TagWrap>
          {form.panel_numbers.map(p => (
            <Tag key={p}>
              {p}
              <Remove onClick={() => remove(p)}>×</Remove>
            </Tag>
          ))}
        </TagWrap>
        <AddRow>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="e.g. +C02-Q10"
          />
          <Btn onClick={add} disabled={!input.trim()}>Add</Btn>
        </AddRow>
      </Field>

      <BtnRow>
        <Btn onClick={back}>← Back</Btn>
        <Btn primary disabled={form.panel_numbers.length === 0} onClick={next}>
          Next →
        </Btn>
      </BtnRow>
    </div>
  );
}
