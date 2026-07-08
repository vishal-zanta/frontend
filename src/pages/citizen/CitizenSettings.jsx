import React, { useState, useEffect } from "react";
import { User, LogOut, Type, Contrast, Globe, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PortalLayout from "@/components/PortalLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";

export default function CitizenSettings() {
  const { t, lang, setLang } = useLanguage();
  const [profile, setProfile] = useState({ name: "Ramesh Prasad", mobile: "+91 98350 11234", email: "ramesh@example.com" });
  const [fontScale, setFontScale] = useState("1");
  const [highContrast, setHighContrast] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bucgp_profile") || "null");
      if (saved) setProfile(saved);
      setFontScale(localStorage.getItem("bucgp_font_scale") || "1");
      setHighContrast(localStorage.getItem("bucgp_high_contrast") === "true");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", fontScale);
    try { localStorage.setItem("bucgp_font_scale", fontScale); } catch {}
  }, [fontScale]);

  useEffect(() => {
    document.body.classList.toggle("high-contrast", highContrast);
    try { localStorage.setItem("bucgp_high_contrast", String(highContrast)); } catch {}
  }, [highContrast]);

  const saveProfile = () => {
    try { localStorage.setItem("bucgp_profile", JSON.stringify(profile)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = async () => {
    try { await base44.auth.logout("/"); } catch { window.location.href = "/"; }
  };

  return (
    <PortalLayout role="citizen">
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("Settings", "सेटिंग्स")}</h1>
          <p className="text-sm text-muted-foreground">{t("Manage your profile, accessibility, and preferences.", "अपनी प्रोफ़ाइल, पहुंच और प्राथमिकताएँ प्रबंधित करें।")}</p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" /> {t("Profile", "प्रोफ़ाइल")}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="mb-1.5 block">{t("Full Name", "पूरा नाम")}</Label>
              <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1.5 block">{t("Mobile", "मोबाइल")}</Label>
              <Input value={profile.mobile} onChange={e => setProfile({ ...profile, mobile: e.target.value })} />
            </div>
            <div>
              <Label className="mb-1.5 block">{t("Email", "ईमेल")}</Label>
              <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <Button onClick={saveProfile} className="bg-primary">
              <Save className="w-4 h-4 mr-1" /> {saved ? t("Saved!", "सहेजा गया!") : t("Save Profile", "प्रोफ़ाइल सहेजें")}
            </Button>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Type className="w-4 h-4" /> {t("Accessibility", "पहुंच")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2 block">{t("Font Size", "फ़ॉन्ट आकार")}</Label>
              <div className="flex gap-2">
                {[{ v: "1", label: t("Normal", "सामान्य") }, { v: "1.15", label: t("Large", "बड़ा") }, { v: "1.3", label: t("Extra Large", "बहुत बड़ा") }].map(opt => (
                  <button key={opt.v} onClick={() => setFontScale(opt.v)} className={`px-4 py-2 rounded-lg text-sm border transition-colors ${fontScale === opt.v ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2"><Contrast className="w-4 h-4" /> {t("High Contrast Mode", "उच्च कंट्रास्ट मोड")}</Label>
                <p className="text-xs text-muted-foreground mt-0.5">{t("Increases visual contrast for better readability", "बेहतर पठनीयता के लिए दृश्य कंट्रास्ट बढ़ाता है")}</p>
              </div>
              <button onClick={() => setHighContrast(!highContrast)} className={`w-12 h-6 rounded-full transition-colors ${highContrast ? "bg-primary" : "bg-muted"}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${highContrast ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Globe className="w-4 h-4" /> {t("Language / भाषा", "भाषा")}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <button onClick={() => setLang("en")} className={`px-4 py-2 rounded-lg text-sm border transition-colors ${lang === "en" ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}>English</button>
              <button onClick={() => setLang("hi")} className={`px-4 py-2 rounded-lg text-sm border transition-colors ${lang === "hi" ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}>हिन्दी</button>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="pt-6">
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="w-4 h-4 mr-1" /> {t("Logout", "लॉग आउट")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}