import React, { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

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
import { useLanguage } from "@/hooks/useLanguage";

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

export default function CRMRaiseComplaint() {
  const role = "crm";
  const { t, lang, setLang } = useLanguage();
  const qc = useQueryClient();

  const {
    subServiceOptions,
    grievanceNatureOptions,
    frequencyOptions,
    affectedBeneficiaryOptions,
    subServicesLoading,
    naturesLoading,
  } = useRaiseComplaintData(lang);

  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
    setFileError("");
    const files = Array.from(e.target.files ?? []);
    const oversized = files.find((f) => f.size > 10 * 1024 * 1024);
    if (oversized) {
      setFileError(t("File too large. Max 10 MB.", "फ़ाइल बहुत बड़ी है। अधिकतम 10 MB।"));
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

          <Select value={lang} onValueChange={(v) => setLang(v)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <RhfWrapper
          initialValues={defaultValues}
          isValidation
          validationSchema={grievanceSchema}
          validationOn="onChange"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <CitizenInfoSection t={t} />

          <ClassificationSection
            subServiceOptions={subServiceOptions}
            grievanceNatureOptions={grievanceNatureOptions}
            subServicesLoading={subServicesLoading}
            naturesLoading={naturesLoading}
            t={t}
          />

          <EvidenceSection frequencyOptions={frequencyOptions} t={t} />

          <ImpactSection affectedBeneficiaryOptions={affectedBeneficiaryOptions} t={t} />

          <AddressSection t={t} />

          <CommunicationSection t={t} />

          <AttachmentsSection
            fileInputRef={fileInputRef}
            attachments={attachments}
            fileError={fileError}
            handleFileChange={handleFileChange}
            removeAttachment={removeAttachment}
            t={t}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={postComplaintMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 min-w-[180px]"
            >
              {postComplaintMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("Submitting...", "जमा हो रहा है...")}
                </>
              ) : (
                t("Submit Grievance", "शिकायत जमा करें")
              )}
            </Button>
          </div>
        </RhfWrapper>
      </div>
    </PortalLayout>
  );
}