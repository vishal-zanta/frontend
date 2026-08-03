import React from "react";
import MyTable from "@/components/MyTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, LogOut } from "lucide-react";
import { CCE_ROLES, PERMISSIONS, ADMIN_ROLES } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import useIsMobile from "@/hooks/useIsMobile";

export default function UserManageTable({
  users = [],
  handleToggleStatus,
  setEditUser,
  handleDelete,
  handleView,
  handleLogoutClick,
}) {
  const { hasPermission } = useAuth();
  const { t } = useLanguage();

  const tableHeaders = [
    {
      id: "user",
      label: t("User", "उपयोगकर्ता"),
      className: "bg-[#F4F7FA] dark:bg-[#172033] sticky left-0",
    },
    {
      id: "role",
      label: t("Role", "भूमिका"),
    },
    {
      id: "district",
      label: t("District", "जिला"),
    },
    {
      id: "skills",
      label: t("Skills", "कौशल"),
      className: "min-w-[200px]",
    },
    {
      id: "languages",
      label: t("Languages", "भाषाएँ"),
      className: "min-w-[150px]",
    },
    {
      id: "lastLogin",
      label: t("Last Login", "अंतिम लॉगिन"),
    },
    {
      id: "status",
      label: t("Status", "स्थिति"),
    },
    {
      id: "actions",
      label: t("Actions", "कार्रवाई"),
      className: "text-center bg-[#F4F7FA] dark:bg-[#172033] sticky right-0",
    },
  ];

  const tableBody = (users || []).filter(Boolean).map((u) => {
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

    return {
      user: {
        className: "bg-white dark:bg-[#0f1729] sticky left-0",
        value: (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
              {(u.name || "U")
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "U"}
            </div>
            <div>
              <div className="font-medium">{u.name || "N/A"}</div>
              {!CCE_ROLES.includes(u.role) && (
                <div className="text-xs text-muted-foreground">
                  {u.email || "N/A"}
                </div>
              )}
              {CCE_ROLES.includes(u.role) && (
                <div className="text-xs text-muted-foreground">
                  {u?.loginId || u?.email || "N/A"}
                </div>
              )}
            </div>
          </div>
        ),
      },
      role: {
        value: u?.role ? (
          <Badge variant="outline" className="text-xs">
            {u.role}
          </Badge>
        ) : (
          "N/A"
        ),
      },
      district: {
        className: "text-muted-foreground",
        value: u.district || "N/A",
      },
      skills: {
        className: "min-w-[200px]",
        value: (
          <div className="flex flex-wrap gap-1 max-w-[300px] max-h-20 overflow-y-auto">
            {skillsList.map((sk, skIdx) => (
              <Badge
                key={typeof sk === "object" ? sk._id || skIdx : skIdx}
                variant="secondary"
                className="text-[10px] bg-muted text-foreground text-nowrap"
              >
                {typeof sk === "object" ? sk.name || sk.label || "N/A" : sk}
              </Badge>
            ))}
            {skillsList.length === 0 && "N/A"}
          </div>
        ),
      },
      languages: {
        className: "min-w-[150px]",
        value: (
          <div className="flex flex-wrap gap-1 max-w-[200px] max-h-20 overflow-y-auto">
            {languagesList.map((lang, langIdx) => (
              <Badge
                key={langIdx}
                variant="outline"
                className="text-[10px] text-nowrap"
              >
                {typeof lang === "object"
                  ? lang.name || lang.label || "N/A"
                  : lang}
              </Badge>
            ))}
            {languagesList.length === 0 && "N/A"}
          </div>
        ),
      },
      lastLogin: {
        className: "text-xs text-muted-foreground",
        value: u.lastLogin || "N/A",
      },
      status: {
        value: (
          <Badge
            variant="outline"
            className={`text-xs capitalize ${
              u.status === "ACTIVE"
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : u.status === "inactive"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-destructive/10 text-destructive"
            }`}
          >
            {u.status === "ACTIVE"
              ? t("ACTIVE", "सक्रिय")
              : t("INACTIVE", "निष्क्रिय")}
          </Badge>
        ),
      },
      actions: {
        className: "text-center bg-white dark:bg-[#0f1729] sticky right-0",
        value: (
          <div className="flex gap-1 justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView && handleView({ ...u })}
              title={t("View User", "उपयोगकर्ता देखें")}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditUser && setEditUser({ ...u })}
              title={t("Edit User", "उपयोगकर्ता संपादित करें")}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete && handleDelete(u)}
              title={t("Delete User", "उपयोगकर्ता हटाएँ")}
              disabled={ADMIN_ROLES.includes(u.role)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
            {hasPermission(PERMISSIONS.LOGOUT_USERS) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLogoutClick && handleLogoutClick(u)}
                title={t("Logout", "लॉगआउट")}
              >
                <LogOut className="w-4 h-4 text-red-500" />
              </Button>
            )}
          </div>
        ),
      },
    };
  });

  return <MyTable tableHeaders={tableHeaders} tableBody={tableBody} />;
}
