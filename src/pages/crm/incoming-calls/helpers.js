/**
 * Telephony parsing and mapping helpers.
 * Keeps CallContext clean and isolates status derivation logic.
 */

/**
 * Checks if Avaya telephony is operational for this agent.
 * Valid when logged in and in either READY_FREE (idle) or ON_CALL (active/ringing).
 *
 * @param {Object} avayaStatus
 * @returns {boolean}
 */
export const checkIsAvayaReady = (avayaStatus) => {
  if (!avayaStatus) return false;
  const state = String(avayaStatus.state || "").toUpperCase();
  return (
    avayaStatus.isLoggedIn === true
  );
};

/**
 * Maps raw API response from GET /telephony/agent/status into normalized state.
 *
 * @param {Object} rawResponse - Can be response, response.data, or response.data.data
 * @returns {Object} Normalized telephony state
 */
export const mapAgentStatusResponse = (rawResponse) => {
  // Support nested axios responses: res?.data?.data or res?.data or res
  const data = rawResponse?.data?.data ?? rawResponse?.data ?? rawResponse ?? {};
  const avayaStatus = data?.avayaStatus ?? {};
  const isAvayaReady = checkIsAvayaReady(avayaStatus);

  const activeCall = data?.activeCall || null;
  const unifiedStatus = String(data?.unifiedStatus || "").toUpperCase().trim();
  const rawAvayaState = String(avayaStatus?.state || avayaStatus?.status || "").toUpperCase().trim();
  const avayaState = rawAvayaState.replace(/\s+/g, "_");

  const callStatus = String(activeCall?.status || "").toUpperCase().trim();
  const callDisposition = String(activeCall?.disposition || "").toUpperCase().trim();

  let callState = "idle";
  let isHold = false;

  const isReadyOrAfterCall =
    avayaState === "READY_FREE" ||
    avayaState === "WORKING_AFTER_CALL" ||
    avayaState === "WORK_AFTER_CALL" ||
    avayaState.includes("READY_FREE") ||
    avayaState.includes("AFTER_CALL") ||
    rawAvayaState.toLowerCase() === "ready free" ||
    rawAvayaState.toLowerCase() === "working_after_call" ||
    rawAvayaState.toLowerCase() === "working after call";

  if (isAvayaReady) {
    // 1. If Avaya state is READY_FREE or WORKING_AFTER_CALL -> softphone is idle
    if (isReadyOrAfterCall) {
      callState = "idle";
      isHold = false;
    }
    // 2. Ringing state
    else if (
      (unifiedStatus === "RINGING" ||
        callStatus.includes("RING") ||
        callDisposition.includes("RING")) &&
      avayaState === "ON_CALL"
    ) {
      callState = "ringing";
    }
    // 3. On Call state (Avaya state is ON_CALL or active call ongoing)
    else if (avayaState === "ON_CALL") {
      // Check for Hold vs Active Call
      if (callDisposition.includes("HOLD") || callStatus.includes("HOLD")) {
        callState = "connected";
        isHold = true;
      } else if (callStatus.includes("END") || callStatus.includes("DROP")) {
        callState = "idle";
      } else {
        callState = "connected";
        isHold = false;
      }
    }
  }

  const caller =
    activeCall && callState !== "idle"
      ? {
        name:
          activeCall.citizenName ||
          activeCall.screenPop?.citizen?.fullName ||
          activeCall.callerName ||
          activeCall.citizenMobile ||
          activeCall.callerId ||
          "Citizen",
        mobile:
          activeCall.citizenMobile ||
          activeCall.screenPop?.callerMobile ||
          activeCall.callerId ||
          "N/A",
        callId: activeCall.callId || activeCall._id,
        duration: activeCall.duration || "0s",
        recordingUrl: activeCall.recordingUrl,
        disposition: activeCall.disposition,
        createdAt: activeCall.createdAt,
      }
      : null;

  return {
    isAvayaReady,
    callState,
    isHold,
    activeCall: callState !== "idle" ? activeCall : null,
    caller,
    avayaStatus,
    unifiedStatus: data?.unifiedStatus,
    agentId: data?.agentId || avayaStatus?.agentId,
    extension: data?.extension || avayaStatus?.extension,
    isBreak: Boolean(data?.isBreak),
    error: avayaStatus?.error || null,
  };
};

/**
 * Format duration in seconds to "mm:ss"
 */
export const formatDurationMMSS = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};
