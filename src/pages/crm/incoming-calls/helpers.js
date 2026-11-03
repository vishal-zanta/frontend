/**
 * Telephony parsing and mapping helpers.
 * Keeps CallContext clean and isolates status derivation logic.
 */

/**
 * Checks if Avaya telephony is fully connected and ready for calls.
 * Requires isLoggedIn === true and state === "READY_FREE".
 *
 * @param {Object} avayaStatus
 * @returns {boolean}
 */
export const checkIsAvayaReady = (avayaStatus) => {
  if (!avayaStatus) return false;
  return (
    avayaStatus.isLoggedIn === true &&
    String(avayaStatus.state || "").toUpperCase() === "READY_FREE"
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
  const unifiedStatus = String(data?.unifiedStatus || "").toUpperCase();
  const rawCallStatus = String(activeCall?.status || unifiedStatus || "").toUpperCase();

  let callState = "idle";
  let isHold = false;

  // Only evaluate active call states if Avaya is ready
  if (isAvayaReady) {
    if (activeCall) {
      if (rawCallStatus.includes("RING")) {
        callState = "ringing";
      } else if (rawCallStatus.includes("HOLD")) {
        callState = "connected";
        isHold = true;
      } else if (
        rawCallStatus.includes("END") ||
        rawCallStatus.includes("DROP")
      ) {
        callState = "ended";
      } else {
        callState = "connected";
      }
    } else if (unifiedStatus === "RINGING") {
      callState = "ringing";
    } else if (unifiedStatus === "IN_CALL") {
      callState = "connected";
    }
  }

  const caller = activeCall
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
        callType: activeCall.callType || "Inbound",
        callId: activeCall.callId || activeCall._id,
        duration: activeCall.duration || "0s",
        recordingUrl: activeCall.recordingUrl,
        disposition: activeCall.disposition,
      }
    : null;

  return {
    isAvayaReady,
    callState,
    isHold,
    activeCall,
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
