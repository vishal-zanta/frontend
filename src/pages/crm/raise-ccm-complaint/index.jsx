import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowLeft, Building2, Search } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";

import PortalLayout from "@/components/PortalLayout";
import RhfWrapper from "@/components/RhfWrapper";
import { Input } from "@/components/ui/input";

import { useLanguage } from "@/context/LanguageContext";

import { useRaiseComplaintData } from "./hooks";
import { defaultValues, grievanceSchema } from "./schema";
import { getFormData } from "./helpers";

import CitizenInfoSection from "./components/CitizenInfoSection";
import ClassificationSection from "./components/ClassificationSection";
import LocationDetailsSection from "./components/LocationDetailsSection";
import ImpactSection from "./components/ImpactSection";
import AddressSection from "./components/AddressSection";
import CommunicationSection from "./components/CommunicationSection";
import AttachmentsSection from "./components/AttachmentsSection";
import ButtonsFooter from "./components/ButtonsFooter";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import SuccessScreen from "./components/SuccessScreen";
import { postComplaint, postExternalComplaint } from "@/api/complaint.api";
import { QUERY_KEYS } from "@/utils/constants";
import useGetFileSize from "@/hooks/query/useGetFileSize";
import { departmentsList, getExternalDepartment } from "@/utils/departments";

