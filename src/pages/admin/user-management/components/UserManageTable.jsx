import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, LogOut } from "lucide-react";


import {
  CCE_ROLES,
  PERMISSIONS,
  ADMIN_ROLES,
} from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

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
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="text-left text-xs text-muted-foreground">
          <th className="px-4 py-3 font-medium bg-[#F4F7FA] dark:bg-[#172033] sticky left-0">
            {t("User", "उपयोगकर्ता")}
          </th>
          <th className="px-4 py-3 font-medium">{t("Role", "भूमिका")}</th>
          <th className="px-4 py-3 font-medium">{t("District", "जिला")}</th>
          <th className="px-4 py-3 font-medium min-w-[200px]">{t("Skills", "कौशल")}</th>
          <th className="px-4 py-3 font-medium min-w-[150px]">{t("Languages", "भाषाएँ")}</th>
          {/* <th className="px-4 py-3 font-medium min-w-[280px]">Permissions</th> */}
          <th className="px-4 py-3 font-medium">{t("Last Login", "अंतिम लॉगिन")}</th>
          <th className="px-4 py-3 font-medium">{t("Status", "स्थिति")}</th>
          <th className="px-4 py-3 font-medium text-center bg-[#F4F7FA] dark:bg-[#172033] sticky right-0">
            {t("Actions", "कार्रवाई")}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {(users || []).map((u) => {
          if (!u) return null;
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
            <tr key={u.id || u._id} className="hover:bg-muted/30">
              <td className="px-4 py-3 bg-white dark:bg-[#0f1729] sticky left-0">
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
                    <div className="font-medium">{u.name || "-"}</div>
                    {!CCE_ROLES.includes(u.role) && (
                      <div className="text-xs text-muted-foreground">
                        {u.email || "-"}
                      </div>
                    )}
                    {CCE_ROLES.includes(u.role) && (
                      <div className="text-xs text-muted-foreground">
                        {u?.loginId || u?.email || "-"}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                {u?.role && (
                  <Badge variant="outline" className="text-xs">
                    {u.role}
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{u.district || "-"}</td>
              <td className="px-4 py-3 min-w-[200px]">
                <div className="flex flex-wrap gap-1 max-w-[300px] max-h-20 overflow-y-auto">
                  {skillsList.map((sk, skIdx) => (
                    <Badge
                      key={typeof sk === "object" ? sk._id || skIdx : skIdx}
                      variant="secondary"
                      className="text-[10px] bg-muted text-foreground text-nowrap"
                    >
                      {typeof sk === "object" ? sk.name || sk.label || "-" : sk}
                    </Badge>
                  ))}
                  {skillsList.length === 0 && "N/A"}
                </div>
              </td>
              <td className="px-4 py-3 min-w-[150px]">
                <div className="flex flex-wrap gap-1 max-w-[200px] max-h-20 overflow-y-auto">
                  {languagesList.map((lang, langIdx) => (
                    <Badge
                      key={langIdx}
                      variant="outline"
                      className="text-[10px] text-nowrap"
                    >
                      {typeof lang === "object" ? lang.name || lang.label || "-" : lang}
                    </Badge>
                  ))}
                  {languagesList.length === 0 && "N/A"}
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                {u.lastLogin || "-"}
              </td>
              <td className="px-4 py-3">
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
                  {u.status === "ACTIVE" ? t("ACTIVE", "सक्रिय") : t("INACTIVE", "निष्क्रिय")}
                </Badge>
              </td>
              <td className="px-4 py-3 text-center bg-white dark:bg-[#0f1729] sticky right-0">
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
                  {
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete && handleDelete(u)}
                      title={t("Delete User", "उपयोगकर्ता हटाएँ")}
                      disabled={ADMIN_ROLES.includes(u.role)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  }
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
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
