import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { apiPermissionOptions } from "@/utils/constants";

export default function UserManageTable({
  users = [],
  handleToggleStatus,
  setEditUser,
  handleDelete,
  handleView,
  handleLogoutClick,
}) {
  return (
    
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">District</th>
              <th className="px-4 py-3 font-medium">Permissions</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
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
                      <div className="text-xs text-muted-foreground">
                        {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                {u?.role &&   <Badge variant="outline" className="text-xs">
                    {u.role}
                  </Badge>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.district}</td>
                <td className="px-2  ">
                  <div className="flex flex-wrap gap-1 px-2 py-3 max-h-20 overflow-y-auto ">
                    {u.permissions.map((p)=> apiPermissionOptions.find(a=>a.value ===p)?.label).map((p, pi) => (
                      <Badge
                        key={pi}
                        variant="outline"
                        className="text-[10px] bg-blue-50 text-primary"
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
                        ? "bg-emerald-50 text-emerald-700"
                        : u.status === "inactive"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {u?.status?.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-1 justify-center">
                    <Button
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
                    </Button>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleLogoutClick && handleLogoutClick(u)}
                          className="text-red-600 focus:text-red-700 cursor-pointer"
                        >
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
     
  );
}
