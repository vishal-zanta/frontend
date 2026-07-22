import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { apiPermissionOptions, CCE_ROLES, PERMISSIONS } from "@/utils/constants";
import { useAuth } from "@/context/AuthContext";

export default function UserManageTable({
  users = [],
  handleToggleStatus,
  setEditUser,
  handleDelete,
  handleView,
  handleLogoutClick,
}) {
  const { hasPermission } = useAuth();
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50">
        <tr className="text-left text-xs text-muted-foreground">
          <th className="px-4 py-3 font-medium bg-[#F4F7FA] dark:bg-[#172033] sticky left-0">User</th>
          <th className="px-4 py-3 font-medium">Role</th>
          <th className="px-4 py-3 font-medium">District</th>
          <th className="px-4 py-3 font-medium min-w-[200px]">Skills</th>
          <th className="px-4 py-3 font-medium min-w-[150px]">Languages</th>
          <th className="px-4 py-3 font-medium min-w-[280px]">Permissions</th>
          <th className="px-4 py-3 font-medium">Last Login</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium text-center bg-[#F4F7FA] dark:bg-[#172033] sticky right-0">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {users.map((u) => (
          <tr key={u.id} className="hover:bg-muted/30">
            <td className="px-4 py-3 bg-white dark:bg-[#0f1729] sticky left-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                  {u.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium">{u.name}</div>
                {!CCE_ROLES.includes(u.role) &&  <div className="text-xs text-muted-foreground">{u.email}</div>}
                {CCE_ROLES.includes(u.role) &&   <div className="text-xs text-muted-foreground">{u?.loginId || u?.email}</div>}

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
            <td className="px-4 py-3 text-muted-foreground">{u.district}</td>
            <td className="px-4 py-3 min-w-[200px]">
              <div className="flex flex-wrap gap-1 max-w-[300px] max-h-20 overflow-y-auto">
                {(u.skills || []).map((sk) => (
                  <Badge key={sk._id || sk} variant="secondary" className="text-[10px] bg-muted text-foreground text-nowrap">
                    {sk.name || sk}
                  </Badge>
                ))}
                {(u.skills || []).length === 0 && "-"}
              </div>
            </td>
            <td className="px-4 py-3 min-w-[150px]">
              <div className="flex flex-wrap gap-1 max-w-[200px] max-h-20 overflow-y-auto">
                {(u.preferredLanguages || []).map((lang) => (
                  <Badge key={lang} variant="outline" className="text-[10px] text-nowrap">
                    {lang}
                  </Badge>
                ))}
                {(u.preferredLanguages || []).length === 0 && "-"}
              </div>
            </td>
            <td className="px-2 py-1 min-w-[280px]">
              <div className="flex flex-wrap gap-1 px-2 py-2 max-w-[350px] max-h-20 overflow-y-auto ">
                {u.permissions
                  ?.map(
                    (p) =>
                      apiPermissionOptions.find((a) => a.value === p)?.label,
                  )
                  .map((p, pi) => (
                    <Badge
                      key={pi}
                      variant="outline"
                      className="text-[10px] bg-primary/10 text-primary text-nowrap"
                    >
                      {p}
                    </Badge>
                  ))}
              </div>
            </td>
            <td className="px-4 py-3 text-xs text-muted-foreground">
              {u.lastLogin}
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
                {u?.status?.toLowerCase()}
              </Badge>
            </td>
            <td className="px-4 py-3 text-center bg-white dark:bg-[#0f1729] sticky right-0">
              <div className="flex gap-1 justify-center">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStatus && handleToggleStatus(u)}
                  title={u.status === "ACTIVE" ? "Suspend" : "Activate"}
                >
                  <Shield
                    className={`w-4 h-4 ${
                      u.status === "ACTIVE"
                        ? "text-emerald-500"
                        : "text-red-500"
                    }`}
                  />
                </Button> */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView && handleView({ ...u })}
                  title="View User"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditUser && setEditUser({ ...u })}
                  title="Edit User"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete && handleDelete(u)}
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                {hasPermission(PERMISSIONS.LOGOUT_USERS) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleLogoutClick && handleLogoutClick(u)
                        }
                        className="text-red-600 focus:text-red-700 cursor-pointer"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
