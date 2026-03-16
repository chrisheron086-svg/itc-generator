import styled from "styled-components";

export const StepTitle = styled.h2`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 28px;
  letter-spacing: 2px;
  color: var(--accent);
  margin-bottom: 6px;
`;

export const StepDesc = styled.p`
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 28px;
`;

export const Field = styled.div`
  margin-bottom: 18px;
  label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: var(--text-muted);
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
`;

export const Btn = styled.button`
  padding: 11px 28px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: none;
  background: ${p => p.primary ? "var(--accent)" : "var(--surface2)"};
  color: ${p => p.primary ? "#000" : "var(--text)"};
  border: 1px solid ${p => p.primary ? "var(--accent)" : "var(--border)"};
  transition: opacity 0.15s;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;
