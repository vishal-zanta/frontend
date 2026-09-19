import React from "react";
import RhfInput from "@/components/rhfinputs/RhfInput";
import RhfSelect from "@/components/rhfinputs/RhfSelect";
import { Button } from "@/components/ui/button";
import useGetRoles from "@/hooks/query/useGetRoles";
import { useGetDistricts } from "../../master-data/hooks";
import { useGetUsers } from "../hooks";
import { Save, UserPlus, Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import {
  MAX_LIMIT,
  LANGUAGES,
  CCE_ROLES,
  ADMIN_ROLES,
  CCS_ONLY_ROLES,
  CCE_ONLY_ROLES,
} from "@/utils/constants";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export default function Form({
  onCancel,
  isEdit = false,
  submitLabel = "Save",
  isLoading = false,
  disabledKeys = [],
  skillsOptions = [],
}) {
  const { t } = useLanguage();
  const { rolesMap } = useAuth();
  const { data: rolesApiData } = useGetRoles([], { page: 1, limit: MAX_LIMIT });
  const { data: districtData } = useGetDistricts();

  const { watch } = useFormContext();
  const selectedRoleIds = watch("roles") || [];

  const roleOptions = (rolesApiData?.data?.docs || []).map((r) => ({
    label: r.designationEnglish,
    value: r._id,
  }));

  const cceRoleIds = CCE_ROLES.map(
    (r) => rolesMap?.get(r) || roleOptions.find((opt) => opt.label === r)?.value
  ).filter(Boolean);
  const cceOnlyRoleIds = CCE_ONLY_ROLES.map(
    (r) => rolesMap?.get(r) || roleOptions.find((opt) => opt.label === r)?.value
  ).filter(Boolean);
  const adminRoleIds = ADMIN_ROLES.map(
    (r) => rolesMap?.get(r) || roleOptions.find((opt) => opt.label === r)?.value
  ).filter(Boolean);
  const ccsRoleIds = CCS_ONLY_ROLES.map(
    (r) => rolesMap?.get(r) || roleOptions.find((opt) => opt.label === r)?.value
  ).filter(Boolean);
  const ccsRoleQuery = ccsRoleIds.join(",");

  const isCCE = selectedRoleIds.some((id) => cceRoleIds.includes(id));
  const isCCEOnly = selectedRoleIds.some((id) => cceOnlyRoleIds.includes(id));
  const isAdmin = selectedRoleIds.some((id) => adminRoleIds.includes(id));
  const isOther = selectedRoleIds.length > 0 && !isAdmin && !isCCE;

  const { data: ccsUsersData, isLoading: isCcsLoading } = useGetUsers(
    ["ccs-supervisors", ccsRoleQuery],
    {
      page: 1,
      limit: MAX_LIMIT,
      designation: ccsRoleQuery,
      roles: ccsRoleQuery,
      role: ccsRoleQuery,
    },
    isCCEOnly && !!ccsRoleQuery,
  );

  const ccsOptions = (
    ccsUsersData?.data?.data?.docs ||
    ccsUsersData?.data?.docs ||
    []
  ).map((u) => ({
    label: u.name
      ? `${u.name}${u.loginId ? ` (${u.loginId})` : ""}`
      : u.loginId || u.email || u._id,
    value: u._id,
  }));

  const districtOptions = (
    (Array.isArray(districtData?.data?.data)
      ? districtData?.data?.data
      : districtData?.data?.data?.docs) || []
  ).map((d) => ({
    label: t(d.name_en || d.name, d.name_local || d.nameHindi),
    value: d._id,
  }));

  const statusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
    { label: "Suspended", value: "SUSPENDED" },
  ];

  return (
    <div className="space-y-4 max-h-[400px]">
      <RhfSelect
        name="roles"
        label={t("Designation", "पदनाम")}
        required
        disabled={disabledKeys.includes("roles") || disabledKeys.includes("role")}
        options={roleOptions}
        placeholder={t("Select designations", "पदनाम चुनें")}
        isMultiple={true}
      />
      {isCCEOnly && (
        <RhfSelect
          name="supervisor"
          label={t("CCS", "CCS")}
          required
          options={ccsOptions}
          placeholder={
            isCcsLoading
              ? t("Loading CCS...", "CCS लोड हो रहा है...")
              : t("Select CCS", "CCS चुनें")
          }
          isLoading={isCcsLoading}
        />
      )}
      <RhfInput
        label="Name"
        name="name"
        required
        placeholder="Enter full name"
      />
      {isCCE ? (
        <RhfInput
          label="Login ID"
          name="loginId"
          required
          isUppercase={true}
          placeholder="Enter Login ID"
        />
      ) : (
        <RhfInput
          label="Email"
          name="email"
          required
          placeholder="email@bihar.gov.in"
        />
      )}
      <RhfInput
        label="Phone"
        name="phone"
        required={!isCCE}
        placeholder="Enter 10-digit phone number"
        isNumsOnly
        maxLength={10}
      />
      <RhfInput
        label="Password"
        name="password"
        type="password"
        required={!isEdit}
        placeholder="Enter password"
      />
      <RhfInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        required={!isEdit}
        placeholder="Confirm password"
      />

      <RhfSelect
        name="district"
        label="District"
        // required
        options={districtOptions}
        placeholder="Select a district"
      />

      {isEdit && (
        <RhfSelect
          name="status"
          label="Status"
          required
          options={statusOptions}
          placeholder="Select status"
        />
      )}

      <RhfSelect
        name="skills"
        label="Skills"
        options={skillsOptions}
        placeholder="Select skills"
        isMultiple={true}
      />

      <RhfSelect
        name="preferredLanguages"
        label="Preferred Languages"
        options={LANGUAGES}
        placeholder="Select preferred languages"
        isMultiple={true}
      />

      <div className="flex gap-2 pt-2  mt-4 sticky bottom-0 bg-card pb-4">
        <Button
          variant="outline"
          className="flex-1"
          type="button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary/90"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Saving...
            </>
          ) : isEdit ? (
            <>
              <Save className="w-4 h-4 mr-1" /> {submitLabel}
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-1" />{" "}
              {isOther ? "Send Verification Mail" : submitLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
