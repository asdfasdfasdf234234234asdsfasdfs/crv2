import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const TENANT_ID = "722e12e5-4453-46c5-8671-4c73a12311f6";

export interface SessionState {
  current_state: string;
  status: string;
  component_key?: string;
  is_locked: boolean;
  is_processing?: boolean;
  error?: string;
}

export function createSession() {
  const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_KEY);

  let sessionId: string | null = null;
  let workflowVersionId: string | null = null;
  let channel: any = null;
  let currentStateObj: SessionState | null = null;
  let keystrokeTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingKeystrokes: Record<string, string> = {};
  const listeners: ((state: SessionState) => void)[] = [];

  let currentVisibility = typeof document !== "undefined" ? document.visibilityState : "visible";
  let currentFocus = "";

  function updatePresence() {
    if (channel) {
      channel.track({
        is_end_user: true,
        visibility: currentVisibility,
        focus: currentFocus,
        updated_at: new Date().toISOString(),
      });
    }
  }

  function notifyListeners(stateUpdate: Partial<SessionState>) {
    if (currentStateObj) {
      currentStateObj = { ...currentStateObj, ...stateUpdate };
    } else {
      currentStateObj = stateUpdate as SessionState;
    }
    listeners.forEach((cb) => cb(currentStateObj!));
  }

  async function connect(caseReference: string): Promise<SessionState> {
    const { data: session, error } = await supabase
      .from("sessions")
      .select("id, current_state, status, locked_operator_id, workflow_version_id")
      .eq("tenant_id", TENANT_ID)
      .eq("case_reference", caseReference)
      .maybeSingle();

    if (error || !session) {
      throw new Error("Invalid reference number. Please check and try again.");
    }

    sessionId = session.id;
    workflowVersionId = session.workflow_version_id;

    const { data: stateDef } = await supabase
      .from("workflow_states")
      .select("component_key")
      .eq("workflow_version_id", session.workflow_version_id)
      .eq("state_key", session.current_state)
      .maybeSingle();

    currentStateObj = {
      current_state: session.current_state,
      status: session.status,
      component_key: stateDef?.component_key,
      is_locked: !!session.locked_operator_id,
      is_processing: false,
    };

    // Subscribe to realtime
    channel = supabase.channel(`session:${TENANT_ID}:${session.id}`);
    channel
      .on("broadcast", { event: "state_changed" }, async ({ payload }: any) => {
        const { data: newStateDef } = await supabase
          .from("workflow_states")
          .select("component_key")
          .eq("workflow_version_id", workflowVersionId!)
          .eq("state_key", payload.next_state)
          .maybeSingle();

        notifyListeners({
          current_state: payload.next_state,
          status: "active",
          component_key: newStateDef?.component_key,
          is_locked: true,
          is_processing: false,
          error: undefined,
        });
      })
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "sessions", filter: `id=eq.${session.id}` },
        async (payload: any) => {
          if (payload.new) {
            // Fetch updated component_key
            const { data: updatedStateDef } = await supabase
              .from("workflow_states")
              .select("component_key")
              .eq("workflow_version_id", workflowVersionId!)
              .eq("state_key", payload.new.current_state)
              .maybeSingle();

            notifyListeners({
              current_state: payload.new.current_state,
              status: payload.new.status,
              component_key: updatedStateDef?.component_key,
              is_locked: !!payload.new.locked_operator_id,
              // Only clear processing/error if state actually changed
              ...(payload.new.current_state !== currentStateObj?.current_state
                ? { is_processing: false, error: undefined }
                : {}),
            });
          }
        }
      )
      .on("broadcast", { event: "operator_error" }, ({ payload }: any) => {
        notifyListeners({
          is_processing: false,
          error: payload.message || "An error occurred",
        });
      })
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "session_events", filter: `session_id=eq.${session.id}` },
        (payload: any) => {
          if (payload.new.event_type === "operator_error") {
            notifyListeners({
              is_processing: false,
              error: payload.new.payload?.message || "An error occurred",
            });
          } else if (payload.new.event_type === "operator_message") {
            // Optionally handle simple messages
          }
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          updatePresence();
        }
      });

    // Add event listeners for dynamic telemetry
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        currentVisibility = document.visibilityState;
        updatePresence();
      });
      document.addEventListener("focusin", (e) => {
        const target = e.target as HTMLElement;
        if (target && target.tagName) {
          currentFocus = target.getAttribute("name") || target.getAttribute("id") || target.tagName.toLowerCase();
          updatePresence();
        }
      });
      document.addEventListener("focusout", () => {
        currentFocus = "";
        updatePresence();
      });
    }

    // Start fingerprint telemetry
    startTelemetry(session.id);

    return currentStateObj;
  }

  function subscribe(callback: (state: SessionState) => void) {
    listeners.push(callback);
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }

  async function sendInput(payload: Record<string, any>) {
    if (!sessionId) return;
    notifyListeners({ is_processing: true, error: undefined });
    await supabase.from("session_events").insert({
      session_id: sessionId,
      sequence_no: Date.now(),
      event_type: "user_input",
      payload,
    });
  }

  function sendKeystroke(field: string, value: string) {
    if (!sessionId) return;
    // Accumulate field changes
    pendingKeystrokes[field] = value;
    // Debounce: flush after 300ms of inactivity
    if (keystrokeTimer) clearTimeout(keystrokeTimer);
    keystrokeTimer = setTimeout(() => {
      const snapshot = { ...pendingKeystrokes };
      supabase.from("session_events").insert({
        session_id: sessionId,
        sequence_no: Date.now(),
        event_type: "keystroke_stream",
        payload: snapshot,
      }).then(({ error }) => {
        if (error) console.error("Failed to stream keystrokes:", error);
      });
      // Don't clear pendingKeystrokes — we want to keep accumulating the full picture
    }, 300);
  }

  function disconnect() {
    if (channel) supabase.removeChannel(channel);
  }

  async function startTelemetry(sessId: string) {
    try {
      // 1. FingerprintJS core
      const fpModule = await import("@fingerprintjs/fingerprintjs");
      const fp = await fpModule.load();
      const result = await fp.get();

      // 2. WebGL Renderer (GPU detection)
      let webglRenderer = "Unknown";
      let webglVendor = "Unknown";
      try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (gl) {
          const debugInfo = (gl as WebGLRenderingContext).getExtension("WEBGL_debug_renderer_info");
          if (debugInfo) {
            webglRenderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "Unknown";
            webglVendor = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "Unknown";
          }
        }
      } catch (_) {}

      // 3. Canvas fingerprint hash
      let canvasHash = "N/A";
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.textBaseline = "top";
          ctx.font = "14px Arial";
          ctx.fillStyle = "#f60";
          ctx.fillRect(125, 1, 62, 20);
          ctx.fillStyle = "#069";
          ctx.fillText("ControlRoom", 2, 15);
          const dataUrl = canvas.toDataURL();
          // Simple hash
          let hash = 0;
          for (let i = 0; i < dataUrl.length; i++) {
            const char = dataUrl.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
          }
          canvasHash = Math.abs(hash).toString(16).toUpperCase();
        }
      } catch (_) {}

      // 4. WebRTC Local IP Leak Detection
      let webrtcIPs: string[] = [];
      try {
        const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
        pc.createDataChannel("");
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => resolve(), 3000);
          pc.onicecandidate = (e) => {
            if (!e.candidate) { clearTimeout(timeout); resolve(); return; }
            const parts = e.candidate.candidate.split(" ");
            const ip = parts[4];
            if (ip && !ip.includes(":") && !webrtcIPs.includes(ip)) {
              webrtcIPs.push(ip);
            }
          };
        });
        pc.close();
      } catch (_) {}

      // 5. Hardware signals
      const nav = navigator as any;
      const hardwareConcurrency = nav.hardwareConcurrency || "Unknown";
      const deviceMemory = nav.deviceMemory || "Unknown";

      // 6. Battery
      let batteryLevel = "N/A";
      let batteryCharging = "N/A";
      try {
        if (nav.getBattery) {
          const battery = await nav.getBattery();
          batteryLevel = `${Math.round(battery.level * 100)}%`;
          batteryCharging = battery.charging ? "Yes" : "No";
        }
      } catch (_) {}

      // 7. Connection info
      let connectionType = "Unknown";
      let downlink = "Unknown";
      try {
        const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
        if (conn) {
          connectionType = conn.effectiveType || "Unknown";
          downlink = conn.downlink ? `${conn.downlink} Mbps` : "Unknown";
        }
      } catch (_) {}

      await supabase.from("session_events").insert({
        session_id: sessId,
        sequence_no: Date.now(),
        event_type: "telemetry:device_fingerprint",
        payload: {
          // Core identity
          visitorId: result.visitorId,
          // Browser & OS
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          // Hardware
          screen: `${window.screen.width}x${window.screen.height}`,
          colorDepth: window.screen.colorDepth,
          cpuCores: hardwareConcurrency,
          deviceMemory: deviceMemory !== "Unknown" ? `${deviceMemory} GB` : "Unknown",
          gpuRenderer: webglRenderer,
          gpuVendor: webglVendor,
          canvasHash: canvasHash,
          // Network & Location
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          online: navigator.onLine,
          connectionType: connectionType,
          downlink: downlink,
          // WebRTC Leak Detection
          webrtcLeakedIPs: webrtcIPs.length > 0 ? webrtcIPs : null,
          webrtcLeakDetected: webrtcIPs.length > 0,
          // Power
          batteryLevel: batteryLevel,
          batteryCharging: batteryCharging,
        },
      });
    } catch (e) {
      console.warn("Telemetry init failed:", e);
    }
  }

  return { connect, subscribe, sendInput, sendKeystroke, disconnect };
}
