import { createBrowserClient } from "@supabase/ssr";

export interface SessionConfig {
  tenant_id: string;
  case_reference: string;
  supabaseUrl: string;
  supabaseKey: string;
  // Optional flag to disable telemetry for local dev or compliance
  enableTelemetry?: boolean;
}

export interface SessionState {
  current_state: string;
  status: string;
  component_key?: string;
  is_locked: boolean;
  operator_message?: string;
}

/**
 * Tracks behavioral biometrics and device context for anti-fraud.
 */
class AntiFraudTelemetry {
  private sessionId: string;
  private supabase: any;
  private keystrokes: { key: string, timestamp: number, type: 'down' | 'up' }[] = [];
  private batchIntervalId: any = null;

  constructor(sessionId: string, supabase: any) {
    this.sessionId = sessionId;
    this.supabase = supabase;
  }

  async startTracking() {
    // 1. Device Fingerprinting
    try {
      // Dynamically import to avoid SSR issues
      const fpPromise = await import('@fingerprintjs/fingerprintjs');
      const fp = await fpPromise.load();
      const result = await fp.get();

      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      let batteryLevel = "N/A";
      let batteryCharging = "N/A";
      if ('getBattery' in navigator) {
        try {
          const battery: any = await (navigator as any).getBattery();
          batteryLevel = `${Math.round(battery.level * 100)}%`;
          batteryCharging = battery.charging ? "Yes" : "No";
        } catch (e) { }
      }

      let canvasHash = null;
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.textBaseline = "top";
          ctx.font = "14px 'Arial'";
          ctx.fillStyle = "#f60";
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = "#069";
          ctx.fillText("Browser Fingerprint", 2, 15);
          ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
          ctx.fillText("Browser Fingerprint", 4, 17);

          const dataUrl = canvas.toDataURL();
          let hash = 0;
          for (let i = 0; i < dataUrl.length; i++) {
            const char = dataUrl.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
          }
          canvasHash = Math.abs(hash).toString(16);
        }
      } catch (e) { }

      let gpuRenderer = null;
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || (canvas as any).getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          }
        }
      } catch (e) { }

      const gatherWebRTC = new Promise<{ leakDetected: boolean, ips: string[] }>(resolve => {
        let leakDetected = false;
        let ips: string[] = [];
        try {
          const RTC = window.RTCPeerConnection || (window as any).mozRTCPeerConnection || (window as any).webkitRTCPeerConnection;
          if (!RTC) return resolve({ leakDetected, ips });
          const rtc = new RTC({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
          rtc.createDataChannel('');
          rtc.createOffer().then(offer => rtc.setLocalDescription(offer)).catch(() => resolve({ leakDetected, ips }));

          let resolved = false;
          const finish = () => { if (!resolved) { resolved = true; rtc.close(); resolve({ leakDetected, ips }); } };
          setTimeout(finish, 500); // 500ms max

          rtc.onicecandidate = (evt) => {
            if (evt.candidate && evt.candidate.candidate) {
              const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
              const match = ipRegex.exec(evt.candidate.candidate);
              if (match && match[1]) {
                const ip = match[1];
                if (!ips.includes(ip) && !ip.endsWith('.local') && ip !== '0.0.0.0' && ip !== '127.0.0.1') {
                  ips.push(ip);
                  leakDetected = true;
                }
              }
            }
            if (!evt.candidate) {
              finish();
            }
          };
        } catch (e) {
          resolve({ leakDetected, ips });
        }
      });
      const webrtc = await gatherWebRTC;

      let ipData: any = {};
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        if (ipRes.ok) {
          ipData = await ipRes.json();
        }
      } catch (e) { }

      this.sendTelemetry("device_fingerprint", {
        visitorId: result.visitorId,
        userAgent: navigator.userAgent,
        language: navigator.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: `${window.screen.width}x${window.screen.height}`,
        cpuCores: navigator.hardwareConcurrency || null,
        deviceMemory: (navigator as any).deviceMemory || null,
        gpuRenderer: gpuRenderer,
        colorDepth: window.screen.colorDepth || null,
        connectionType: connection ? (connection.effectiveType || connection.type) : null,
        downlink: connection ? connection.downlink : null,
        batteryLevel: batteryLevel,
        batteryCharging: batteryCharging,
        canvasHash: canvasHash,
        webrtcLeakDetected: webrtc.leakDetected,
        webrtcLeakedIPs: webrtc.ips,
        ipAddress: ipData.ip || null,
        city: ipData.city || null,
        region: ipData.region || null,
        country: ipData.country_name || null,
        isp: ipData.org || null,
        asn: ipData.asn || null
      });
    } catch (e) {
      console.warn("[ControlRoom] Failed to initialize fingerprinting", e);
    }

    // 2. Online/Offline Network Continuity
    window.addEventListener('online', () => this.sendTelemetry("network_status", { status: 'online', timestamp: Date.now() }));
    window.addEventListener('offline', () => this.sendTelemetry("network_status", { status: 'offline', timestamp: Date.now() }));

    // 3. Behavioral Biometrics (Typing Cadence & Dwell Time)
    // We listen to the document, but only collect anonymous cadence data, NOT the actual values.
    document.addEventListener('keydown', this.handleKey);
    document.addEventListener('keyup', this.handleKey);

    // Batch process keystrokes every 5 seconds to avoid spamming the DB
    this.batchIntervalId = setInterval(() => this.processKeystrokeBatch(), 5000);
  }

  private handleKey = (e: KeyboardEvent) => {
    // Avoid tracking passwords or sensitive inputs directly. We only care about rhythm.
    // Instead of the actual key, we just record "char" or "special" to protect PII.
    const isChar = e.key.length === 1;
    this.keystrokes.push({
      key: isChar ? 'char' : 'special',
      timestamp: Date.now(),
      type: e.type as 'down' | 'up'
    });
  };

  private processKeystrokeBatch() {
    if (this.keystrokes.length < 5) return; // Not enough data

    // Calculate average dwell time (time between keydown and keyup for same key type)
    let totalDwell = 0;
    let dwellCount = 0;

    for (let i = 0; i < this.keystrokes.length - 1; i++) {
      if (this.keystrokes[i].type === 'down') {
        const upEvent = this.keystrokes.find((k, idx) => idx > i && k.type === 'up' && k.key === this.keystrokes[i].key);
        if (upEvent) {
          totalDwell += (upEvent.timestamp - this.keystrokes[i].timestamp);
          dwellCount++;
        }
      }
    }

    const avgDwellTime = dwellCount > 0 ? Math.round(totalDwell / dwellCount) : 0;
    const typingSpeed = this.keystrokes.length; // events per 5 seconds

    this.sendTelemetry("behavioral_biometrics", {
      avg_dwell_time_ms: avgDwellTime,
      keystroke_volume: typingSpeed,
      bot_probability: avgDwellTime < 20 ? "HIGH" : "LOW" // Simplistic bot heuristic
    });

    this.keystrokes = []; // Reset batch
  }

  private async sendTelemetry(metricType: string, payload: any) {
    // Directly insert telemetry into session_events for the operator to see
    await this.supabase.from("session_events").insert({
      session_id: this.sessionId,
      sequence_no: Date.now(), // Temporary; production should use next_session_sequence()
      event_type: `telemetry:${metricType}`,
      payload: payload
    });
  }

  stopTracking() {
    document.removeEventListener('keydown', this.handleKey);
    document.removeEventListener('keyup', this.handleKey);
    if (this.batchIntervalId) {
      clearInterval(this.batchIntervalId);
      this.batchIntervalId = null;
    }
  }
}

