import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MySelect from "@/components/inputs/MySelect";
import { isValidNumber } from "@/utils/helpers";

export default function Form({
  editItem,
  dialog,
  setDialog,
  roles = [],
  subServiceOptions = [],
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1.5 block">Sub-Service <span className="text-red-500">*</span></Label>
        {editItem ? (
          <Input
            disabled
            value={
              editItem.subService?.title ||
              editItem.subService?.name ||
              ""
            }
            className="bg-muted/50"
          />
        ) : (
          <MySelect
            options={subServiceOptions}
            value={dialog.subService || ""}
            onValueChange={(val) =>
              setDialog({ ...dialog, subService: val })
            }
            placeholder="Select sub-service..."
          />
        )}
      </div>

      <div className="space-y-3">
        <Label className="block font-medium">
          Escalation Levels (SLA Hours)
        </Label>
        <div className="grid grid-cols-2 p-3 gap-3 max-h-[40vh] overflow-y-auto border rounded-lg bg-muted/10">
          {roles.map((role) => {
            const value =
              dialog.escalations?.find(
                (item) => (item.role?._id || item.role) === role._id,
              )?.slaHours ?? "";
            return (
              <div key={role._id} className="space-y-1">
                <Label className="text-xs truncate block text-muted-foreground">
                  {role.designationEnglish}
                </Label>
                <Input
                  value={value}
                  placeholder="Hours"
                  onChange={(e) => {
                    const val = e.target.value;
                    const isValid = isValidNumber(val, 0, 24);
                   
                    if (!isValid) return;
                    let newEsc = [...(dialog.escalations || [])];
                    const idx = newEsc.findIndex(
                      (item) =>
                        (item.role?._id || item.role) === role._id,
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
                        };
                      } else {
                        newEsc.push({
                          role: role._id,
                          slaHours: Number(val),
                        });
                      }
                    }
                    setDialog({ ...dialog, escalations: newEsc });
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="officer-assigned"
          checked={dialog.officer || false}
          onChange={(e) =>
            setDialog({ ...dialog, officer: e.target.checked })
          }
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="officer-assigned" className="cursor-pointer">
          Officer Assigned
        </Label>
      </div>
    </div>
  );
}
