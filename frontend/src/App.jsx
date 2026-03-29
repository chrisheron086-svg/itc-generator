import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Login from "./components/Login";
import ProjectDetails from "./components/ProjectDetails";
import PersonnelDetails from "./components/PersonnelDetails";
import EquipmentSelect from "./components/EquipmentSelect";
import PanelNumbers from "./components/PanelNumbers";
import IndexUpload from "./components/IndexUpload";
import ReviewGenerate from "./components/ReviewGenerate";

const STEPS = ["Project", "Personnel", "Equipment", "Generate"];

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

const GoldLine = styled.div`
  width: 48px;
  height: 3px;
  background: #DFB200;
  margin: 10px auto 0;
`;

const Subtitle = styled.p`
  color: var(--text-muted);
  margin-top: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const StepBar = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 40px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  width: 100%;
  max-width: 700px;
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
  max-width: 700px;
  animation: ${fadeIn} 0.3s ease;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
`;

const ModeToggle = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 700px;
`;

const ModeBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: var(--radius);
  border: 2px solid ${p => p.active ? "var(--accent)" : "var(--border)"};
  background: ${p => p.active ? "rgba(158,5,59,0.06)" : "var(--surface)"};
  color: ${p => p.active ? "var(--accent)" : "var(--text-muted)"};
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: var(--accent); color: var(--accent); }
`;

const SignOutBtn = styled.button`
  position: fixed;
  top: 16px;
  right: 20px;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-muted);
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: var(--accent); color: var(--accent); }
`;

const INITIAL_FORM = {
  cpp_project_name: "",
  cpp_job_no: "",
  client_project_title: "",
  client_project_number: "",
  site_location: "",
  date: new Date().toISOString().split("T")[0],
  prepared_by_name: "",
  prepared_by_position: "",
  checked_by_name: "",
  checked_by_position: "",
  checked_by_signature: "",
  client_checked_by_name: "",
  client_checked_by_position: "",
  equipment_items: [],
  index_items: [],
  index_file_name: "",
};

// Manual mode steps: Project → Personnel → Equipment → Panels → Generate
// Index mode steps:  Project → Personnel → Index Upload → Generate
const MANUAL_STEPS = ["Project", "Personnel", "Equipment", "Panels", "Generate"];
const INDEX_STEPS = ["Project", "Personnel", "Index", "Generate"];

export default function App() {
  const [authed, setAuthed] = useState(sessionStorage.getItem("itc_auth") === "true");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [mode, setMode] = useState("manual"); // "manual" or "index"

  const update = (fields) => setForm(f => ({ ...f, ...fields }));
  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);
  const goTo = (i) => { if (i < step) setStep(i); };

  const signOut = () => {
    sessionStorage.removeItem("itc_auth");
    setAuthed(false);
    setStep(0);
    setForm(INITIAL_FORM);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setStep(0);
    setForm(INITIAL_FORM);
  };

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  const steps = mode === "index" ? INDEX_STEPS : MANUAL_STEPS;

  const manualComponents = [
    <ProjectDetails form={form} update={update} next={next} />,
    <PersonnelDetails form={form} update={update} next={next} back={back} />,
    <EquipmentSelect form={form} update={update} next={next} back={back} />,
    <PanelNumbers form={form} update={update} next={next} back={back} />,
    <ReviewGenerate form={form} mode="manual" back={back} />,
  ];

  const indexComponents = [
    <ProjectDetails form={form} update={update} next={next} />,
    <PersonnelDetails form={form} update={update} next={next} back={back} />,
    <IndexUpload form={form} update={update} next={next} back={back} />,
    <ReviewGenerate form={form} mode="index" back={back} />,
  ];

  const components = mode === "index" ? indexComponents : manualComponents;

  return (
    <Shell>
      <SignOutBtn onClick={signOut}>Sign Out</SignOutBtn>
      <Header>
        <Title>ITC Generator</Title>
        <GoldLine />
        <Subtitle>Consolidated Power Projects — Commissioning Tools</Subtitle>
      </Header>

      {step === 0 && (
        <ModeToggle>
          <ModeBtn active={mode === "manual"} onClick={() => switchMode("manual")}>
            ✎ Manual Entry
          </ModeBtn>
          <ModeBtn active={mode === "index"} onClick={() => switchMode("index")}>
            📋 Upload Index
          </ModeBtn>
        </ModeToggle>
      )}

      <StepBar>
        {steps.map((label, i) => (
          <Step key={label} active={step === i} done={step > i} onClick={() => goTo(i)}>
            {label}
          </Step>
        ))}
      </StepBar>
      <Card>{components[step]}</Card>
    </Shell>
  );
}
