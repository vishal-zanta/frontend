import React, { useState, useEffect, useRef } from "react";
import { ArrowLeftRight, X, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { getRouteAfterLogin, getErrorToast } from "@/utils/helpers";
import { RolesList } from "@/pages/RoleSelect";
import { Badge } from "@/components/ui/badge";

export default function RoleSwitchPopover() {
  const { profile, setProfile, profiledata } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  const roles = profile?.roles || [];
  const currentRole = profile?.role;
  const currentRoleName =
    currentRole?.designationEnglish ||
    currentRole?.name ||
    profiledata?.role ||
    "";

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleChange = (selectedRole) => {
    localStorage.setItem("role", JSON.stringify(selectedRole));
    setProfile((prev) => ({ ...prev, role: selectedRole }));
    const path = getRouteAfterLogin(selectedRole?.permissions || []);
    setIsOpen(false);
    if (path) {
      setTimeout(() => {
        navigate(path, { replace: true });
      }, 0);
    } else {
      getErrorToast(
        t(
          "Ask admin to give some permissions for this role",
          "कृपया व्यवस्थापक से इस भूमिका के लिए अनुमति प्राप्त करें",
        ),
      );
    }
  };

  if (!profiledata?.isMultiRoles || roles.length <= 1) {
    return null;
  }

  return (
    <div className="relative" ref={popoverRef}>
      {/* Switch Role Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1.5 text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer text-nowrap"
        title={t("Switch Designation", "पदनाम बदलें")}
        aria-label="Switch Designation"
      >
        <ArrowLeftRight className="w-3.5 h-3.5" />
        {/* <span className="hidden md:inline">
          {t("Switch Role", "पदनाम बदलें")}
        </span> */}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 top-12 w-72 xs:w-80 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2 min-w-0">
              <Shield className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="font-semibold text-sm text-foreground leading-tight">
                  {t("Switch Designation", "पदनाम बदलें")}
                </div>
                {currentRoleName && (
                  <div className="text-[11px] text-muted-foreground truncate">
                    {t("Current:", "वर्तमान:")}{" "}
                    <span className="font-medium text-primary">
                      {currentRoleName}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-muted rounded cursor-pointer text-muted-foreground hover:text-foreground shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body with Roles List */}
          <div className="p-3 max-h-80 overflow-y-auto">
            <RolesList
              roles={roles}
              currentRoleId={currentRole?._id || currentRoleName}
              onSelectRole={handleRoleChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
