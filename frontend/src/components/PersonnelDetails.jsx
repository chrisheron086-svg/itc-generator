import React from "react";
import { StepTitle, StepDesc, Field, Row, BtnRow, Btn } from "./ui";

export default function PersonnelDetails({ form, update, next, back }) {
  const valid =
    form.prepared_by_name &&
    form.prepared_by_position &&
    form.checked_by_name &&
    form.checked_by_position &&
    form.client_checked_by_name &&
    form.client_checked_by_position;

  return (
    <div>
      <StepTitle>Personnel</StepTitle>
      <StepDesc>Enter the names and positions for all signatories</StepDesc>

      <Row>
        <Field>
          <label>Prepared By — Name</label>
          <input
            value={form.prepared_by_name}
            onChange={e => update({ prepared_by_name: e.target.value })}
            placeholder="e.g. Site Commissioner"
          />
        </Field>
        <Field>
          <label>Prepared By — Position</label>
          <input
            value={form.prepared_by_position}
            onChange={e => update({ prepared_by_position: e.target.value })}
            placeholder="e.g. Senior Commissioning Officer"
          />
        </Field>
      </Row>

      <Row>
        <Field>
          <label>Checked By — Name</label>
          <input
            value={form.checked_by_name}
            onChange={e => update({ checked_by_name: e.target.value })}
            placeholder="e.g. Commissioning Manager"
          />
        </Field>
        <Field>
          <label>Checked By — Position</label>
          <input
            value={form.checked_by_position}
            onChange={e => update({ checked_by_position: e.target.value })}
            placeholder="e.g. Commissioning Manager"
          />
        </Field>
      </Row>

      <Field>
        <label>Checked By — Signature</label>
        <input
          value={form.checked_by_signature}
          onChange={e => update({ checked_by_signature: e.target.value })}
          placeholder="e.g. Commissioning Manager"
        />
      </Field>

      <Row>
        <Field>
          <label>Client Checked By — Name</label>
          <input
            value={form.client_checked_by_name}
            onChange={e => update({ client_checked_by_name: e.target.value })}
            placeholder="e.g. Client Engineer"
          />
        </Field>
        <Field>
          <label>Client Checked By — Position</label>
          <input
            value={form.client_checked_by_position}
            onChange={e => update({ client_checked_by_position: e.target.value })}
            placeholder="e.g. Senior Electrical Engineer"
          />
        </Field>
      </Row>

      <BtnRow>
        <Btn onClick={back}>← Back</Btn>
        <Btn primary disabled={!valid} onClick={next}>Next →</Btn>
      </BtnRow>
    </div>
  );
}
