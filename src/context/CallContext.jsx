import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getAgentStatus,
  getCallDetails,
  postAnswerCall,
  postHoldCall,
  postUnholdCall,
  postDropCall,
  postTransferCall,
  postConsultCall,
  postConferenceCall,
  postConsultCancel,
} from "@/api/calling.api";
import { useSockets } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { mapAgentStatusResponse } from "@/pages/crm/incoming-calls/helpers";
import notiSound from "@/assets/notification.wav";

const CallContext = createContext(null);

export function CallProvider({ children }) {
  const { subscribe } = useSockets() || {};
  const { profiledata } = useAuth();

  // Core streamlined states (mutated by webhook events & actions)
  const [callState, setCallState] = useState("idle"); // "idle" | "ringing" | "connected"
  const [isHold, setIsHold] = useState(false);
  const [isTransfer, setIsTransfer] = useState(false);
  const [isConsult, setIsConsult] = useState(false);
  const [isConference, setIsConference] = useState(false);
  // const [isMuted, setIsMuted] = useState(false);
  // const [isRecording, setIsRecording] = useState(true);
  const [callDetails, setCallDetails] = useState(null);

  const audioRef = useRef(null);
  const isInitialRestoreDone = useRef(false);

  // Background polling for agent presence, break & telephony icon (DO NOT invalidate on events/actions)
  const {
    data: responseData,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ["telephonyAgentStatus"],
    queryFn: async () => {
      const response = await getAgentStatus();
      return response?.data?.data ?? response?.data ?? response;
    },
    enabled: Boolean(profiledata?.isCRM),
    refetchInterval: 20000,
    refetchIntervalInBackground: true,
  });

  // Normalized Avaya status from poll for TopCallStatusIcon
  const mapped = useMemo(() => {
    return mapAgentStatusResponse(responseData);
  }, [responseData]);

  const currentAvayaStatus =
    mapped.avayaStatus || responseData?.avayaStatus || null;

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

  // 1. Initial State Restoration: Only sets initialStates on first load/mount from status data
  useEffect(() => {
    if (!responseData || isInitialRestoreDone.current) return;
    isInitialRestoreDone.current = true;

    if (mapped.callState === "idle") {
      setCallState("idle");
      setIsHold(false);
      setCallDetails(null);
    } else {
      setCallState(mapped.callState);
      setIsHold(Boolean(mapped.isHold));

      if (mapped.callState === "ringing") {
        playRingtone();
      }

      const active = mapped.activeCall;
      const restoredDetails = {
        callId: active?.callId || active?._id,
        callerId:
          active?.citizenMobile || active?.callerId || active?.callerName,
        callStartTime: active?.createdAt,
        screenPop: active?.screenPop || null,
      };

      if (mapped.callState === "connected") {
        getCallDetails()
          .then((detailsRes) => {
            const d = detailsRes?.data?.data ?? detailsRes?.data;
            if (d) {
              setCallDetails((prev) => ({
                ...(prev || restoredDetails),
                callStartTime: d.answerTimeISO,
              }));
              // if (typeof d.isMuted === "boolean") {
              //   setIsMuted(d.isMuted);
              // }
            }
          })
          .catch((e) =>
            console.error("[CallContext] Error restoring call details:", e),
          );
      }

      setCallDetails(restoredDetails);
    }
  }, [responseData, mapped, playRingtone]);

  // 2. Subscribe to Webhook Events for real-time state mutation
  useEffect(() => {
    if (!profiledata?.isCRM || !subscribe) return;

    // 1. call:ringing (Screen Pop)
    const unsubRinging = subscribe("call:ringing", (data) => {
      console.log("[CallContext] Webhook event call:ringing received:", data);
      setCallState("ringing");
      setIsHold(false);
      playRingtone();

      setCallDetails({
        callId: data?.callId,
        callerId: data?.callerId,
        callStartTime: data?.timestamp || new Date().toISOString(),
        screenPop: data?.screenPop || null,
      });
    });

    // 2. call:answered (Start Call Timer)
    const unsubAnswered = subscribe("call:answered", (data) => {
      console.log("[CallContext] Webhook event call:answered received:", data);
      stopRingtone();
      setCallState("connected");
      setIsHold(false);

      setCallDetails((prev) => ({
        callId: data?.callId || prev?.callId,
        callerId: data?.callerId || prev?.callerId,
        callStartTime:
          data?.timestamp || prev?.callStartTime || new Date().toISOString(),
        screenPop: prev?.screenPop || null,
      }));
    });

    // 3. call:dropped (Call Disconnected)
    const unsubDropped = subscribe("call:dropped", (data) => {
      console.log("[CallContext] Webhook event call:dropped received:", data);
      stopRingtone();
      setCallState("idle");
      setIsHold(false);
      setIsTransfer(false);
      setIsConsult(false);
      setIsConference(false);
      // setIsMuted(false);
      // setIsRecording(true);
      setCallDetails(null);
    });

    // 4. call:hold
    const unsubHold = subscribe("call:hold", (data) => {
      console.log("[CallContext] Webhook event call:hold received:", data);
      setIsHold(true);
    });

    // 5. call:unhold
    const unsubUnhold = subscribe("call:unhold", (data) => {
      console.log("[CallContext] Webhook event call:unhold received:", data);
      setIsHold(false);
    });

    // 6. call:mute (commented out)
    // const unsubMute = subscribe("call:mute", (data) => {
    //   console.log("[CallContext] Webhook event call:mute received:", data);
    //   setIsMuted(true);
    // });

    // 7. call:unmute (commented out)
    // const unsubUnmute = subscribe("call:unmute", (data) => {
    //   console.log("[CallContext] Webhook event call:unmute received:", data);
    //   setIsMuted(false);
    // });

    return () => {
      stopRingtone();
      unsubRinging?.();
      unsubAnswered?.();
      unsubDropped?.();
      unsubHold?.();
      unsubUnhold?.();
      // unsubMute?.();
      // unsubUnmute?.();
    };
  }, [profiledata?.isCRM, subscribe, playRingtone, stopRingtone]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
    };
  }, [stopRingtone]);

  // 3. Direct state mutations on action success (No Query Invalidation)
  const answerCallMutation = useMutation({
    mutationFn: () => postAnswerCall(),
    onSuccess: () => {
      stopRingtone();
      setCallState("connected");
      setCallDetails((prev) => ({
        ...(prev || {}),
        callStartTime: prev?.callStartTime || new Date().toISOString(),
      }));
    },
  });

  const holdCallMutation = useMutation({
    mutationFn: () => postHoldCall(),
    onSuccess: () => {
      setIsHold(true);
    },
  });

  const unholdCallMutation = useMutation({
    mutationFn: () => postUnholdCall(),
    onSuccess: () => {
      setIsHold(false);
    },
  });

  const dropCallMutation = useMutation({
    mutationFn: () => postDropCall(),
    onSuccess: () => {
      stopRingtone();
      setCallState("idle");
      setIsHold(false);
      setIsTransfer(false);
      setIsConsult(false);
      setIsConference(false);
      // setIsMuted(false);
      // setIsRecording(true);
      setCallDetails(null);
    },
  });

  const transferCallMutation = useMutation({
    mutationFn: ({ targetUserId }) => postTransferCall({ targetUserId }),
    onSuccess: () => {
      setIsTransfer(true);
    },
  });

  const consultCallMutation = useMutation({
    mutationFn: ({ targetUserId }) => postConsultCall({ targetUserId }),
    onSuccess: () => {
      setIsConsult(true);
    },
  });

  const conferenceCallMutation = useMutation({
    mutationFn: ({ targetUserId }) => postConferenceCall({ targetUserId }),
    onSuccess: () => {
      setIsConference(true);
    },
  });

  const consultCancelMutation = useMutation({
    mutationFn: () => postConsultCancel(),
    onSuccess: () => {
      setIsConsult(false);
    },
  });

  const toggleHold = useCallback(
    async (target) => {
      const nextHold = typeof target === "boolean" ? target : !isHold;
      setIsHold(nextHold);
      try {
        if (nextHold) {
          await holdCallMutation.mutateAsync();
        } else {
          await unholdCallMutation.mutateAsync();
        }
      } catch (err) {
        console.error("[CallContext] Error toggling hold:", err);
        setIsHold(!nextHold);
      }
    },
    [isHold, holdCallMutation, unholdCallMutation],
  );

  // Mute & Recording functionality commented out for now
  // const toggleMute = useCallback(() => {
  //   setIsMuted((prev) => !prev);
  // }, []);

  // const toggleRecording = useCallback(() => {
  //   setIsRecording((prev) => !prev);
  // }, []);

  // Compute safe caller object for consumers
  const caller = useMemo(() => {
    if (!callDetails) return null;
    return {
      name:
        callDetails.screenPop?.citizen?.fullName ||
        "Citizen",
      mobile:
        callDetails.screenPop?.callerMobile || callDetails.callerId || "",
      callId: callDetails.callId,
      district: callDetails.screenPop?.citizen?.address?.district || "",
      ward: callDetails.screenPop?.citizen?.address?.addressLine || "",
      createdAt: callDetails.callStartTime,
      screenPop: callDetails.screenPop,
    };
  }, [callDetails]);

  const hasActiveCall = callState === "ringing" || callState === "connected";

  const value = {
    // Core states
    callState,
    isHold,
    setIsHold: toggleHold,
    toggleHold,
    isTransfer,
    isConsult,
    isConference,
    // Mute & Recording stubs
    isMuted: false,
    setIsMuted: () => {},
    toggleMute: () => {},
    isRecording: false,
    setIsRecording: () => {},
    toggleRecording: () => {},
    callDetails,
    caller,
    activeCall: callDetails,
    hasActiveCall,

    // Status & Readiness
    avayaStatus: currentAvayaStatus,
    responseData,
    isStatusLoading,
    refetchStatus,
    isAvayaReady: Boolean(currentAvayaStatus?.isLoggedIn),
    extension: currentAvayaStatus?.extension,
    agentId: currentAvayaStatus?.agentId,

    // Actions & Mutations
    answerCall: () => answerCallMutation.mutateAsync(),
    holdCall: () => holdCallMutation.mutateAsync(),
    unholdCall: () => unholdCallMutation.mutateAsync(),
    dropCall: () => dropCallMutation.mutateAsync(),
    transferCall: (targetUserId) =>
      transferCallMutation.mutateAsync({ targetUserId }),
    consultCall: (targetUserId) =>
      consultCallMutation.mutateAsync({ targetUserId }),
    conferenceCall: (targetUserId) =>
      conferenceCallMutation.mutateAsync({ targetUserId }),
    consultCancel: () => consultCancelMutation.mutateAsync(),

    isAnswering: answerCallMutation.isPending,
    isHolding: holdCallMutation.isPending,
    isUnholding: unholdCallMutation.isPending,
    isDropping: dropCallMutation.isPending,
    isTransferring: transferCallMutation.isPending,
    isConsulting: consultCallMutation.isPending,
    isConferencing: conferenceCallMutation.isPending,
    isCancellingConsult: consultCancelMutation.isPending,

    // Audio
    playRingtone,
    stopRingtone,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export function useCall() {
  const context = useContext(CallContext);
  return (
    context || {
      callState: "idle",
      isHold: false,
      setIsHold: () => {},
      toggleHold: async () => {},
      isMuted: false,
      setIsMuted: () => {},
      toggleMute: () => {},
      isRecording: true,
      setIsRecording: () => {},
      toggleRecording: () => {},
      callDetails: null,
      caller: null,
      activeCall: null,
      hasActiveCall: false,
      avayaStatus: null,
      responseData: null,
      isStatusLoading: false,
      isRestoring: false,
      refetchStatus: async () => {},
      restoreStatus: async () => {},
      isAvayaReady: false,
      extension: null,
      agentId: null,
      answerCall: async () => {},
      holdCall: async () => {},
      unholdCall: async () => {},
      dropCall: async () => {},
      transferCall: async () => {},
      consultCall: async () => {},
      conferenceCall: async () => {},
      consultCancel: async () => {},
      isTransfer: false,
      isConsult: false,
      isConference: false,
      isAnswering: false,
      isHolding: false,
      isUnholding: false,
      isDropping: false,
      isTransferring: false,
      isConsulting: false,
      isConferencing: false,
      isCancellingConsult: false,
      playRingtone: () => {},
      stopRingtone: () => {},
    }
  );
}

export default CallContext;
