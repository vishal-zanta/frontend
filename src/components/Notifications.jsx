import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {getNotification} from "@/api/notification.api";
import { QUERY_KEYS } from "@/utils/constants";

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    text: "3 new complaints assigned to your ward",
    time: "10m ago",
    type: "info",
  },
  {
    id: 2,
    text: "SLA breach warning: 2 complaints approaching deadline",
    time: "30m ago",
    type: "warning",
  },
  {
    id: 3,
    text: "Shift change reminder: Handover at 2:00 PM",
    time: "1h ago",
    type: "info",
  },
];

const renderNotifIcon = (type) => {
  if (type === "success")
    return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
  if (type === "warning")
    return <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />;
  return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
};

export default function Notifications({
  notifications = DEFAULT_NOTIFICATIONS,
  hasUnread = true,
  title = "Notifications",
}) {
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);
  // const {data} = useQuery({
  //   queryFn: ()=> getNotification(),
  //   queryKey: [QUERY_KEYS.notifications],
  //   refetchInterval: 60*1000
  // })
  // console.log({data : data?.data?.data?.docs});


  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={notifRef}>
      <button
        onClick={() => setShowNotifs(!showNotifs)}
        className="p-2 rounded-lg hover:bg-muted text-muted-foreground relative cursor-pointer"
        aria-label="Toggle notifications"
      >
        <Bell className="w-5 h-5" />
        {hasUnread && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {showNotifs && (
        <div className="absolute right-0 top-12 w-80 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="font-semibold text-sm">{title}</span>
            <button
              onClick={() => setShowNotifs(false)}
              className="p-1 hover:bg-muted rounded cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="px-4 py-3 border-b border-border last:border-0 hover:bg-muted flex items-start gap-3"
              >
                <div className="mt-0.5">{renderNotifIcon(n.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{n.text}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {n.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
