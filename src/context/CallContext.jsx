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
  postUnholdCall,
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
  console.log({mappedState, responseData});

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

  // Effective call state: if backend status is idle (e.g. READY_FREE / WORKING_AFTER_CALL), force idle
  const effectiveCallState =
    mappedState.callState === "idle"
      ? "idle"
      : localCallStateOverride || mappedState.callState || "idle";

  // Manage duration timer when connected
  // TODO : MAke an seprate component that takes ISO string and rerenders for duration .
  // useEffect(() => {
  //   if (effectiveCallState === "connected") {
  //     const interval = setInterval(() => {
  //       setCallDuration((prev) => prev + 1);
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   } else {
  //     setCallDuration(0);
  //   }
  // }, [effectiveCallState]);

  // Handle ringtone based on effective state
  useEffect(() => {
    if (effectiveCallState === "ringing") {
      playRingtone();
    } else {
      stopRingtone();
    }
  }, [effectiveCallState, playRingtone, stopRingtone]);

  // Reset local override when mapped state syncs up or becomes idle
  useEffect(() => {
    if (
      mappedState.callState === "idle" ||
      (mappedState.callState && mappedState.callState === localCallStateOverride)
    ) {
      setLocalCallStateOverride(null);
    }
  }, [mappedState.callState, localCallStateOverride]);

  // Only subscribe to call socket events if profiledata.isCCE is true
  useEffect(() => {
    if (!profiledata?.isCCE || !subscribe) {
      return;
    }

    console.log("[CallContext] Agent is CCE. Subscribing to call events...",);

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
      // queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
      fetchCallDetails();
    });

    // 3. Dropped event -> Stop ringtone, reset override to idle, invalidate status
    const unsubDropped = subscribe("call:dropped", (data) => {
      console.log("[CallContext] Socket event call:dropped received:", data);
      stopRingtone();
      setLocalCallStateOverride("idle");
      // queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
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

  // Whenever call enters connected state, fetch call details (for answerTimeISO, duration, etc.)
  useEffect(() => {
    if (effectiveCallState === "connected") {
      fetchCallDetails();
    } else if (effectiveCallState === "idle" || effectiveCallState === "ended") {
      setCallDetails(null);
    }
  }, [effectiveCallState, fetchCallDetails]);

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

  // Action: Hold Call
  const holdCallMutation = useMutation({
    mutationFn: (payload) => postHoldCall(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
    },
  });

  // Action: Unhold Call
  const unholdCallMutation = useMutation({
    mutationFn: (payload) => postUnholdCall(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["telephonyAgentStatus"] });
    },
  });

  // Action: Drop / Hangup Call
  const dropCallMutation = useMutation({
    mutationFn: (payload) => postDropCall(payload),
    onSuccess: async () => {
      stopRingtone();
      setLocalCallStateOverride("idle");
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
    holdCall: (callId) =>
      holdCallMutation.mutateAsync({
        callId: callId || mappedState.caller?.callId,
      }),
    unholdCall: (callId) =>
      unholdCallMutation.mutateAsync({
        callId: callId || mappedState.caller?.callId,
      }),
    dropCall: (callId) =>
      dropCallMutation.mutateAsync({
        callId: callId || mappedState.caller?.callId,
      }),

    isAnswering: answerCallMutation.isPending,
    isHolding: holdCallMutation.isPending,
    isUnholding: unholdCallMutation.isPending,
    isDropping: dropCallMutation.isPending,

    // Quick status flags
    isRinging: effectiveCallState === "ringing",
    isConnected: effectiveCallState === "connected",
    isEnded: effectiveCallState === "ended",
    hasActiveCall: Boolean(
      effectiveCallState === "ringing" ||
        effectiveCallState === "connected"
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
      unholdCall: async () => {},
      dropCall: async () => {},
      isAnswering: false,
      isHolding: false,
      isUnholding: false,
      isDropping: false,
      isRinging: false,
      isConnected: false,
      isEnded: false,
      hasActiveCall: false,
    }
  );
}

export default CallContext;
