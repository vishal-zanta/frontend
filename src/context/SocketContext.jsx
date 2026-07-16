import React, { createContext, useContext, useEffect, useRef, useCallback } from "react";
import socketIOClient from "socket.io-client";

const SocketContext = createContext(null);

/**
 * Wrap your app (or the authenticated part of it) with this ONE time,
 * e.g. in App.jsx around your routes. This guarantees exactly one
 * socket connection for the whole app, no matter how many components
 * use useSockets().
 */
export function SocketProvider({ children , url}) {
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map()); // eventType -> Set<callback>

  // create the socket exactly once
  if (!socketRef.current) {
    const token =
      localStorage.getItem("usertoken") || sessionStorage.getItem("usertoken");
    const link = url ??  `${import.meta.env.VITE_BASE_URL}?token=${token}`;

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
     
    console.log(`[socket] event -> ${eventType}`, payload);
      const callbacks = listenersRef.current.get(eventType);
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
  }

  // disconnect only when the provider itself unmounts (app close/logout),
  // not on every component render
  useEffect(() => {
    const socket = socketRef.current;
    return () => {
      socket.offAny();
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  const subscribe = useCallback((eventType, callback) => {
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
    ackCallback ? socket.emit(eventType, payload, ackCallback) : socket.emit(eventType, payload);
    return true;
  }, []);

  return (
    <SocketContext.Provider value={{ subscribe, emit, socket: socketRef.current }}>
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