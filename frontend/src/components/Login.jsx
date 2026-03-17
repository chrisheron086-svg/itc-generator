import React, { useState } from "react";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); }`;

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 20px;
`;

const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-top: 4px solid var(--accent);
  border-radius: var(--radius);
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 36px;
`;

const Title = styled.h1`
  font-family: 'Montserrat', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: var(--accent);
  line-height: 1;
  letter-spacing: -0.5px;
`;

const GoldLine = styled.div`
  width: 40px;
  height: 3px;
  background: #DFB200;
  margin: 10px auto;
`;

const Subtitle = styled.p`
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 4px;
`;

const Field = styled.div`
  margin-bottom: 20px;
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

const LoginBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-family: 'Montserrat', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.15s;
  margin-top: 8px;
  &:hover { opacity: 0.85; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const ErrorBox = styled.div`
  background: rgba(158,5,59,0.07);
  border: 1px solid var(--accent);
  color: var(--accent);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 11px;
  color: var(--text-muted);
  font-weight: 500;
`;

const API = process.env.REACT_APP_API_URL || "";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("itc_auth", "true");
        onLogin();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <Shell>
      <Card>
        <Header>
          <Title>ITC Generator</Title>
          <GoldLine />
          <Subtitle>Consolidated Power Projects</Subtitle>
        </Header>

        {error && <ErrorBox>⚠ {error}</ErrorBox>}

        <Field>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Enter access password"
            autoFocus
          />
        </Field>

        <LoginBtn onClick={handleSubmit} disabled={!password.trim() || loading}>
          {loading ? "Checking..." : "Sign In →"}
        </LoginBtn>

        <Footer>
          Commissioning Tools — Internal Use Only
        </Footer>
      </Card>
    </Shell>
  );
}
