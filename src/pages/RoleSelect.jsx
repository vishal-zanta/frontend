import React from "react";
import AuthLayout from "@/components/AuthLayout";
import HomeLayout from "@/components/HomeLayout";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ChevronRight, LogOut, User, CheckCircle2 } from "lucide-react";

const RoleSelect = ({ handleSetRole }) => {
  const { profile, setProfile } = useAuth();
  const { t } = useLanguage();

  const roles = profile?.roles || [];

  const onSelectRole = (selectedRole) => {
    handleSetRole(selectedRole);
    setProfile((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    sessionStorage.removeItem("usertoken");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <HomeLayout>
      <AuthLayout
        title={t("Select Designation", "पदनाम चुनें")}
        subtitle={
          profile?.name
            ? t(
                `Welcome, ${profile.name}. Choose a role to continue.`,
                `स्वागत है, ${profile.name}। जारी रखने के लिए एक पदनाम चुनें।`,
              )
            : t(
                "Choose the role you want to continue with",
                "जारी रखने के लिए अपना पदनाम चुनें",
              )
        }
      >
        <div className="space-y-4">
          {/* User Info Header */}
          {profile?.name && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-bold shadow-sm shrink-0">
                {profile.name
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || <User className="w-5 h-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-foreground truncate">
                  {profile.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {profile.email || profile.loginId || profile.phone || ""}
                </div>
              </div>
            </div>
          )}

          {/* Roles List */}
          <RolesList onSelectRole={onSelectRole} roles={roles} />

          {/* Logout option */}
          <div className="pt-3 border-t border-border flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleLogout}
              className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              {t(
                "Sign in as different user",
                "अलग उपयोगकर्ता के रूप में लॉगिन करें",
              )}
            </Button>
          </div>
        </div>
      </AuthLayout>
    </HomeLayout>
  );
};

export const RolesList = ({ onSelectRole, roles, currentRoleId }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2.5 pt-1">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
        {t("Available Roles", "उपलब्ध पदनाम")} ({roles.length})
      </label>

      {roles.length === 0 ? (
        <div className="p-4 text-center text-sm text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
          {t(
            "No designations assigned to your account.",
            "आपके खाते को कोई पदनाम आवंटित नहीं किया गया है।",
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-0.5">
          {roles.map((r, index) => {
            const roleNameEn = r.designationEnglish || r.name || "Role";
            const roleNameHi = r.designationHindi || roleNameEn;
            const displayName = t(roleNameEn, roleNameHi);
            const level = r.level || r.department;
            const isCurrent =
              currentRoleId &&
              (r._id === currentRoleId );

            return (
              <button
                key={r._id || index}
                type="button"
                onClick={() => onSelectRole(r)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 group text-left shadow-sm hover:shadow ${
                  isCurrent
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-border bg-card hover:bg-primary/5 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                        {displayName}
                      </span>
                      {isCurrent && (
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/30"
                        >
                          {t("Active", "सक्रिय")}
                        </Badge>
                      )}
                    </div>
                    {level && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 font-normal bg-muted"
                        >
                          {level}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0">
                  {isCurrent ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RoleSelect;
