import React, { createContext, useContext, useEffect, useRef, useCallback } from "react";
import socketIOClient from "socket.io-client";

const SocketContext = createContext(null);

/**
 * Wrap your app (or the authenticated part of it) with this ONE time,
 * e.g. in App.jsx around your routes. This guarantees exactly one
 * socket connection for the whole app, no matter how many components
 * use useSockets().
 */
export function SocketProvider({ children, url }) {
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map()); // eventType -> Set<callback>

  const getToken = () =>
    localStorage.getItem("usertoken") || sessionStorage.getItem("usertoken");

  const initSocket = useCallback(
    (overrideUrl) => {
      // Tear down any existing socket before creating a new one
      if (socketRef.current) {
        socketRef.current.offAny();
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }

      const token = getToken();
      const link =
        overrideUrl ?? url ?? `${import.meta.env.VITE_BASE_URL}?token=${token}`;

      const socket = socketIOClient(link, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 30000,
        randomizationFactor: 0.5,
        transports: ["websocket"],
      });

      // single onAny dispatcher fans out to all subscribers, registered once
      socket.onAny((eventType, payload) => {
        const callbacks = listenersRef.current.get(eventType);
        console.log(`[socket] event -> ${eventType}`, payload, callbacks);
        if (!callbacks) return;
        callbacks.forEach((cb) => {
          try {
            cb(payload);
          } catch (err) {
            console.error(`[socket] listener error for "${eventType}"`, err);
          }
        });
      });

      socketRef.current = socket;
    },
    [url],
  );

  // Create the socket AFTER first mount so the auth token is already in
  // storage. The login flow writes the token before navigating, but React's
  // synchronous render (and the old `if (!socketRef.current)` guard) would
  // run before that write completed. Moving to useEffect + setTimeout(0)
  // pushes socket creation to after the current JS task finishes, guaranteeing
  // the token is present.
  useEffect(() => {
    const tid = setTimeout(() => initSocket(), 100);
    return () => clearTimeout(tid);
  }, [initSocket]);

  // Disconnect only when the provider itself unmounts (app close / logout)
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.offAny();
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    };
  }, []);

  const subscribe = useCallback((eventType, callback) => {
    // console.log("Subcribe : ", eventType , callback);
    if (!listenersRef.current.has(eventType)) {
      listenersRef.current.set(eventType, new Set());
    }
    listenersRef.current.get(eventType).add(callback);
    return () => {
      listenersRef.current.get(eventType)?.delete(callback);
    };
  }, []);

  const emit = useCallback((eventType, payload, ackCallback) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      console.warn("[socket] cannot emit, not connected");
      return false;
    }
    ackCallback
      ? socket.emit(eventType, payload, ackCallback)
      : socket.emit(eventType, payload);
    return true;
  }, []);

  // Expose reconnect so callers can force a fresh authenticated connection
  // (e.g. call this right after storing a new token on login)
  const reconnect = useCallback(() => initSocket(), [initSocket]);

  return (
    <SocketContext.Provider value={{ subscribe, emit, reconnect, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSockets() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSockets must be used within a <SocketProvider>");
  }
  return ctx;
}