import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  MapPin,
  FileText,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Map as MapIcon,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import { SERVICES, DISTRICTS, ULBS } from "@/lib/biharData";
import { addStoredComplaint } from "@/lib/complaintStore";
import { base44 } from "@/api/base44Client";
import PortalLayout from "@/components/PortalLayout";
import ComplaintMap from "@/components/ComplaintMap";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/hooks/useLanguage";

export default function RaiseComplaint({ role = "citizen" }) {
  const navigate = useNavigate();
  const { t, lang, setLang } = useLanguage();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaintId, setSubmittedComplaintId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    category: "Individual",
    district: "",
    ulb: "",
    ward: "",
    landmark: "",
    address: "",
    service: "",
    subservice: "",
    description: "",
  });
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const filteredULBs = ULBS.filter(
    (u) => !form.district || u.district === form.district,
  );

  const handleDistrictChange = (val) => {
    const dist = DISTRICTS.find((d) => d.id === val);
    const ulb = ULBS.find((u) => u.district === val);
    update("district", val);
    update("ulb", ulb?.id || "");
    update(
      "ward",
      ulb
        ? `${ulb.name.split(" ")[0]} Ward-${Math.floor(Math.random() * ulb.wards) + 1}`
        : "",
    );
    update("address", dist ? `${dist.name}, Bihar` : "");
  };

  const selectedService = SERVICES.find((s) => s.id === form.service);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(
        t(
          "File too large. Maximum size is 10MB.",
          "फ़ाइल बहुत बड़ी है। अधिकतम आकार 10MB है।",
        ),
      );
      return;
    }
    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setPhotoUrl(result.file_url);
      setPhotoName(file.name);
    } catch {
      // Fallback: local preview
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result);
        setPhotoName(file.name);
      };
      reader.readAsDataURL(file);
    }
    setUploading(false);
  };

  const removePhoto = () => {
    setPhotoUrl(null);
    setPhotoName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const complaintId = `BH-2026-${Math.floor(100000 + Math.random() * 899999)}`;
      const slaHours =
        selectedService?.subservices.find((s) => s.id === form.subservice)
          ?.slaHours || 24;
      const dist = DISTRICTS.find((d) => d.id === form.district);
      const ulb = ULBS.find((u) => u.id === form.ulb);
      const subservice = selectedService?.subservices.find(
        (s) => s.id === form.subservice,
      );

      const newComplaint = {
        id: complaintId,
        citizenName: form.name,
        mobile: form.mobile,
        address: form.address,
        district: form.district,
        districtName: dist?.name || "",
        ulb: form.ulb,
        ulbName: ulb?.name || "",
        ward: form.ward,
        landmark: form.landmark,
        service: form.service,
        serviceName: selectedService?.name || "",
        subservice: form.subservice,
        subserviceName: subservice?.name || "",
        description: form.description,
        priority: "Normal",
        status: "Pending",
        source: role === "crm" ? "call" : "app",
        createdDate: new Date().toISOString(),
        slaHours,
        resolvedDate: null,
        l1Officer: null,
        l1OfficerName: null,
        photoUrl: photoUrl || null,
        timeline: [
          {
            type: "Complaint Filed",
            actor: role === "crm" ? "CRM Agent" : "Citizen",
            timestamp: new Date().toISOString(),
            icon: "FilePlus2",
            notes: `Filed via ${role === "crm" ? "CRM Portal" : "Citizen Portal"}`,
          },
        ],
      };

      addStoredComplaint(newComplaint);
      setSubmittedComplaintId(complaintId);
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    const complaintId = submittedComplaintId;
    const slaDays =
      selectedService?.subservices.find((s) => s.id === form.subservice)
        ?.slaHours || 24;
    const expectedDays = Math.ceil(slaDays / 24);
    return (
      <PortalLayout role={role}>
        <div className="p-6 flex items-center justify-center min-h-[80vh]">
          <div className="max-w-lg w-full bg-white rounded-2xl border border-border shadow-xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {t(
                "Complaint Registered Successfully!",
                "शिकायत सफलतापूर्वक दर्ज हुई!",
              )}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {t(
                "Your complaint has been submitted and auto-routed to the assigned officer.",
                "आपकी शिकायत दर्ज कर दी गई है और नियुक्त अधिकारी को भेज दी गई है।",
              )}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
              <div className="text-xs text-muted-foreground mb-1">
                {t("Your Complaint ID", "आपकी शिकायत आईडी")}
              </div>
              <div className="text-3xl font-bold text-blue-700 font-mono">
                {complaintId}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">
                  {t("Expected Resolution", "अपेक्षित समाधान")}
                </div>
                <div className="text-lg font-bold text-foreground">
                  {expectedDays} {t("day(s)", "दिन")}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">
                  {t("SLA Hours", "SLA घंटे")}
                </div>
                <div className="text-lg font-bold text-foreground">
                  {slaDays} hrs
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mb-6">
              💡{" "}
              {t(
                "Save your Complaint ID. You'll need it to track your complaint status.",
                "अपनी शिकायत आईडी सहेजें। अपनी शिकायत की स्थिति ट्रैक करने के लिए आपको इसकी आवश्यकता होगी।",
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setForm({
                    name: "",
                    mobile: "",
                    email: "",
                    category: "Individual",
                    district: "",
                    ulb: "",
                    ward: "",
                    landmark: "",
                    address: "",
                    service: "",
                    subservice: "",
                    description: "",
                  });
                  setPhotoUrl(null);
                  setPhotoName("");
                  setSubmittedComplaintId(null);
                }}
                variant="outline"
                className="flex-1"
              >
                {t("File Another", "एक और दर्ज करें")}
              </Button>
              <Button
                onClick={() =>
                  navigate(
                    role === "crm"
                      ? "/crm"
                      : `/citizen/track?id=${complaintId}`,
                  )
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {t("Track Complaint", "शिकायत ट्रैक करें")}
              </Button>
            </div>
          </div>
        </div>
      </PortalLayout>
    );
  }

  const steps = [
    { num: 1, label: t("Basic Info", "बुनियादी जानकारी"), icon: User },
    { num: 2, label: t("Location", "स्थान"), icon: MapPin },
    { num: 3, label: t("Complaint Details", "शिकायत विवरण"), icon: FileText },
  ];

  return (
    <PortalLayout role={role}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("Register New Complaint", "शिकायत दर्ज करें")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "Fill in the details below. Fields marked * are required.",
                "नीचे विवरण भरें। * चिह्नित फ़ील्ड अनिवार्य हैं।",
              )}
            </p>
          </div>
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <React.Fragment key={!s.num}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-blue-600 text-white ring-4 ring-blue-100"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${isActive ? "text-blue-600" : "text-muted-foreground"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 -mt-6 ${step > s.num ? "bg-emerald-500" : "bg-border"}`}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground mb-2">
                {t("Step 1: Basic Information", "चरण 1: बुनियादी जानकारी")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">
                    {t("Full Name", "पूरा नाम")} <span className="text-red-500">*</span></Label>
                  <Input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder={t("Enter your name", "अपना नाम दर्ज करें")}
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">
                    {t("Phone Number", "फोन नंबर")} <span className="text-red-500">*</span></Label>
                  <Input
                    value={form.mobile}
                    onChange={(e) => update("mobile", e.target.value)}
                    placeholder={t(
                      "10-digit mobile number",
                      "10 अंकों का मोबाइल नंबर",
                    )}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1.5 block">
                    {t("Email (optional)", "ईमेल (वैकल्पिक)")}
                  </Label>
                  <Input
                    value={form.email || ""}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
                ℹ️{" "}
                {t(
                  "Your contact details will be used to send SMS updates about your complaint status.",
                  "आपके संपर्क विवरण का उपयोग आपकी शिकायत की स्थिति के बारे में SMS अपडेट भेजने के लिए किया जाएगा।",
                )}
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {t("Next: Location", "अगला: स्थान")}{" "}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground mb-2">
                {t("Step 2: Location Details", "चरण 2: स्थान विवरण")}
              </h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700 flex items-center gap-2">
                <MapIcon className="w-4 h-4 shrink-0" />
                {t(
                  "Select your district - ward & ULB auto-fill from KML master data.",
                  "अपना ज़िला चुनें - वार्ड और ULB KML मास्टर डेटा से स्वतः भर जाएंगे।",
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">
                    {t("District", "ज़िला")} <span className="text-red-500">*</span></Label>
                  <Select
                    value={form.district}
                    onValueChange={handleDistrictChange}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("Select district", "ज़िला चुनें")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRICTS.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">
                    {t("ULB (Urban Local Body)", "ULB (नगरीय निकाय)")} <span className="text-red-500">*</span></Label>
                  <Select
                    value={form.ulb}
                    onValueChange={(v) => update("ulb", v)}
                    disabled={!form.district}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("Auto-filled", "स्वतः भरा गया")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredULBs.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">
                    {t("Ward Number", "वार्ड नंबर")} <span className="text-red-500">*</span></Label>
                  <Input
                    value={form.ward}
                    onChange={(e) => update("ward", e.target.value)}
                    placeholder={t(
                      "Auto-filled from district",
                      "ज़िला से स्वतः भरा गया",
                    )}
                  />
                  {form.ward && (
                    <span className="text-[11px] text-emerald-600 mt-1 block">
                      ✓{" "}
                      {t(
                        "Auto-filled from KML master data",
                        "KML मास्टर डेटा से स्वतः भरा गया",
                      )}
                    </span>
                  )}
                </div>
                <div>
                  <Label className="mb-1.5 block">
                    {t("Landmark", "स्थान चिह्न")}
                  </Label>
                  <Input
                    value={form.landmark}
                    onChange={(e) => update("landmark", e.target.value)}
                    placeholder={t("Near...", "पास में...")}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1.5 block">
                    {t("Full Address", "पूरा पता")}
                  </Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder={t(
                      "House no, Street, Area...",
                      "मकान नंबर, गली, क्षेत्र...",
                    )}
                    rows={2}
                  />
                </div>
              </div>
              {form.district && (
                <div>
                  <Label className="mb-2 block">
                    {t("Ward Boundary Map", "वार्ड सीमा मानचित्र")}
                  </Label>
                  <ComplaintMap
                    height={250}
                    showHotspots={false}
                    highlightWard={true}
                    center={[25.61, 85.13]}
                    zoom={13}
                  />
                </div>
              )}
              <div className="flex justify-between pt-2">
                <Button onClick={() => setStep(1)} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-1" /> {t("Back", "वापस")}
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {t("Next: Complaint Details", "अगला: शिकायत विवरण")}{" "}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Complaint Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground mb-2">
                {t("Step 3: Complaint Details", "चरण 3: शिकायत विवरण")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-1.5 block">
                    {t("Service Category", "सेवा श्रेणी")} <span className="text-red-500">*</span></Label>
                  <Select
                    value={form.service}
                    onValueChange={(v) => {
                      update("service", v);
                      update("subservice", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("Select service", "सेवा चुनें")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">
                    {t("Sub-Service", "उप-सेवा")} <span className="text-red-500">*</span></Label>
                  <Select
                    value={form.subservice}
                    onValueChange={(v) => update("subservice", v)}
                    disabled={!form.service}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("Select sub-service", "उप-सेवा चुनें")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedService?.subservices.map((ss) => (
                        <SelectItem key={ss.id} value={ss.id}>
                          {ss.name}{" "}
                          <span className="text-muted-foreground ml-1">
                            ({ss.slaHours}h SLA)
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {form.subservice && selectedService && (
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 flex items-center gap-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      {t("SLA Time", "SLA समय")}:{" "}
                    </span>
                    <span className="font-semibold text-blue-700">
                      {
                        selectedService.subservices.find(
                          (s) => s.id === form.subservice,
                        )?.slaHours
                      }{" "}
                      {t("hours", "घंटे")}
                    </span>
                    <span className="text-muted-foreground ml-3">
                      {t("Dept", "विभाग")}:{" "}
                    </span>
                    <span className="font-semibold text-blue-700">
                      {selectedService.dept}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <Label className="mb-1.5 block">
                  {t("Description", "विवरण")} <span className="text-red-500">*</span></Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder={t(
                    "Describe your complaint in detail...",
                    "अपनी शिकायत का विस्तार से वर्णन करें...",
                  )}
                  rows={4}
                />
              </div>

              {/* File Upload */}
              <div>
                <Label className="mb-1.5 block">
                  {t(
                    "Upload Photo / Supporting Document",
                    "फोटो / सहायक दस्तावेज़ अपलोड करें",
                  )}
                </Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />
                {photoUrl ? (
                  <div className="border border-border rounded-lg p-4 flex items-center gap-4">
                    {photoUrl.startsWith("data:image") ||
                    photoUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={photoUrl}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {photoName}
                      </p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        ✓{" "}
                        {t(
                          "Uploaded successfully",
                          "सफलतापूर्वक अपलोड किया गया",
                        )}
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-blue-600 hover:underline mt-1"
                      >
                        {t("Change file", "फ़ाइल बदलें")}
                      </button>
                    </div>
                    <button
                      onClick={removePhoto}
                      className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : uploading ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Loader2 className="w-10 h-10 text-blue-500 mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      {t("Uploading...", "अपलोड हो रहा है...")}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="block w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <Camera className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {t(
                        "Click to upload or drag & drop",
                        "अपलोड करने के लिए क्लिक करें या खींचें और छोड़ें",
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {t(
                        "PNG, JPG, PDF up to 10MB",
                        "PNG, JPG, PDF अधिकतम 10MB",
                      )}
                    </p>
                  </button>
                )}
                {uploadError && (
                  <p className="text-xs text-destructive mt-1">{uploadError}</p>
                )}
              </div>

              {form.service && form.subservice && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  📍{" "}
                  {t(
                    "Geo-tagging will be captured automatically. Field visit",
                    "जियो-टैगिंग स्वतः कैप्चर की जाएगी। फील्ड विज़िट",
                  )}{" "}
                  {selectedService?.subservices.find(
                    (s) => s.id === form.subservice,
                  )?.fieldVisit
                    ? t("required", "आवश्यक")
                    : t("not required", "आवश्यक नहीं")}{" "}
                  {t("for this complaint type.", "इस शिकायत प्रकार के लिए।")}
                </div>
              )}

              <div className="flex justify-between pt-2">
                <Button onClick={() => setStep(2)} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-1" /> {t("Back", "वापस")}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !form.service ||
                    !form.subservice ||
                    !form.description ||
                    !form.name ||
                    !form.mobile ||
                    submitting
                  }
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      {t("Submitting...", "जमा हो रहा है...")}
                    </>
                  ) : (
                    <>
                      {t("Submit Complaint", "शिकायत जमा करें")}{" "}
                      <CheckCircle2 className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
