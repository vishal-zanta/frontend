import React, { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import PortalLayout from "@/components/PortalLayout";
import RhfWrapper from "@/components/RhfWrapper";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

import { useRaiseComplaintData } from "./hooks";
import { defaultValues, grievanceSchema } from "./schema";
import { getFormData } from "./helpers";

import CitizenInfoSection from "./components/CitizenInfoSection";
import ClassificationSection from "./components/ClassificationSection";
import EvidenceSection from "./components/EvidenceSection";
import ImpactSection from "./components/ImpactSection";
import AddressSection from "./components/AddressSection";
import CommunicationSection from "./components/CommunicationSection";
import AttachmentsSection from "./components/AttachmentsSection";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import SuccessScreen from "./components/SuccessScreen";
import { postComplaint } from "@/api/complaint.api";
import { QUERY_KEYS } from "@/utils/constants";
import LangSelector from "@/components/LangSelector";

export default function CRMRaiseComplaint() {
  const role = "crm";
  const { t, lang, setLang } = useLanguage();
  const qc = useQueryClient();

  const {
    servicesOptions,
    grievanceNatureOptions,
    frequencyOptions,
    affectedBeneficiaryOptions,
    servicesLoading,
    naturesLoading,
    allChannels,
    complaintSourcesLoading,
    allDemography,
    demographyLoading,
  } = useRaiseComplaintData(lang);

  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [fileError, setFileError] = useState("");

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

    const oversized = files.find((f) => f.size > 10 * 1024 * 1024);
    if (oversized) {
      const errMsg = t(
        "File too large. Max 10 MB.",
        "फ़ाइल बहुत बड़ी है। अधिकतम 10 MB।",
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

  const [submitted, setSubmitted] = useState(false);

  const postComplaintMutation = useMutation({
    mutationFn: postComplaint,
    onSuccess: (data) => {
      getSuccessToast("Complaint registered successfully");
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS_OFFICER] });
      qc.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS_ALL] });
      console.log(data);
      setSubmitted(true);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleSubmit = (data) => {
    const formData = getFormData(data, attachments);
    console.log("Final FormData:", Object.fromEntries(formData));
    postComplaintMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <SuccessScreen
        role={role}
        t={t}
        onReset={() => {
          setSubmitted(false);
          setAttachments([]);
          setFileError("");
        }}
      />
    );
  }

  return (
    <PortalLayout role={role}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("Register Grievance", "शिकायत दर्ज करें")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t(
                "Fields marked * are required.",
                "* चिह्नित फ़ील्ड अनिवार्य हैं।",
              )}
            </p>
          </div>

          <LangSelector/>
        </div>

        <RhfWrapper
          initialValues={defaultValues}
          isValidation
          validationSchema={grievanceSchema}
          validationOn="onChange"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <FormWizard
            t={t}
            lang={lang}
            servicesOptions={servicesOptions}
            grievanceNatureOptions={grievanceNatureOptions}
            servicesLoading={servicesLoading}
            naturesLoading={naturesLoading}
            frequencyOptions={frequencyOptions}
            affectedBeneficiaryOptions={affectedBeneficiaryOptions}
            fileInputRef={fileInputRef}
            attachments={attachments}
            fileError={fileError}
            handleFileChange={handleFileChange}
            removeAttachment={removeAttachment}
            postComplaintMutation={postComplaintMutation}
            allChannels={allChannels}
            complaintSourcesLoading={complaintSourcesLoading}
            allDemography={allDemography}
            demographyLoading={demographyLoading}
          />
        </RhfWrapper>
      </div>
    </PortalLayout>
  );
}

function FormWizard({
  t,
  lang,
  servicesOptions,
  grievanceNatureOptions,
  servicesLoading,
  naturesLoading,
  frequencyOptions,
  affectedBeneficiaryOptions,
  fileInputRef,
  attachments,
  fileError,
  handleFileChange,
  removeAttachment,
  postComplaintMutation,
  allChannels,
  complaintSourcesLoading,
  allDemography,
  demographyLoading,
}) {
  const { trigger } = useFormContext();
  const [step, setStep] = useState(1);

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
      isValid = await trigger([
        "channel",
        "citizenInfo.fullName",
        "citizenInfo.mobile",
        "citizenInfo.alternateMobile",
        "citizenInfo.email",
        "citizenInfo.preferredLanguage",
        "communication.feedbackConsent",
        "communication.satisfactionSurveyConsent",
      ]);
    } else if (step === 2) {
      isValid = await trigger([
        "address.state",
        "address.district",
        "address.subdivision",
        "address.villageOrWard",
        "address.pinCode",
        "address.landmark",
      ]);
    }
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
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
                <p className="text-[10px] text-muted-foreground hidden sm:block">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-card border border-border shadow-sm rounded-xl p-6 transition-all duration-300">
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
            <AddressSection
              t={t}
              allDemography={allDemography}
              demographyLoading={demographyLoading}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <ClassificationSection
              servicesOptions={servicesOptions}
              grievanceNatureOptions={grievanceNatureOptions}
              servicesLoading={servicesLoading}
              naturesLoading={naturesLoading}
              t={t}
              lang={lang}
            />
            <EvidenceSection frequencyOptions={frequencyOptions} t={t} />
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
            />
          </div>
        )}
      </div>

      {/* Buttons Footer */}
      <div className="flex justify-center gap-4 items-center mt-6 pt-4 border-t border-border">
        <div>
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="hover:bg-muted font-medium transition-all"
            >
              &larr; {t("Back", "पीछे")}
            </Button>
          )}
        </div>

        <div>
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium min-w-[120px] transition-all h-9 px-4 py-2 rounded-lg flex items-center justify-center"
            >
              {t("Next", "आगे")} &rarr;
            </button>
          ) : (
            <Button
              type="submit"
              disabled={postComplaintMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium min-w-[180px] transition-all "
            >
              {postComplaintMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("Submitting...", "जमा हो रहा है...")}
                </span>
              ) : (
                t("Submit Grievance", "शिकायत जमा करें")
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
