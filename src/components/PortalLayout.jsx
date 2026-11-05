import React, { useState, useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Chatbot from "@/components/Chatbot";
import ChatWidget from "@/components/chats";
import CallPill from "@/pages/crm/incoming-calls/CallPill";
import clsx from "clsx";
import { SocketProvider } from "@/context/SocketContext";
import { CallProvider } from "@/context/CallContext";
import { useAuth } from "@/context/AuthContext";
import { PERMISSIONS } from "@/utils/constants";

export default function PortalLayout({
  children,
  role,
  isHideOverflow = false,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { hasPermission, profiledata } = useAuth();
  const shouldEnableSockets = hasPermission(PERMISSIONS.CHAT) || profiledata?.isCCE;

  // Determine active role for sidebar dynamically from profiledata
  const activeRole = useMemo(() => {
    if (role && ["crm", "officer", "superadmin"].includes(role)) {
      return role;
    }
    if (profiledata?.isCRM) return "crm";
    if (profiledata?.isOfficer) return "officer";
    return "superadmin";
  }, [role, profiledata]);

  const layoutContent = (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        role={activeRole}
        open={sidebarOpen}
        onClose={() => {
          if (typeof window !== "undefined" && window.innerWidth < 1024)
            setSidebarOpen(false);
        }}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main
          className={clsx("flex-1 min-w-0", !isHideOverflow && "overflow-x-hidden")}
        >
          {children || <Outlet />}
        </main>
      </div>
  
      {hasPermission(PERMISSIONS.CHAT) && <ChatWidget />}
      {profiledata?.isCRM && <CallPill sidebarOpen={sidebarOpen} />}
    </div>
  );

  if (shouldEnableSockets) {
    return (
      <SocketProvider>
        <CallProvider>{layoutContent}</CallProvider>
      </SocketProvider>
    );
  }

  return layoutContent;
}
