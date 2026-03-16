import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import EquipmentSelect from "./components/EquipmentSelect";
import ProjectDetails from "./components/ProjectDetails";
import PersonnelDetails from "./components/PersonnelDetails";
import PanelNumbers from "./components/PanelNumbers";
import ReviewGenerate from "./components/ReviewGenerate";

const STEPS = ["Equipment", "Project", "Personnel", "Panels", "Generate"];

const fadeIn = keyframes`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); }`;

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 80px;
  background: var(--bg);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 48px;
  animation: ${fadeIn} 0.5s ease;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: var(--text-muted);
  margin-top: 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const GoldLine = styled.div`
  width: 48px;
  height: 3px;
  background: #DFB200;
  margin: 10px auto 0;
`;

const StepBar = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 40px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  width: 100%;
  max-width: 640px;
  background: var(--surface);
`;

const Step = styled.div`
  flex: 1;
  padding: 11px 4px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: ${p => p.active ? "var(--accent)" : p.done ? "#F9F9F9" : "var(--surface)"};
  color: ${p => p.active ? "#fff" : p.done ? "var(--accent)" : "var(--text-muted)"};
  border-right: 1px solid var(--border);
  transition: all 0.2s;
  cursor: ${p => p.done ? "pointer" : "default"};
  &:last-child { border-right: none; }
`;

const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 3px solid var(--accent);
  border-radius: var(--radius);
  padding: 36px;
  width: 100%;
  max-width: 640px;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
`;

const INITIAL_FORM = {
  equipment_type: "",
  cpp_project_name: "",
  cpp_job_no: "",
  bay_name: "",
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
  date: new Date().toISOString().split("T")[0],
  panel_numbers: [],
};

export default function App() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);

  const update = (fields) => setForm(f => ({ ...f, ...fields }));
  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);
  const goTo = (i) => { if (i < step) setStep(i); };

  const stepComponents = [
    <EquipmentSelect form={form} update={update} next={next} />,
    <ProjectDetails form={form} update={update} next={next} back={back} />,
    <PersonnelDetails form={form} update={update} next={next} back={back} />,
    <PanelNumbers form={form} update={update} next={next} back={back} />,
    <ReviewGenerate form={form} back={back} />,
  ];

  return (
    <Shell>
      <Header>
        <Title>ITC Generator</Title>
        <GoldLine />
        <Subtitle>Consolidated Power Projects — Commissioning Tools</Subtitle>
      </Header>
      <StepBar>
        {STEPS.map((label, i) => (
          <Step key={label} active={step === i} done={step > i} onClick={() => goTo(i)}>
            {label}
          </Step>
        ))}
      </StepBar>
      <Card>{stepComponents[step]}</Card>
    </Shell>
  );
}
