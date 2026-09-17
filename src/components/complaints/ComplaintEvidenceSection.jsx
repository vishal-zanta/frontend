import React from "react";
import { IMG_BASE_URL } from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

export default function ComplaintEvidenceSection({
  description,
  attachments = [],
  geotaggedImages = [],
  impact = null,
  resolvedReason = null,
}) {
  // console.log({description});
  const { t } = useLanguage();
  const { profiledata } = useAuth();

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
            {t("uploaded Attachments", "अपलोड किए गए संलग्नक")} ({attachments.length}
            )
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
          <div className="text-[10px] lg:text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">
            {t("Geo-Tagged Field Photos", "जियो-टैग की गई फील्ड तस्वीरें")} (
            {geotaggedImages.length})
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

              return (
                <div
                  key={idx}
                  className="border border-border rounded-lg p-2 bg-card overflow-hidden"
                >
                  {isImage ? (
                    <a
                      href={displayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={displayUrl}
                        alt={fileName}
                        className="max-h-48 max-w-48 mx-auto w-full h-full object-contain  rounded hover:scale-105 transition-transform"
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
    </>
  );
}
