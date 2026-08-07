import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Building2, CheckCircle2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import PortalLayout from "@/components/PortalLayout";
import RhfWrapper from "@/components/RhfWrapper";

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
import ButtonsFooter from "./components/ButtonsFooter";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";
import SuccessScreen from "./components/SuccessScreen";
import { postComplaint } from "@/api/complaint.api";
import { QUERY_KEYS } from "@/utils/constants";
import useGetFileSize from "@/hooks/query/useGetFileSize";
import { SectionTitle } from "@/components/ChartCard";
import { useSearchParams } from "react-router-dom";
import Department104Form from "./department-forms/Department-104";
import {departmentsList} from "@/utils/departments";

// let departmentsList = [
//   {
//     id: 1,
//     name: "CM Helpline",
//     key: "cm-helpline",
//     component: null,
//   },
//   {
//     id: 2,
//     name: "Department 104",
//     key: "department-104",
//     component: Department104Form,
//   },
// ];

import MySelect from "@/components/inputs/MySelect";

export default function CRMRaiseComplaint() {
  const role = "crm";
  const { t, lang, setLang } = useLanguage();
  const qc = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dept, setDept] = useState(() => {
    const searchDept = searchParams.get("dept");
    return searchDept
      ? departmentsList.find((item) => item?.key === searchDept)?.key || ""
      : "";
  });

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
    console.log("JSON DATA", data);
    console.log("Final FormData:", Object.fromEntries(formData));

    postComplaintMutation.mutate(formData);
  };

  const handleDepartmentFormSubmit = useCallback((formData)=> {
formData.append("departmentId", dept);
console.log("Department formData", formData);
    // postComplaintMutation.mutate(formData);

  }, [postComplaintMutation, dept])

  useEffect(() => {
    const searchDept = searchParams?.get("dept");
    if (searchDept) {
      const found = departmentsList.find((item) => item?.key === searchDept);
      if (found && found.key !== dept) {
        setDept(found.key);
      }
    } else if (!searchDept && dept !== "") {
      setDept("");
    }
  }, [searchParams]);

  const SelectedDept = useMemo(() => {
    if (!dept) return null;
    return departmentsList.find((d) => d.key === dept) || null;
  }, [dept]);

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
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <SectionTitle
          title={t("Register Grievance", "शिकायत दर्ज करें")}
          subtitle={t(
            "Fields marked * are required.",
            "* चिह्नित फ़ील्ड अनिवार्य हैं।",
          )}
          className="!mb-4 !sm:mb-6"
        />

        <DepartmentSelect
          list={departmentsList}
          selectedKey={typeof dept === "string" ? dept : dept?.key}
          onSelect={(key) => {
            if (key) {
              setSearchParams({ dept: key }, { replace: true });
            } else {
              setSearchParams({}, { replace: true });
            }
            setDept(key || "");
          }}
          t={t}
        />

        {!SelectedDept ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-border bg-card/60 shadow-sm my-6">
            <div className="p-4 rounded-full bg-primary/10 text-primary mb-3">
              <Building2 className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {t("No Department Selected", "कोई विभाग नहीं चुना गया")}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {t(
                "Please select a department from the dropdown above to proceed with registering a complaint.",
                "शिकायत दर्ज करने के लिए कृपया ऊपर दिए गए ड्रॉपडाउन से एक विभाग चुनें।"
              )}
            </p>
          </div>
        ) : SelectedDept?.component ? (
          <SelectedDept.component onSuccess={handleDepartmentFormSubmit}/>
        ) : (
          <RhfWrapper
            initialValues={defaultValues}
            isValidation
            validationSchema={grievanceSchema}
            validationOn="onChange"
            onSubmit={handleSubmit}
            className="!space-y-4 !sm:space-y-6"
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
              grievanceMaxUploadSizeMB={grievanceMaxUploadSizeMB}
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
  grievanceMaxUploadSizeMB,
}) {
  const methods = useFormContext();
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
      isValid = await methods.trigger([
        "channel",
        "citizenInfo.fullName",
        "citizenInfo.mobile",
        "citizenInfo.alternateMobile",
        "citizenInfo.email",
        "citizenInfo.preferredLanguage",
        "communication.feedbackConsent",
      ]);
    } else if (step === 2) {
      isValid = await methods.trigger([
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

function DepartmentSelect({ list = [], selectedKey, onSelect, t }) {
  const options = list.map((item) => ({
    label: item.name,
    value: item.key ?? item.id,
  }));

  return (
    <div className="mb-6 max-w-md">
      <MySelect
        label={t ? t("Select Department", "विभाग चुनें") : "Select Department"}
        placeholder={t ? t("Choose a department...", "विभाग चुनें...") : "Choose a department..."}
        options={options}
        value={selectedKey || ""}
        onValueChange={(val) => onSelect?.(val)}
        nonClearable
      />
    </div>
  );
}