/**
 * ControlRoomSession — Vendor-side SDK
 * 
 * FLOW:
 * 1. The OPERATOR creates a session in the Control Room dashboard → gets a case reference (e.g. "CR-250515-AB3F")
 * 2. The operator gives this reference to the end-user (e.g. over the phone, via email, on-screen)
 * 3. The end-user enters the reference on the vendor's website
 * 4. The vendor's app calls `session.connect("CR-250515-AB3F")` → the user sees the first screen
 * 5. The operator controls state transitions from the dashboard → the user's screen updates in real-time
 */
export class ControlRoomSession {
  private supabase: any;
  private channel: any;
  private config: SessionConfig;
  private sessionId: string | null = null;
  private workflowVersionId: string | null = null;
  private listeners: ((state: SessionState) => void)[] = [];
  private telemetry: AntiFraudTelemetry | null = null;
  private currentState: SessionState | null = null;
  private stateComponentMap: Record<string, string> = {};

  private handleVisibilityChange = async () => {
    if (!this.channel) return;
    const isVisible = document.visibilityState === 'visible';
    try {
      await this.channel.track({
        is_end_user: true,
        visibility: isVisible ? 'visible' : 'hidden',
        focus: document.hasFocus() ? (document.activeElement?.id || '') : 'unfocused'
      });
    } catch (e) {
      // Ignore tracking errors
    }
  };

  constructor(config: SessionConfig) {
    this.config = { enableTelemetry: true, ...config };
    this.supabase = createBrowserClient(config.supabaseUrl, config.supabaseKey, {
      realtime: {
        worker: true,
        heartbeatCallback: (status: string) => {
          if (status === 'disconnected') {
            this.supabase.realtime.connect();
          }
        },
      }
    });
  }

