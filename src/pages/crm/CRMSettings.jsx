import React, { useState } from "react";
import { Bell, Globe, Save, Check } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LangSelector from "@/components/LangSelector";
import { useLanguage } from "@/context/LanguageContext";

export default function CRMSettings() {
  const { t } = useLanguage();
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
        <SectionTitle title={t("CRM Settings", "सीआरएम सेटिंग्स")} subtitle={t("Manage your call centre notification preferences", "अपनी कॉल सेंटर अधिसूचना प्राथमिकताओं को प्रबंधित करें")} />

        {toast && (
          <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" /> {t("Notification Preferences", "अधिसूचना प्राथमिकताएं")}
          </h3>
          <div className="space-y-3">
            {[
              { key: "callAlerts", label: t("Incoming Call Alerts", "आगमन कॉल अलर्ट"), desc: t("Screen popup when a new call arrives", "नई कॉल आने पर स्क्रीन पॉपअप") },
              { key: "shiftReminders", label: t("Shift Change Reminders", "शिफ्ट परिवर्तन अनुस्मारक"), desc: t("Get notified 15 minutes before your shift ends", "आपकी शिफ्ट समाप्त होने से 15 मिनट पहले सूचित किया जाए") },
              { key: "complaintUpdates", label: t("Complaint Status Updates", "शिकायत की स्थिति अपडेट"), desc: t("Notifications when complaints you raised get updated", "आपके द्वारा दर्ज की गई शिकायतों के अपडेट होने पर सूचनाएं") },
              { key: "slaAlerts", label: t("SLA Breach Alerts", "एसएलए उल्लंघन अलर्ट"), desc: t("Alert when a complaint you raised is nearing SLA breach", "आपके द्वारा दर्ज की गई शिकायत के एसएलए उल्लंघन के करीब होने पर अलर्ट") },
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
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" /> {t("Display Preferences", "प्रदर्शन प्राथमिकताएं")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-1.5 block">{t("Language", "भाषा")}</Label>
              <LangSelector triggerClassName={"w-full"}/>
            </div>
            <div>
              <Label className="mb-1.5 block">{t("Call Display Format", "कॉल प्रदर्शन प्रारूप")}</Label>
              <select className="w-full border border-input rounded-md p-2 text-sm bg-white">
                <option value="standard">{t("Standard (Caller ID + Name)", "मानक (कॉलर आईडी + नाम)")}</option>
                <option value="detailed">{t("Detailed (Caller ID + History)", "विस्तृत (कॉलर आईडी + इतिहास)")}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => showToast(t("Settings saved successfully", "सेटिंग्स सफलतापूर्वक सहेजी गईं"))}>
            <Save className="w-4 h-4 mr-1" /> {t("Save Settings", "सेटिंग्स सहेजें")}
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}