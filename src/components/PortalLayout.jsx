import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Chatbot from "@/components/Chatbot";
import { usePortalProfile } from "@/hooks/usePortalProfile";
import clsx from "clsx";

export default function PortalLayout({ children, role = "superadmin", isHideOverflow = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const portal = role === "crm" ? "crm" : role === "officer" ? "officer" : null;
  const [profile, setProfile] = usePortalProfile(portal);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} profile={profile} open={sidebarOpen} onClose={() => { if (typeof window !== "undefined" && window.innerWidth < 1024) setSidebarOpen(false); }} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar role={role} profile={profile} onProfileChange={setProfile} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className={clsx("flex-1", !isHideOverflow && "overflow-x-hidden")}>
          {children}
        </main>
      </div>
      {role === "citizen" && <Chatbot role={role} />}
    </div>
  );
}