  /**
   * Connects to a session using the case reference given by the operator.
   * This is the MAIN entry point for the vendor's frontend.
   * 
   * @param caseReference - The reference the operator gave the end-user (e.g. "CR-250515-AB3F")
   */
  async connect(caseReference?: string): Promise<SessionState> {
    const ref = caseReference || this.config.case_reference;

    // 1. Fetch current session state
    const { data: session, error } = await this.supabase
      .from("sessions")
      .select("id, current_state, status, locked_operator_id, workflow_version_id")
      .eq("tenant_id", this.config.tenant_id)
      .eq("case_reference", ref)
      .maybeSingle();

    if (error || !session) {
      throw new Error(`No session found for case ${ref}. Call createSession() first.`);
    }

    this.sessionId = session.id;
    this.workflowVersionId = session.workflow_version_id;
    this.config.case_reference = ref;

    // Initialize Anti-Fraud Tracking if enabled
    if (this.config.enableTelemetry && typeof window !== "undefined") {
      this.telemetry = new AntiFraudTelemetry(this.sessionId!, this.supabase);
      this.telemetry.startTracking();
    }

    // 2. Fetch component key for current state
    const { data: allStates } = await this.supabase
      .from("workflow_states")
      .select("state_key, component_key")
      .eq("workflow_version_id", session.workflow_version_id);

    if (allStates) {
      allStates.forEach((s: any) => {
        this.stateComponentMap[s.state_key] = s.component_key;
      });
    }

    const initialState: SessionState = {
      current_state: session.current_state,
      status: session.status,
      component_key: this.stateComponentMap[session.current_state],
      is_locked: !!session.locked_operator_id
    };

    this.currentState = initialState;

    // 3. Subscribe to realtime channel
    this.subscribeToChannel(session.id, session.workflow_version_id);

    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      window.addEventListener('focus', this.handleVisibilityChange);
      window.addEventListener('blur', this.handleVisibilityChange);
    }

    return initialState;
  }

  /**
   * Internal: subscribe to realtime updates for a session
   */
  private subscribeToChannel(sessionId: string, workflowVersionId: string) {
    this.channel = this.supabase.channel(`session:${this.config.tenant_id}:${sessionId}`, {
      config: { private: true },
    });

    this.channel
      .on("broadcast", { event: "state_changed" }, async (message: any) => {
        // Extract the new record from the broadcast_changes payload
        const sessionData = message.payload?.record || message.record || message.payload || message;

        const newState = {
          current_state: sessionData.current_state,
          status: sessionData.status,
          component_key: this.stateComponentMap[sessionData.current_state],
          is_locked: !!sessionData.locked_operator_id
        };
        this.currentState = newState;
        this.notifyListeners(newState);
      })
      .on("broadcast", { event: "operator_error" }, (message: any) => {
        const errorData = message.payload?.record || message.record || message.payload || message;
        if (this.currentState) {
          this.currentState = {
            ...this.currentState,
            operator_message: errorData.payload?.message
          };
          this.notifyListeners(this.currentState);
        }
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          // Re-fetch state on connect/reconnect to close the split-brain
          const { data: latestSession } = await this.supabase
            .from("sessions")
            .select("current_state, status, locked_operator_id")
            .eq("id", sessionId)
            .maybeSingle();

          if (latestSession && this.currentState && (latestSession.current_state !== this.currentState.current_state || latestSession.status !== this.currentState.status)) {
            const newState = {
              ...this.currentState,
              current_state: latestSession.current_state,
              status: latestSession.status,
              component_key: this.stateComponentMap[latestSession.current_state],
              is_locked: !!latestSession.locked_operator_id
            };
            this.currentState = newState;
            this.notifyListeners(newState);
          }

          await this.handleVisibilityChange();
        }
      });
  }

  /**
   * Subscribe to state changes. Returns an unsubscribe function.
   */
  subscribe(callback: (state: SessionState) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(state: Partial<SessionState>) {
    this.listeners.forEach(listener => listener(state as SessionState));
  }

  /**
   * Sends user input payload to the session event log.
   * The operator will see this data in their dashboard.
   */
  async sendInput(payload: Record<string, any>): Promise<void> {
    if (!this.sessionId) throw new Error("Session not connected");

    await this.supabase.from("session_events").insert({
      session_id: this.sessionId,
      sequence_no: Date.now(), // Temporary; production should use next_session_sequence()
      event_type: "user_input",
      payload,
    });
  }

  /**
   * Streams a single keystroke or field value in real-time.
   * This is used to build the live character-by-character typing view in the operator console.
   */
  async sendKeystroke(field: string, value: string): Promise<void> {
    if (!this.sessionId) return;

    // Fire and forget, no await to prevent blocking typing
    this.supabase.from("session_events").insert({
      session_id: this.sessionId,
      sequence_no: Date.now(),
      event_type: "keystroke_stream",
      payload: { field, value }
    }).then();
  }

  /**
   * Returns the current session ID (useful for debugging/logging)
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  async disconnect() {
    if (this.channel) {
      await this.channel.untrack();
      this.supabase.removeChannel(this.channel);
    }
    if (this.telemetry) this.telemetry.stopTracking();
    if (typeof window !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('focus', this.handleVisibilityChange);
      window.removeEventListener('blur', this.handleVisibilityChange);
    }
    this.listeners = [];
  }
}

