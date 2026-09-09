import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MySelect from "@/components/inputs/MySelect";
import { isValidNumber } from "@/utils/helpers";
import { Loader2, ShieldAlert } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Form({
  editItem,
  dialog,
  setDialog,
  roles = [],
  serviceOptions = [],
  isServicesPending = false,
}) {
  const { t } = useLanguage();

  const serviceTitle =
    editItem?.service?.title ||
    editItem?.service?.name ||
    editItem?.subService?.service?.title ||
    editItem?.subService?.title ||
    editItem?.service ||
    "";

  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5 flex items-center gap-2">
          {t("Service", "सेवा")} <span className="text-red-500">*</span>
          {isServicesPending && (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          )}
        </Label>
        {editItem ? (
          <Input
            disabled
            value={serviceTitle}
            className="bg-muted/50"
          />
        ) : (
          <MySelect
            options={serviceOptions}
            value={dialog.service || ""}
            onValueChange={(val) =>
              setDialog({ ...dialog, service: val })
            }
            placeholder={t("Select service...", "सेवा चुनें...")}
            isLoading={isServicesPending}
          />
        )}
      </div>

      <div className="space-y-3">
        <Label className="block font-medium">
          {t("Escalation Levels (SLA Hours)", "वृद्धि स्तर (SLA घंटे)")}
        </Label>
        {!roles || !roles.length ? (
          <div className="flex flex-col items-center justify-center border rounded-xl bg-muted/20 dark:bg-muted/10 py-7 px-4 text-center">
            <div className="w-10 h-10 rounded-full bg-muted/60 dark:bg-muted/40 flex items-center justify-center mb-2 text-muted-foreground/80">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {t("No designations found", "कोई पदनाम नहीं मिला")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-[250px]">
              {t(
                "There are no escalation designations available to set SLA hours.",
                "SLA घंटे सेट करने के लिए कोई वृद्धि पदनाम उपलब्ध नहीं हैं।",
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 p-3 gap-3 max-h-[40vh] overflow-y-auto border rounded-lg bg-muted/10">
            {roles.map((role) => {
              const esc = dialog.escalations?.find(
                (item) => (item.role?._id || item.role) === role._id,
              );
              const value = esc?.slaHours ?? "";
              const slaType = esc?.slaType ?? "hrs";

              return (
                <div key={role._id} className="space-y-1">
                  <Label className="text-xs truncate block text-muted-foreground">
                    {role.designationEnglish}
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      type="text"
                      value={value}
                      placeholder={t("Duration", "अवधि")}
                      className="pr-16"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== "" && Number(val) < 0) return;
                        if (!isValidNumber(val, 1, 9999)) return;

                        let newEsc = [...(dialog.escalations || [])];
                        const idx = newEsc.findIndex(
                          (item) => (item.role?._id || item.role) === role._id,
                        );
                        if (val === "") {
                          if (idx > -1) {
                            newEsc.splice(idx, 1);
                          }
                        } else {
                          if (idx > -1) {
                            newEsc[idx] = {
                              ...newEsc[idx],
                              slaHours: Number(val),
                              slaType: newEsc[idx].slaType || "hrs",
                            };
                          } else {
                            newEsc.push({
                              role: role._id,
                              slaHours: Number(val),
                              slaType: "hrs",
                            });
                          }
                        }
                        setDialog({ ...dialog, escalations: newEsc });
                      }}
                    />
                    <select
                      value={slaType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        let newEsc = [...(dialog.escalations || [])];
                        const idx = newEsc.findIndex(
                          (item) => (item.role?._id || item.role) === role._id,
                        );
                        if (idx > -1) {
                          newEsc[idx] = {
                            ...newEsc[idx],
                            slaType: newType,
                          };
                        } else {
                          newEsc.push({
                            role: role._id,
                            slaHours: 0,
                            slaType: newType,
                          });
                        }
                        setDialog({ ...dialog, escalations: newEsc });
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 bg-transparent border-0 text-xs text-muted-foreground focus:outline-none cursor-pointer"
                    >
                      <option value="hrs" className="bg-popover text-popover-foreground">
                        Hrs
                      </option>
                      <option value="days" className="bg-popover text-popover-foreground">
                        Days
                      </option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
