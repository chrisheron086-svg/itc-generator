import styled from "styled-components";

export const StepTitle = styled.h2`
  font-family: 'Montserrat', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 4px;
  letter-spacing: -0.3px;
`;

export const StepDesc = styled.p`
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 28px;
  font-weight: 500;
`;

export const Field = styled.div`
  margin-bottom: 18px;
  label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 6px;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

export const BtnRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 28px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid var(--border);
`;

export const Btn = styled.button`
  padding: 11px 28px;
  border-radius: var(--radius);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: none;
  background: ${p => p.primary ? "var(--accent)" : "var(--surface2)"};
  color: ${p => p.primary ? "#fff" : "var(--text-light)"};
  border: 1px solid ${p => p.primary ? "var(--accent)" : "var(--border)"};
  transition: opacity 0.15s, background 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;
