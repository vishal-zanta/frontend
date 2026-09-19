import React, { useState, useEffect } from "react";
import { IMG_BASE_URL, PERMISSIONS, QUERY_KEYS } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import DeleteDialog from "@/components/DeleteDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComplaintByOfficer } from "@/api/complaint.api";
import { getErrorToast, getSuccessToast } from "@/utils/helpers";

export default function ComplaintEvidenceSection({
  description,
  attachments = [],
  geotaggedImages = [],
  impact = null,
  resolvedReason = null,
  status = "",
  complaintId = null,
}) {
  const deleteAllowedOnStatus = ["REOPENED", "IN_PROGRESS"];

  const { t } = useLanguage();
  const { profiledata, hasPermission } = useAuth();
  const queryClient = useQueryClient();

  const canDeleteGeoImages = Boolean(
    deleteAllowedOnStatus.includes(status) &&
    profiledata?.isOfficer &&
    hasPermission(PERMISSIONS.UPDATE_GRIEVANCE),
  );
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setSelectedIndices([]);
  }, [geotaggedImages.length]);

  const toggleSelect = (idx) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIndices.length === geotaggedImages.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(geotaggedImages.map((_, idx) => idx));
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (remainingImages) =>
      updateComplaintByOfficer({
        id: complaintId,
        data: { geotaggedImages: remainingImages },
      }),
    onSuccess: () => {
      getSuccessToast(
        t(
          "Geo-tagged images deleted successfully",
          "जियो-टैग की गई तस्वीरें सफलतापूर्वक हटा दी गईं",
        ),
      );
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPLAINTS] });
      queryClient.invalidateQueries({ queryKey: ["complaint", complaintId] });
      queryClient.invalidateQueries({
        queryKey: ["complaint-officer", complaintId],
      });
      queryClient.invalidateQueries({ queryKey: ["grievances"] });
      queryClient.invalidateQueries({ queryKey: ["grievance"] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPLAINT_DETAIL_OFFICER],
      });
      setSelectedIndices([]);
      setIsDeleteDialogOpen(false);
    },
    onError: (err) => {
      getErrorToast(err);
    },
  });

  const handleDeleteConfirm = () => {
    const remainingImages = geotaggedImages.filter(
      (_, idx) => !selectedIndices.includes(idx),
    );
    deleteMutation.mutate(remainingImages);
  };

  const vulnerabilities = [];
  if (impact?.vulnerability?.seniorCitizen) {
    vulnerabilities.push({
      key: "seniorCitizen",
      label: t("Senior Citizen", "वरिष्ठ नागरिक"),
    });
  }
  if (impact?.vulnerability?.woman) {
    vulnerabilities.push({ key: "woman", label: t("Woman", "महिला") });
  }
  if (impact?.vulnerability?.personWithDisability) {
    vulnerabilities.push({
      key: "personWithDisability",
      label: t("Person with Disability", "दिव्यांग"),
    });
  }
  if (impact?.vulnerability?.economicallyWeakerSection) {
    vulnerabilities.push({
      key: "economicallyWeakerSection",
      label: t("Economically Weaker Section", "आर्थिक रूप से कमजोर वर्ग"),
    });
  }
  if (impact?.vulnerability?.general) {
    vulnerabilities.push({
      key: "general",
      label: t("General", "सामान्य"),
    });
  }

  const affectedBeneficiaryText =
    typeof impact?.affectedBeneficiary === "object"
      ? t(
          impact.affectedBeneficiary?.title || impact.affectedBeneficiary?.name,
          impact.affectedBeneficiary?.titleHindi ||
            impact.affectedBeneficiary?.nameHindi,
        ) ||
        impact.affectedBeneficiary?.title ||
        impact.affectedBeneficiary?.name ||
        ""
      : impact?.affectedBeneficiary;

  return (
    <>
      {/* Description */}
      <div className="bg-muted/50 rounded-lg p-2.5 lg:p-3">
        <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">
          {t("Brief Description / Details", "संक्षिप्त विवरण / विवरण")}
        </div>
        <p className="text-xs lg:text-sm leading-relaxed text-foreground whitespace-pre-wrap ">
          {description || "N/A"}
        </p>
      </div>

      {/* Impact Details & Vulnerability */}
      {impact && (affectedBeneficiaryText || vulnerabilities.length > 0) && (
        <div className="bg-muted/30 rounded-lg p-2.5 lg:p-3 border border-border">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
            {t("Impact & Vulnerability", "प्रभाव एवं संवेदनशीलता")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 lg:gap-3 text-[10px] lg:text-xs">
            {affectedBeneficiaryText && (
              <div>
                <span className="text-muted-foreground block font-medium">
                  {t("Affected Beneficiary", "प्रभावित लाभार्थी")}
                </span>
                <span className="font-semibold text-foreground">
                  {affectedBeneficiaryText}
                </span>
              </div>
            )}
            {vulnerabilities.length > 0 && (
              <div>
                <span className="text-muted-foreground block font-medium mb-1">
                  {t("Vulnerability", "संवेदनशीलता")}
                </span>
                <div className="flex flex-wrap gap-1">
                  {vulnerabilities.map((v) => (
                    <Badge
                      key={v.key}
                      variant="outline"
                      className="text-[10px] bg-primary/10 text-primary border-primary/20"
                    >
                      {v.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {resolvedReason && !profiledata?.isOfficer && (
        <div className="bg-muted/50 rounded-lg p-2.5 lg:p-3">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">
            {t("Resolved Reason", "समाधान का कारण")}
          </div>
          <p className="text-xs lg:text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {resolvedReason}
          </p>
        </div>
      )}

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
            {t("uploaded Attachments", "अपलोड किए गए संलग्नक")} (
            {attachments.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {attachments.map((att, idx) => {
              const isImage =
                att.type === "IMAGE" ||
                att.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              return (
                <div
                  key={idx}
                  className="border border-border rounded-lg p-2 bg-card overflow-hidden"
                >
                  {isImage ? (
                    <a
                      href={IMG_BASE_URL + att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={IMG_BASE_URL + att.url}
                        alt={att.fileName || "Attachment"}
                        className=" max-h-48 max-w-48 mx-auto w-full h-full object-contain rounded hover:scale-105 transition-transform"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-24 bg-muted/50 rounded flex items-center justify-center flex-col p-1 text-center">
                      <span className="text-[10px] text-muted-foreground font-mono truncate w-full">
                        {att.fileName}
                      </span>
                      <a
                        href={IMG_BASE_URL + att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 font-semibold"
                      >
                        {t("Download", "डाउनलोड करें")}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Geotagged Images */}
      {geotaggedImages.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="text-[10px] lg:text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              {t("Geo-Tagged Field Photos", "जियो-टैग की गई फील्ड तस्वीरें")} (
              {geotaggedImages.length})
            </div>

            {canDeleteGeoImages && (
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleSelectAll}
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {selectedIndices.length === geotaggedImages.length
                    ? t("Deselect All", "सभी अचयनित करें")
                    : t("Select All", "सभी चुनें")}
                </Button>

                {selectedIndices.length > 0 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={deleteMutation.isPending}
                    className="h-7 text-xs px-2.5 flex items-center gap-1.5 cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>
                      {selectedIndices.length === geotaggedImages.length
                        ? t("Delete All", "सभी हटाएँ")
                        : t("Delete Selected", "चयनित हटाएँ")}{" "}
                      ({selectedIndices.length})
                    </span>
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {geotaggedImages.map((img, idx) => {
              const url =
                typeof img === "string" ? img : img?.url || img?.path || "";
              const displayUrl = url.startsWith("http")
                ? url
                : IMG_BASE_URL + url;
              const fileName =
                typeof img === "object"
                  ? img?.fileName || img?.name || `Field Photo ${idx + 1}`
                  : url.split("/").pop() || `Field Photo ${idx + 1}`;
              const isImage =
                (typeof img === "object" && img?.type === "IMAGE") ||
                !!url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
              const isSelected = selectedIndices.includes(idx);

              return (
                <div
                  key={idx}
                  className={`relative border rounded-lg p-2 bg-card overflow-hidden transition-all ${
                    isSelected
                      ? "border-red-500 ring-2 ring-red-500/40 bg-red-50/20 dark:bg-red-950/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {canDeleteGeoImages && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSelect(idx);
                      }}
                      className={`absolute top-2 left-2 z-20 w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer shadow-md ${
                        isSelected
                          ? "bg-red-600 text-white ring-2 ring-red-600/30"
                          : "bg-background/90 text-muted-foreground hover:bg-background hover:text-foreground border border-border"
                      }`}
                      title={
                        isSelected
                          ? t("Deselect", "अचयनित करें")
                          : t("Select", "चुनें")
                      }
                    >
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        <div className="w-3 h-3 rounded-sm border border-muted-foreground/60" />
                      )}
                    </button>
                  )}

                  {isImage ? (
                    <a
                      href={displayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={displayUrl}
                        alt={fileName}
                        className="max-h-48 max-w-48 mx-auto w-full h-full object-contain rounded hover:scale-105 transition-transform"
                      />
                    </a>
                  ) : (
                    <div className="w-full h-24 bg-muted/50 rounded flex items-center justify-center flex-col p-1 text-center">
                      <span className="text-[10px] text-muted-foreground font-mono truncate w-full">
                        {fileName}
                      </span>
                      <a
                        href={displayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline mt-1 font-semibold"
                      >
                        {t("Download", "डाउनलोड करें")}
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isDeleteDialogOpen && (
        <DeleteDialog
          title={
            selectedIndices.length === geotaggedImages.length
              ? t(
                  "All Geo-Tagged Field Photos",
                  "सभी जियो-टैग की गई फील्ड तस्वीरें",
                )
              : `${selectedIndices.length} ${t(
                  "Selected Photo(s)",
                  "चयनित फोटो",
                )}`
          }
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={handleDeleteConfirm}
          deleting={deleteMutation.isPending}
        />
      )}
    </>
  );
}
