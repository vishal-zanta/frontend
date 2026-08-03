import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, LogOut } from "lucide-react";
import { CCE_ROLES, PERMISSIONS, ADMIN_ROLES } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import clsx from "clsx";

export default function UserManageCards({
  users = [],
  handleToggleStatus,
  setEditUser,
  handleDelete,
  handleView,
  handleLogoutClick,
}) {
  const { hasPermission } = useAuth();
  const { t } = useLanguage();

  if (!users || users.length === 0) {
    return (
      <div className="p-6 text-center text-xs xs:text-sm text-muted-foreground">
        {t("No users found.", "कोई उपयोगकर्ता नहीं मिला।")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
      {users.map((u) => {
        if (!u) return null;
        return (
          <UserCard
            key={u.id || u._id}
            u={u}
            t={t}
            hasPermission={hasPermission}
            setEditUser={setEditUser}
            handleDelete={handleDelete}
            handleView={handleView}
            handleLogoutClick={handleLogoutClick}
          />
        );
      })}
    </div>
  );
}

function UserCard({
  u,
  t,
  hasPermission,
  setEditUser,
  handleDelete,
  handleView,
  handleLogoutClick,
}) {
  const skillsList = Array.isArray(u.skills)
    ? u.skills
    : typeof u.skills === "string" && u.skills.trim()
      ? u.skills.split(", ").filter(Boolean)
      : [];
  const languagesList = Array.isArray(u.preferredLanguages)
    ? u.preferredLanguages
    : typeof u.preferredLanguages === "string" && u.preferredLanguages.trim()
      ? u.preferredLanguages.split(", ").filter(Boolean)
      : [];

  return (
    <div className="rounded-xl border border-border bg-background dark:bg-[#0c1427] shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Top Header: Avatar, Name, Email, Status */}
      <div className="p-3 xs:p-3.5 sm:p-4 border-b border-border/60 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 xs:gap-2.5 min-w-0">
          <div className="w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[11px] xs:text-xs font-bold shrink-0">
            {(u.name || "U")
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "U"}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-xs xs:text-sm text-foreground truncate">
              {u.name || "N/A"}
            </div>
            <div className="text-[11px] xs:text-xs text-muted-foreground truncate">
              {!CCE_ROLES.includes(u.role)
                ? u.email || "N/A"
                : u?.loginId || u?.email || "N/A"}
            </div>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`text-[10px] xs:text-[11px] capitalize shrink-0 px-2 py-0.5 ${
            u.status === "ACTIVE"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : u.status === "inactive"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {u.status === "ACTIVE"
            ? t("ACTIVE", "सक्रिय")
            : t("INACTIVE", "निष्क्रिय")}
        </Badge>
      </div>

      {/* Body: Meta Grid & Skills/Languages */}
      <div className="p-3 xs:p-3.5 sm:p-4 space-y-2.5 xs:space-y-3">
        {/* Meta Grid: Role, District, Last Login */}
        <div className="grid grid-cols-2 gap-1.5 xs:gap-2 text-xs bg-muted/40 p-2 xs:p-2.5 rounded-lg border border-border/50">
          <div>
            <span className="text-muted-foreground block text-[9px] xs:text-[10px] uppercase font-medium">
              {t("Role", "भूमिका")}
            </span>
            {u?.role ? (
              <Badge
                variant="outline"
                className="text-[9px] xs:text-[10px] mt-0.5"
              >
                {u.role}
              </Badge>
            ) : (
              <span className="text-foreground text-xs font-medium">N/A</span>
            )}
          </div>
          <div>
            <span className="text-muted-foreground block text-[9px] xs:text-[10px] uppercase font-medium">
              {t("District", "जिला")}
            </span>
            <span className="font-medium text-foreground text-xs truncate block">
              {u.district || "N/A"}
            </span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground block text-[9px] xs:text-[10px] uppercase font-medium">
              {t("Last Login", "अंतिम लॉगिन")}
            </span>
            <span className="font-medium text-foreground text-xs truncate block">
              {u.lastLogin || "N/A"}
            </span>
          </div>
        </div>

        {/* Skills & Languages */}
        <div className="space-y-2 text-xs">
          <div>
            <span className="text-muted-foreground text-[9px] xs:text-[10px] uppercase font-medium mr-1.5">
              {t("Skills:", "कौशल:")}
            </span>
            {skillsList.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {skillsList.map((sk, skIdx) => (
                  <Badge
                    key={typeof sk === "object" ? sk._id || skIdx : skIdx}
                    variant="secondary"
                    className="text-[9px] xs:text-[10px] bg-muted text-foreground px-1.5 py-0.5"
                  >
                    {typeof sk === "object" ? sk.name || sk.label || "N/A" : sk}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-xs block mt-0.5">N/A</span>
            )}
          </div>

          <div>
            <span className="text-muted-foreground text-[9px] xs:text-[10px] uppercase font-medium mr-1.5">
              {t("Languages:", "भाषाएँ:")}
            </span>
            {languagesList.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {languagesList.map((lang, langIdx) => (
                  <Badge
                    key={langIdx}
                    variant="outline"
                    className="text-[9px] xs:text-[10px] px-1.5 py-0.5"
                  >
                    {typeof lang === "object"
                      ? lang.name || lang.label || "N/A"
                      : lang}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground text-xs block mt-0.5">N/A</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div
        className={clsx(
          "grid gap-1.5 p-3 xs:p-3.5 border-t border-border/60 xs:flex xs:flex-wrap xs:items-center xs:justify-end",
          hasPermission(PERMISSIONS.LOGOUT_USERS)
            ? "grid-cols-2"
            : "grid-cols-3"
        )}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleView && handleView({ ...u })}
          className="w-full xs:w-auto h-7 xs:h-8 text-[11px] xs:text-xs px-2 xs:px-2.5 flex items-center justify-center"
          title={t("View User", "उपयोगकर्ता देखें")}
        >
          <Eye className="w-3 h-3 xs:w-3.5 xs:h-3.5 mr-1" />
          {t("View", "देखें")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setEditUser && setEditUser({ ...u })}
          className="w-full xs:w-auto h-7 xs:h-8 text-[11px] xs:text-xs px-2 xs:px-2.5 flex items-center justify-center"
          title={t("Edit User", "उपयोगकर्ता संपादित करें")}
        >
          <Edit className="w-3 h-3 xs:w-3.5 xs:h-3.5 mr-1" />
          {t("Edit", "संपादित करें")}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDelete && handleDelete(u)}
          disabled={ADMIN_ROLES.includes(u.role)}
          className="w-full xs:w-auto h-7 xs:h-8 text-[11px] xs:text-xs px-2 xs:px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center"
          title={t("Delete User", "उपयोगकर्ता हटाएँ")}
        >
          <Trash2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 mr-1" />
          {t("Delete", "हटाएं")}
        </Button>

        {hasPermission(PERMISSIONS.LOGOUT_USERS) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLogoutClick && handleLogoutClick(u)}
            className="w-full xs:w-auto h-7 xs:h-8 text-[11px] xs:text-xs px-2 xs:px-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center"
            title={t("Logout", "लॉगआउट")}
          >
            <LogOut className="w-3 h-3 xs:w-3.5 xs:h-3.5 mr-1" />
            {t("Logout", "लॉगआउट")}
          </Button>
        )}
      </div>
    </div>
  );
}
