import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  UserCog,
  Headphones,
  ArrowRight,
  Zap,
} from "lucide-react";
import { PORTAL_META, DASHBOARD_KPIS } from "@/lib/biharData";
import Login from "./Login";

// const portals = [
//   {
//     role: "superadmin",
//     path: "/",
//     afterLoginPath: "/admin",
//     title: "Super Admin Console",
//     desc: "Full system control - workflow config, SLA, master data, dashboards, MIS reports, user management & audit trail",
//     icon: ShieldCheck,
//     gradient: "from-blue-900 to-blue-600",
//     stats: [
//       "Dynamic Form Config",
//       "SLA & Workflow",
//       "AI Analytics",
//       "MIS Reports",
//     ],
//     user: "Ramanuj Prasad",
//     title2: "SUDA Administrator",
//   },
//   {
//     role: "officer",
//     path: "/",
//     afterLoginPath: "/officer",

//     title: "Officer Portal",
//     desc: "View & action assigned complaints, geo-tag photos, update status, field visit documentation, SLA tracking",
//     icon: UserCog,
//     gradient: "from-blue-800 to-blue-500",
//     stats: ["Complaint Queue", "Field Visit", "Geo-Tag Photo", "Status Update"],
//     user: "Rajesh Kumar Singh",
//     title2: "L1 Field Officer - Patna",
//   },
//   {
//     role: "crm",
//     path: "/",
//     afterLoginPath: "/crm",
//     title: "CRM / Call Centre",
//     desc: "Raise complaints on behalf of citizens, call tracking, shift management, agent performance, officer contact",
//     icon: Headphones,
//     gradient: "from-blue-700 to-sky-500",
//     stats: [
//       "Call Tracker",
//       "Raise Complaint",
//       "Shift Timing",
//       "Agent Dashboard",
//     ],
//     user: "Priya Sharma",
//     title2: "CCE Agent - Morning Shift",
//   },
//   // {
//   //   role: "citizen",
//   //   path: "/citizen",
//   //   title: "Citizen Portal",
//   //   desc: "Raise grievances via 3-step form, track complaint with full timeline, AI chatbot assistance, print complaint",
//   //   icon: Users,
//   //   gradient: "from-blue-600 to-sky-400",
//   //   stats: ["Raise Complaint", "Track Status", "AI Assistant", "Timeline View"],
//   //   user: "Ramesh Prasad",
//   //   title2: "Citizen - Patna",
//   // },
// ];

export default function PortalHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-sky-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-800 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center ring-2 ring-white/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xl font-bold">{PORTAL_META.name}</div>
              <div className="text-sm text-white/70">{PORTAL_META.dept}</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {DASHBOARD_KPIS.totalComplaints.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-white/60">Total Complaints</div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {DASHBOARD_KPIS.resolved.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-white/60">Resolved</div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {DASHBOARD_KPIS.citizenSatisfaction}/5
              </div>
              <div className="text-[11px] text-white/60">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tagline banner */}
      <div className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-2 flex flex-wrap sm:flex-nowrap items-center justify-between text-sm">
          <span className="text-blue-800 font-medium">
            {PORTAL_META.tagline}
          </span>
          <div className="flex items-center gap-3 text-xs text-blue-600">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-green-600" /> All systems operational
            </span>
            <span>-</span>
            <span>Last synced: {(new Date()).toISOString().split("T")?.[0]}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
    
        <Login/>

        <div className="text-center mt-8 text-xs text-muted-foreground">
          {PORTAL_META.name} - {PORTAL_META.version} - Government of Bihar - All
          Rights Reserved
        </div>
      </div>
    </div>
  );
}
