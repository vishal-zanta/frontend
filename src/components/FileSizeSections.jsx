import React, { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS, QUERY_KEYS } from '@/utils/constants';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetFileSize from "@/hooks/query/useGetFileSize";
import instance from "@/lib/axios";
import LoaderErrWrapper from "@/components/LoaderErrWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getErrorToast, getSuccessToast, isValidNumber } from "@/utils/helpers";
import { Save, FileUp, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const FileSizeSections = () => {
  const { t } = useLanguage();
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGetFileSize();

  // Log data of useQuery as requested
  console.log("Config Query Data in FileSizeSections:", data?.data);

  const defaultMaxUploadSizeMB = data?.data?.defaultMaxUploadSizeMB || 10;

  const [grievanceSize, setGrievanceSize] = useState("");
  const [fieldVisitSize, setFieldVisitSize] = useState("");
  const [chatSize, setChatSize] = useState("");
  const [slaWarningPercentage, setSlaWarningPercentage] = useState("");

  useEffect(() => {
    if (data) {
      const configObj = data?.data;
      setGrievanceSize(configObj?.grievanceMaxUploadSizeMB ?? "");
      setFieldVisitSize(configObj?.fieldVisitMaxUploadSizeMB ?? "");
      setChatSize(configObj?.chatMaxUploadSizeMB ?? "");
      setSlaWarningPercentage(configObj?.slaWarningPercentage ?? "");
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      return instance.put("/config", payload).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONFIG] });
      getSuccessToast("Configuration updated successfully!");
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  if (!hasPermission(PERMISSIONS.FILE_MANAGEMENT)) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      grievanceMaxUploadSizeMB: Number(grievanceSize),
      fieldVisitMaxUploadSizeMB: Number(fieldVisitSize),
      chatMaxUploadSizeMB: Number(chatSize),
      slaWarningPercentage: Number(slaWarningPercentage),
    });
  };

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-border p-6 w-full space-y-6">
      <LoaderErrWrapper isLoading={isLoading} error={error}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: File Size Limits */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <FileUp className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-bold text-foreground">{t("File Size Limits", "फ़ाइल आकार सीमाएँ")}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t(`Configure individual upload limits across different modules (Max ${defaultMaxUploadSizeMB} MB per input)`, `विभिन्न मॉड्यूल में अलग-अलग अपलोड सीमाएँ कॉन्फ़िगर करें (अधिकतम ${defaultMaxUploadSizeMB} MB प्रति इनपुट)`)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="grievanceSize">{t("Citizen Attachment Max Upload Size (MB)", "नागरिक अनुलग्नक अधिकतम अपलोड आकार (MB)")} <span className="text-red-500">*</span></Label>
                <Input
                  id="grievanceSize"
                  type="text"
                  required
                  value={grievanceSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isValidNumber(val, 1, defaultMaxUploadSizeMB || 10)) {
                      setGrievanceSize(val);
                    } else {
                      getErrorToast(`Allowed size between 1 to ${defaultMaxUploadSizeMB} MB`);
                    }
                  }}
                  placeholder={`e.g. ${defaultMaxUploadSizeMB}`}
                  className="bg-white dark:bg-zinc-950 text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="fieldVisitSize">{t("Field Visit Max Upload Size (MB)", "क्षेत्र दौरे का अधिकतम अपलोड आकार (MB)")} <span className="text-red-500">*</span></Label>
                <Input
                  id="fieldVisitSize"
                  type="text"
                  required
                  value={fieldVisitSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isValidNumber(val, 1, defaultMaxUploadSizeMB || 10)) {
                      setFieldVisitSize(val);
                    } else {
                      getErrorToast(`Allowed size between 1 to ${defaultMaxUploadSizeMB} MB`);
                    }
                  }}
                  placeholder={`e.g. ${defaultMaxUploadSizeMB}`}
                  className="bg-white dark:bg-zinc-950 text-foreground"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="chatSize">{t("Chat Max Upload Size (MB)", "चैट का अधिकतम अपलोड आकार (MB)")} <span className="text-red-500">*</span></Label>
                <Input
                  id="chatSize"
                  type="text"
                  required
                  value={chatSize}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (isValidNumber(val, 1, defaultMaxUploadSizeMB || 10)) {
                      setChatSize(val);
                    } else {
                      getErrorToast(`Allowed size between 1 to ${defaultMaxUploadSizeMB} MB`);
                    }
                  }}
                  placeholder={`e.g. ${defaultMaxUploadSizeMB}`}
                  className="bg-white dark:bg-zinc-950 text-foreground"
                />
              </div>
            </div>
          </div>

          {/* Section 2: SLA Warning Inputs */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="font-bold text-foreground">{t("SLA Warning Inputs", "SLA चेतावनी इनपुट")}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("Configure SLA threshold warning triggers (1% to 100%)", "SLA सीमा चेतावनी ट्रिगर (1% से 100%) कॉन्फ़िगर करें")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="slaWarningPercentage">
                  {t("SLA Warning Percentage", "SLA चेतावनी प्रतिशत")} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="slaWarningPercentage"
                    type="text"
                    required
                    value={slaWarningPercentage}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isValidNumber(val, 1, 100)) {
                        setSlaWarningPercentage(val);
                      } else {
                        getErrorToast("Allowed percentage between 1 to 100 %");
                      }
                    }}
                    placeholder="e.g. 75"
                    className="bg-white dark:bg-zinc-950 text-foreground pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium pointer-events-none select-none">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  <span className="font-medium text-foreground">{t("Note:", "नोट:")}</span> {t("Warning notification triggers when elapsed SLA time reaches this percentage (e.g. at 75%, notification fires after 18 hrs of a 24-hr SLA).", "बीता हुआ SLA समय इस प्रतिशत तक पहुँचने पर चेतावनी अधिसूचना ट्रिगर होती है (उदा. 75% पर, 24 घंटे के SLA में 18 घंटे के बाद सूचना भेजी जाती है)।")}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-border mt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={mutation.isPending}
            >
              <Save className="w-4 h-4 mr-1.5" />
              {mutation.isPending ? t("Saving...", "सहेजा जा रहा है...") : t("Save Settings", "सेटिंग्स सहेजें")}
            </Button>
          </div>
        </form>
      </LoaderErrWrapper>
    </div>
  );
};

export default FileSizeSections;