export default function CRMRaiseComplaint() {
  const role = "crm";
  const { t, lang } = useLanguage();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState(() => {
    return searchParams.get("dept") || "";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [externalComplaintId, setExternalComplaintId] = useState(null);

  const {
    departmentOptions,
    departmentsLoading,
    grievanceNatureOptions,
    affectedBeneficiaryOptions,
    naturesLoading,
    allChannels,
    complaintSourcesLoading,
  } = useRaiseComplaintData(lang);

  const inmailState = location.state?.INITIAL_INMAILS;
  const initialInmailRef = useRef(inmailState);
  if (inmailState && !initialInmailRef.current) {
    initialInmailRef.current = inmailState;
  }
  const initialInmail = initialInmailRef.current || inmailState;

  // Sync state with URL params
  useEffect(() => {
    const deptParam = searchParams.get("dept");
    if (deptParam && deptParam !== selectedDept) {
      setSelectedDept(deptParam);
    } else if (!deptParam && selectedDept) {
      setSelectedDept("");
    }
  }, [searchParams]);

  const handleSelectDept = (key) => {
    setSelectedDept(key);
    setStep(1);
    setSearchParams(
      (params) => {
        if (key) {
          params.set("dept", key);
        } else {
          params.delete("dept");
        }
        return params;
      },
      {
        replace: true,
        state:
          location.state ||
          (initialInmail ? { INITIAL_INMAILS: initialInmail } : undefined),
      },
    );
  };

  // Combine internal and external departments for selection boxes
  const allDepartmentBoxes = useMemo(() => {
    const externalBoxes = departmentsList
      .filter((d) => !d.isHide)
      .map((d) => ({
        id: d.key,
        key: d.key,
        name: d.name,
        nameHindi: d.nameHindi || d.name,
        isExternal: true,
      }));

    const internalBoxes = (departmentOptions || []).map((d) => ({
      id: d.value,
      key: d.value,
      name: d.label,
      nameHindi: d.titleHindi || d.nameHindi || d.label,
      isExternal: false,
    }));

    return [...externalBoxes, ...internalBoxes];
  }, [departmentOptions]);

  const filteredDepartments = useMemo(() => {
    if (!searchQuery.trim()) return allDepartmentBoxes;
    const q = searchQuery.toLowerCase().trim();
    return allDepartmentBoxes.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.nameHindi?.toLowerCase().includes(q),
    );
  }, [allDepartmentBoxes, searchQuery]);

  // Check if selected department is external
  const selectedExternalDept = useMemo(() => {
    if (!selectedDept) return null;
    return getExternalDepartment(selectedDept);
  }, [selectedDept]);

  const selectedDepartmentItem = useMemo(() => {
    if (!selectedDept) return null;
    return (
      allDepartmentBoxes.find(
        (d) => d.key === selectedDept || d.id === selectedDept,
      ) || null
    );
  }, [selectedDept, allDepartmentBoxes]);

  const formInitialValues = useMemo(() => {
    let base = { ...defaultValues };

    if (allChannels) {
      const voiceChannel = allChannels.find((v) => v?.label === "Voice")?.value;
      if (voiceChannel) {
        base.channel = voiceChannel;
      }
    }

    if (!!initialInmail) {
      const email =
        initialInmail.fromEmail ||
        (typeof initialInmail.from === "string" &&
        initialInmail.from.includes("<")
          ? initialInmail.from.match(/<([^>]+)>/)?.[1]
          : initialInmail.from) ||
        initialInmail.email ||
        "";
      const fullName =
        initialInmail.fromName ||
        (typeof initialInmail.from === "string"
          ? initialInmail.from.split("<")[0].trim()
          : "");
      const emailBody =
        initialInmail.body ||
        initialInmail.content ||
        initialInmail.text ||
        initialInmail.html ||
        "";

      base = {
        ...base,
        channel:
          allChannels?.find((v) => v?.label === "Email")?.value || base.channel,
        citizenInfo: {
          ...base.citizenInfo,
          fullName: fullName || base.citizenInfo.fullName,
          email: email,
        },
        evidence: {
          ...base.evidence,
          details: emailBody,
        },
        emailId: initialInmail?.id,
      };
    }

    return {
      ...base,
      classification: {
        ...base.classification,
        department: selectedDept || "",
      },
    };
  }, [initialInmail, allChannels, selectedDept]);

  console.log({ formInitialValues });

  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [fileError, setFileError] = useState("");
  const { data, isLoading, error } = useGetFileSize();

  const grievanceMaxUploadSizeMB = data?.data?.grievanceMaxUploadSizeMB || 1;
  const MAX_FILE_SIZE = grievanceMaxUploadSizeMB * 1024 * 1024;

  const handleFileChange = (e) => {
    setFileError("");
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "audio/mpeg",
    ];

    const invalidTypeFile = files.find(
      (f) => !allowedMimeTypes.includes(f.type),
    );
    if (invalidTypeFile) {
      const errMsg = t(
        "Invalid file type. Only JPEG, PNG, WEBP, MP4, and MPEG files are allowed.",
        "अमान्य फ़ाइल प्रकार। केवल JPEG, PNG, WEBP, MP4 और MPEG फ़ाइलें ही स्वीकृत हैं।",
      );
      setFileError(errMsg);
      getErrorToast({ message: errMsg });
      return;
    }

    const oversized = files.find((f) => f.size > MAX_FILE_SIZE);
    if (oversized) {
      const errMsg = t(
        `File too large. Max ${grievanceMaxUploadSizeMB} MB.`,
        `फ़ाइल बहुत बड़ी है। अधिकतम ${grievanceMaxUploadSizeMB} MB।`,
      );
      setFileError(errMsg);
      getErrorToast({ message: errMsg });
      return;
    }

    setAttachments((prev) => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const [submitted, setSubmitted] = useState([false, null]);

  const postComplaintMutation = useMutation({
    mutationFn: postComplaint,
    onSuccess: (data) => {
      getSuccessToast("Complaint registered successfully");
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS_ALL] });
      console.log(data);
      setSubmitted([true, data]);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const postExternalComplaintMutation = useMutation({
    mutationFn: postExternalComplaint,
    onSuccess: (data) => {
      getSuccessToast(
        "Complaint registered successfully",
        data?.data?.data?.externalComplaintId,
      );
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.EXTERNAL_COMPLAINTS] });

      console.log(data);
      setExternalComplaintId(data?.data?.data?.externalComplaintId);
      setSubmitted([true, data]);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSubmit = (data) => {
    const formData = getFormData(data, attachments, {
      emailId: searchParams.get("inmail") || initialInmail?.id,
    });
    console.log("JSON DATA", data);
    console.log("Final FormData:", Object.fromEntries(formData));

    postComplaintMutation.mutate(formData);
  };

  if (submitted?.[0] || submitted === true) {
    return (
      <SuccessScreen
        role={role}
        t={t}
        externalComplaintId={externalComplaintId}
        data={Array.isArray(submitted) ? submitted[1] : null}
        grievanceNatureOptions={grievanceNatureOptions}
        onReset={() => {
          setSubmitted([false, null]);
          setExternalComplaintId(null);
          setAttachments([]);
          setFileError("");
          setSelectedDept("");
          setSearchParams((params) => {
            params.delete("dept");
            return params;
          });
        }}
      />
    );
  }

  // Department Selection Screen
  if (!selectedDept) {
    return (
      <PortalLayout role={role}>
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title={t("Back", "पीछे जाएं")}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {t("Register Complaint", "शिकायत दर्ज करें")}
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t(
                    "Currently, complaints can be registered for the following departments",
                    "वर्तमान में निम्न विभागों से संबंधित शिकायत दर्ज कर सकते है",
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="mb-6 relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("Search department...", "विभाग खोजें...")}
              className="pl-10 h-11 rounded-xl bg-card border-border shadow-xs"
            />
          </div>

          {/* Departments Grid Boxes */}
          {departmentsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/50">
              <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground font-medium">
                {t("No departments found", "कोई विभाग नहीं मिला")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredDepartments.map((dept) => {
                const label =
                  lang === "hi" && dept.nameHindi ? dept.nameHindi : dept.name;

                return (
                  <button
                    key={dept.key}
                    type="button"
                    onClick={() => handleSelectDept(dept.key)}
                    className="group relative flex flex-col justify-between p-4 rounded-2xl bg-card hover:bg-blue-50/60 dark:hover:bg-blue-950/30 border border-border hover:border-blue-500 dark:hover:border-blue-600 transition-all duration-200 shadow-xs hover:shadow-md text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {t(label, dept.nameHindi)}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </PortalLayout>
    );
  }

  // Selected Department Form Screen
  const selectedDeptTitle = selectedDepartmentItem
    ? lang === "hi" && selectedDepartmentItem.nameHindi
      ? selectedDepartmentItem.nameHindi
      : selectedDepartmentItem.name
    : selectedDept;

  return (
    <PortalLayout role={role}>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Page header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (selectedExternalDept) {
                  handleSelectDept("");
                } else if (step > 1) {
                  setStep((prev) => prev - 1);
                } else {
                  handleSelectDept("");
                }
              }}
              className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={t("Back", "पीछे जाएं")}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {t("Register Complaint", "शिकायत दर्ज करें")}
              </h1>
            </div>
          </div>

          {/* Current selected department badge & change action */}
          <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-3 py-1.5">
            <Building2 className="w-4 h-4 text-primary shrink-0" />
            <div className="text-xs">
              <span className="text-muted-foreground font-medium mr-1">
                {t("Department:", "विभाग:")}
              </span>
              <span className="font-semibold text-foreground">
                {selectedDeptTitle}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleSelectDept("")}
              className="ml-2 text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              {t("Change", "बदलें")}
            </button>
          </div>
        </div>

        {/* Render External Department Form or Internal 3-Step Wizard */}
        {selectedExternalDept?.component ? (
          <selectedExternalDept.component
            selectedDept={selectedExternalDept.key}
            onSuccess={(payload) =>
              postExternalComplaintMutation.mutate(payload)
            }
            isLoading={postExternalComplaintMutation.isPending}
          />
        ) : (
          <RhfWrapper
            key={selectedDept}
            initialValues={formInitialValues}
            isValidation
            validationSchema={grievanceSchema}
            validationOn="onChange"
            onSubmit={handleSubmit}
            className="!space-y-4 !sm:space-y-6"
          >
            <FormWizard
              t={t}
              lang={lang}
              departmentOptions={departmentOptions}
              departmentsLoading={departmentsLoading}
              grievanceNatureOptions={grievanceNatureOptions}
              naturesLoading={naturesLoading}
              affectedBeneficiaryOptions={affectedBeneficiaryOptions}
              fileInputRef={fileInputRef}
              attachments={attachments}
              fileError={fileError}
              handleFileChange={handleFileChange}
              removeAttachment={removeAttachment}
              postComplaintMutation={postComplaintMutation}
              allChannels={allChannels}
              complaintSourcesLoading={complaintSourcesLoading}
              grievanceMaxUploadSizeMB={grievanceMaxUploadSizeMB}
              step={step}
              setStep={setStep}
            />
          </RhfWrapper>
        )}
      </div>
    </PortalLayout>
  );
}

function FormWizard({
  t,
  lang,
  departmentOptions,
  departmentsLoading,
  grievanceNatureOptions,
  naturesLoading,
  affectedBeneficiaryOptions,
  fileInputRef,
  attachments,
  fileError,
  handleFileChange,
  removeAttachment,
  postComplaintMutation,
  allChannels,
  complaintSourcesLoading,
  grievanceMaxUploadSizeMB,
  step = 1,
  setStep,
}) {
  const methods = useFormContext();

  const steps = [
    {
      id: 1,
      label: t("Basic Info", "बुनियादी जानकारी"),
      description: t("Citizen details", "नागरिक का विवरण"),
    },
    {
      id: 2,
      label: t("Location", "स्थान"),
      description: t("Address details", "पता का विवरण"),
    },
    {
      id: 3,
      label: t("Complaint Details", "शिकायत विवरण"),
      description: t("Category & description", "श्रेणी और विवरण"),
    },
  ];

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await methods.trigger([
        "channel",
        "citizenInfo.fullName",
        "citizenInfo.mobile",
        "citizenInfo.alternateMobile",
        "citizenInfo.email",
        // "citizenInfo.preferredLanguage",
        "communication.feedbackConsent",
      ]);
    } else if (step === 2) {
      isValid = await methods.trigger([
        "citizenInfo.address.isUrban",
        "citizenInfo.address.addressLine",
        "citizenInfo.address.district",
        "citizenInfo.address.block",
        "citizenInfo.address.panchayat",
        "citizenInfo.address.village",
        "citizenInfo.address.thana",
        "citizenInfo.address.urbanPanchayat",
        "citizenInfo.address.ward",
        "citizenInfo.address.landmark",
        "citizenInfo.address.pincode",
        "address.isUrban",
        "address.state",
        "address.city",
        "address.addressLine",
        "address.addressLine2",
        "address.district",
        "address.block",
        "address.panchayat",
        "address.village",
        "address.thana",
        "address.urbanPanchayat",
        "address.ward",
        "address.landmark",
        "address.pincode",
      ]);
    }
    if (isValid) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stepper Header */}
      <div className="relative flex justify-between items-center max-w-3xl mx-auto mb-8 px-4">
        {/* Background Line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full -z-10">
          {/* Progress Line */}
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((s) => {
          const isActive = step === s.id;
          const isCompleted = step > s.id;
          return (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-md border-2 border-emerald-500"
                    : isActive
                      ? "bg-blue-600 text-white shadow-lg ring-4 ring-primary/20 border-2 border-blue-600"
                      : "bg-muted text-muted-foreground border-2 border-border"
                }`}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  s.id
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                        ? "text-emerald-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className=" ">
        {step === 1 && (
          <div className="space-y-6">
            <CitizenInfoSection
              t={t}
              allChannels={allChannels}
              complaintSourcesLoading={complaintSourcesLoading}
            />
            <CommunicationSection t={t} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <AddressSection t={t} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <ClassificationSection
              departmentOptions={departmentOptions}
              departmentsLoading={departmentsLoading}
              grievanceNatureOptions={grievanceNatureOptions}
              naturesLoading={naturesLoading}
              t={t}
              lang={lang}
              isDepartmentFixed={true}
            />
            <LocationDetailsSection t={t} />
            <ImpactSection
              affectedBeneficiaryOptions={affectedBeneficiaryOptions}
              t={t}
            />
            <AttachmentsSection
              fileInputRef={fileInputRef}
              attachments={attachments}
              fileError={fileError}
              handleFileChange={handleFileChange}
              removeAttachment={removeAttachment}
              t={t}
              grievanceMaxUploadSizeMB={grievanceMaxUploadSizeMB}
            />
          </div>
        )}
      </div>

      {/* Buttons Footer */}
      <ButtonsFooter
        step={step}
        handleBack={handleBack}
        handleNext={handleNext}
        isSubmitting={postComplaintMutation.isPending}
        t={t}
      />
    </div>
  );
}
