import React, { useState } from "react";
import { Bell, Globe, Save, Check } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LangSelector from "@/components/LangSelector"

export default function OfficerSettings() {
  const [toast, setToast] = useState("");
  const [settings, setSettings] = useState({
    smsAlerts: true,
    emailAlerts: true,
    slaReminders: true,
    newAssignment: true,
    mobileApp: true,
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  return (
    <PortalLayout role="officer">
      <div className="p-6 space-y-6">
        <SectionTitle title="Officer Settings" subtitle="Manage your notification preferences and display options" />

        {toast && (
          <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-blue-500" /> Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { key: "smsAlerts", label: "SMS Alerts for New Complaints", desc: "Receive SMS when a new complaint is assigned to you" },
              { key: "emailAlerts", label: "Email Summary (Daily)", desc: "Daily digest of your assigned complaints at 8:00 AM" },
              { key: "slaReminders", label: "SLA Breach Reminders", desc: "Get notified 2 hours before SLA deadline" },
              { key: "newAssignment", label: "New Assignment Notifications", desc: "Real-time push when a complaint is assigned" },
              { key: "mobileApp", label: "Mobile App Push Notifications", desc: "Enable push notifications on the field officer app" },
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
              <Label className="mb-1.5 block">Time Zone</Label>
              <select className="w-full border border-input rounded-md p-2 text-sm">
                <option>IST (GMT+5:30)</option>
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