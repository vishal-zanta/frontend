import React, { useState } from "react";
import { Bell, Globe, Save, Check } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LangSelector from "@/components/LangSelector";

export default function CRMSettings() {
  const [toast, setToast] = useState("");
  const [settings, setSettings] = useState({
    callAlerts: true,
    shiftReminders: true,
    complaintUpdates: true,
    slaAlerts: true,
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  return (
    <PortalLayout role="crm">
      <div className="p-6 space-y-6">
        <SectionTitle title="CRM Settings" subtitle="Manage your call centre notification preferences" />

        {toast && (
          <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-blue-500" /> Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { key: "callAlerts", label: "Incoming Call Alerts", desc: "Screen popup when a new call arrives" },
              { key: "shiftReminders", label: "Shift Change Reminders", desc: "Get notified 15 minutes before your shift ends" },
              { key: "complaintUpdates", label: "Complaint Status Updates", desc: "Notifications when complaints you raised get updated" },
              { key: "slaAlerts", label: "SLA Breach Alerts", desc: "Alert when a complaint you raised is nearing SLA breach" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings[item.key] ? "bg-blue-600" : "bg-muted"}`}
                >
                  <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${settings[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-500" /> Display Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">Language</Label>
            <LangSelector triggerClassName={"w-full"}/>
              
            </div>
            <div>
              <Label className="mb-1.5 block">Call Display Format</Label>
              <select className="w-full border border-input rounded-md p-2 text-sm">
                <option>Standard (Caller ID + Name)</option>
                <option>Detailed (Caller ID + History)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => showToast("Settings saved successfully")}>
            <Save className="w-4 h-4 mr-1" /> Save Settings
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}