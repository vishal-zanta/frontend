import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAgentStatus,
  getCallDetails,
  postAnswerCall,
  postHoldCall,
  postDropCall,
} from "@/api/calling.api";
import { useSockets } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { mapAgentStatusResponse } from "@/pages/crm/incoming-calls/helpers";
import notiSound from "@/assets/notification.wav";

const CallContext = createContext(null);

export function CallProvider({ children }) {
  const queryClient = useQueryClient();
  const { subscribe } = useSockets() || {};
  const { profiledata } = useAuth();

  const [callDuration, setCallDuration] = useState(0);
  const [localCallStateOverride, setLocalCallStateOverride] = useState(null); // Used for immediate UI feedback on user actions
  const [callDetails, setCallDetails] = useState(null);

  const audioRef = useRef(null);

  // Poll agent status every 20 seconds
  const {
    data: responseData,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ["telephonyAgentStatus"],
    queryFn: async () => {
      const response = await getAgentStatus();
      const data = response?.data?.data ?? response?.data;
      return data;
    },
    enabled: Boolean(profiledata?.isCCE),
    refetchInterval: 20000,
    refetchIntervalInBackground: true,
  });

  // Map response using standalone helper (logic outside context)
  const mappedState = useMemo(() => {
    return mapAgentStatusResponse(responseData);
  }, [responseData]);

  const playRingtone = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(notiSound);
        audioRef.current.loop = true;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("[CallContext] Ringtone audio playback prevented:", err);
      });
    } catch (e) {
      console.error("[CallContext] Ringtone audio error:", e);
    }
  }, []);

  const stopRingtone = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (e) {
        console.error("[CallContext] Stop ringtone error:", e);
      }
    }
  }, []);

  // Effective call state: fallback to mapped state if no local override
  const effectiveCallState =
    localCallStateOverride || mappedState.callState || "idle";

  // Manage duration timer when connected
  useEffect(() => {
    if (effectiveCallState === "connected") {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCallDuration(0);
    }
  }, [effectiveCallState]);

  // Handle ringtone based on effective state
  useEffect(() => {
    if (effectiveCallState === "ringing") {
      playRingtone();
    } else {
      stopRingtone();
    }
  }, [effectiveCallState, playRingtone, stopRingtone]);

  // Reset local override when mapped state syncs up
  useEffect(() => {
    if (mappedState.callState && mappedState.callState === localCallStateOverride) {
      setLocalCallStateOverride(null);
    }
  }, [mappedState.callState, localCallStateOverride]);

  // Only subscribe to call socket events if profiledata.isCCE is true
  useEffect(() => {
    if (!profiledata?.isCCE || !subscribe) {
      return;
    }

    console.log("[CallContext] Agent is CCE. Subscribing to call events...");

    // 1. Ringing event -> Invalidate/refetch status & ring
    const unsubRinging = subscribe("call:ringing", (data) => {
      console.log("[CallContext] Socket event call:ringing received:", data);
      setLocalCallStateOverride("ringing");
      playRingtone();
      queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
    });

    // 2. Answered event -> Stop ringtone, connect, invalidate status
    const unsubAnswered = subscribe("call:answered", (data) => {
      console.log("[CallContext] Socket event call:answered received:", data);
      stopRingtone();
      setLocalCallStateOverride("connected");
      queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
    });

    // 3. Dropped event -> Stop ringtone, end, invalidate status
    const unsubDropped = subscribe("call:dropped", (data) => {
      console.log("[CallContext] Socket event call:dropped received:", data);
      stopRingtone();
      setLocalCallStateOverride("ended");
      queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
    });

    return () => {
      stopRingtone();
      unsubRinging?.();
      unsubAnswered?.();
      unsubDropped?.();
    };
  }, [profiledata?.isCCE, subscribe, queryClient, playRingtone, stopRingtone]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
    };
  }, [stopRingtone]);

  // Fetch full call details on answer
  const fetchCallDetails = useCallback(async () => {
    try {
      const res = await getCallDetails();
      const details = res?.data?.data ?? res?.data;
      setCallDetails(details);
      return details;
    } catch (err) {
      console.error("[CallContext] Error fetching /telephony/call/details:", err);
      return null;
    }
  }, []);

  // Action: Answer Call
  const answerCallMutation = useMutation({
    mutationFn: (payload) => postAnswerCall(payload),
    onSuccess: async () => {
      stopRingtone();
      setLocalCallStateOverride("connected");
      await queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
      fetchCallDetails();
    },
  });

  // Action: Hold / Resume Call
  const holdCallMutation = useMutation({
    mutationFn: (payload) => postHoldCall(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
    },
  });

  // Action: Drop / Hangup Call
  const dropCallMutation = useMutation({
    mutationFn: (payload) => postDropCall(payload),
    onSuccess: async () => {
      stopRingtone();
      setLocalCallStateOverride("ended");
      await queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
    },
  });

  const value = {
    // Raw & Mapped state
    responseData,
    isStatusLoading,
    refetchStatus,
    telephonyState: mappedState,
    isAvayaReady: mappedState.isAvayaReady,
    callState: effectiveCallState,
    isHold: mappedState.isHold,
    activeCall: mappedState.activeCall,
    caller: mappedState.caller,
    avayaStatus: mappedState.avayaStatus,
    unifiedStatus: mappedState.unifiedStatus,
    agentId: mappedState.agentId,
    extension: mappedState.extension,
    isBreak: mappedState.isBreak,

    // Call details
    callDetails,
    fetchCallDetails,

    // Duration timer & audio
    callDuration,
    setCallDuration,
    playRingtone,
    stopRingtone,

    // Actions & Mutations
    answerCall: (callId) =>
      answerCallMutation.mutateAsync({
        callId: callId || mappedState.caller?.callId,
      }),
    holdCall: (callId, hold = true) =>
      holdCallMutation.mutateAsync({
        callId: callId || mappedState.caller?.callId,
        hold,
      }),
    dropCall: (callId) =>
      dropCallMutation.mutateAsync({
        callId: callId || mappedState.caller?.callId,
      }),

    isAnswering: answerCallMutation.isPending,
    isHolding: holdCallMutation.isPending,
    isDropping: dropCallMutation.isPending,

    // Quick status flags
    isRinging: effectiveCallState === "ringing",
    isConnected: effectiveCallState === "connected",
    isEnded: effectiveCallState === "ended",
    hasActiveCall: Boolean(
      effectiveCallState === "ringing" ||
        effectiveCallState === "connected" ||
        effectiveCallState === "ended"
    ),
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export function useCall() {
  const context = useContext(CallContext);
  return (
    context || {
      responseData: null,
      isStatusLoading: false,
      refetchStatus: () => {},
      telephonyState: {},
      isAvayaReady: false,
      callState: "idle",
      isHold: false,
      activeCall: null,
      caller: null,
      avayaStatus: null,
      unifiedStatus: null,
      agentId: null,
      extension: null,
      isBreak: false,
      callDetails: null,
      fetchCallDetails: async () => null,
      callDuration: 0,
      setCallDuration: () => {},
      playRingtone: () => {},
      stopRingtone: () => {},
      answerCall: async () => {},
      holdCall: async () => {},
      dropCall: async () => {},
      isAnswering: false,
      isHolding: false,
      isDropping: false,
      isRinging: false,
      isConnected: false,
      isEnded: false,
      hasActiveCall: false,
    }
  );
}

export default CallContext;
