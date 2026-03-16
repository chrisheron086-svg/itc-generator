import React from "react";
import { StepTitle, StepDesc, Field, Row, BtnRow, Btn } from "./ui";

export default function ProjectDetails({ form, update, next, back }) {
  const valid =
    form.cpp_project_name &&
    form.cpp_job_no &&
    form.client_project_title &&
    form.client_project_number &&
    form.site_location;

  return (
    <div>
      <StepTitle>Project Details</StepTitle>
      <StepDesc>Enter the CPP and client project information</StepDesc>

      <Row>
        <Field>
          <label>CPP Project Name</label>
          <input
            value={form.cpp_project_name}
            onChange={e => update({ cpp_project_name: e.target.value })}
            placeholder="e.g. Tailem Bend 3"
          />
        </Field>
        <Field>
          <label>CPP Job No</label>
          <input
            value={form.cpp_job_no}
            onChange={e => update({ cpp_job_no: e.target.value })}
            placeholder="e.g. 12345"
          />
        </Field>
      </Row>

      <Row>
        <Field>
          <label>Client Project Title</label>
          <input
            value={form.client_project_title}
            onChange={e => update({ client_project_title: e.target.value })}
            placeholder="e.g. Tailem Bend 3 BESS"
          />
        </Field>
        <Field>
          <label>Client Project Number</label>
          <input
            value={form.client_project_number}
            onChange={e => update({ client_project_number: e.target.value })}
            placeholder="e.g. 12345"
          />
        </Field>
      </Row>

      <Field>
        <label>Site Location</label>
        <input
          value={form.site_location}
          onChange={e => update({ site_location: e.target.value })}
          placeholder="e.g. 205 Cormack Road, Wingfield SA"
        />
      </Field>

      <Field>
        <label>Date</label>
        <input
          type="date"
          value={form.date}
          onChange={e => update({ date: e.target.value })}
        />
      </Field>

      <BtnRow>
        <Btn onClick={back}>← Back</Btn>
        <Btn primary disabled={!valid} onClick={next}>Next →</Btn>
      </BtnRow>
    </div>
  );
}
