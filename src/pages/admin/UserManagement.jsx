import React, { useState } from "react";
import { Users, Plus, Search, Shield, Edit, Trash2, UserPlus, X, Save, Check } from "lucide-react";
import { SYSTEM_USERS } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const roles = ["Super Admin", "Admin", "SUDA Admin", "Division Admin", "ULB Admin", "L2 Officer", "L1 Officer", "CC Supervisor", "CCE Agent"];

export default function UserManagement() {
  const [users, setUsers] = useState(SYSTEM_USERS);
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "L1 Officer", district: "Patna" });
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const filtered = users.filter(u =>
    (filterRole === "all" || u.role === filterRole) &&
    (!searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveEdit = () => {
    setUsers(prev => prev.map(u => u.id === editUser.id ? editUser : u));
    showToast(`${editUser.name} updated successfully`);
    setEditUser(null);
  };

  const handleDelete = (user) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    showToast(`${user.name} deleted`);
  };

  const handleToggleStatus = (user) => {
    const newStatus = user.status === "Active" ? "Suspended" : "Active";
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    showToast(`${user.name} ${newStatus === "Active" ? "activated" : "suspended"}`);
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const id = `usr-${String(users.length + 1).padStart(3, "0")}`;
    setUsers(prev => [...prev, { ...newUser, id, status: "Active", lastLogin: "Never", permissions: ["Dashboard"] }]);
    showToast(`${newUser.name} added successfully`);
    setNewUser({ name: "", email: "", role: "L1 Officer", district: "Patna" });
    setAddUserOpen(false);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <SectionTitle title="User Management & RBAC" subtitle="Manage call-centre agents, supervisors, monitoring team & system admins with role-based access control" />
          <div className="flex gap-2">
            <Button onClick={() => setAddUserOpen(true)} className="bg-primary hover:bg-primary/90"><UserPlus className="w-4 h-4 mr-1" /> Add User</Button>
            <Button onClick={() => { setNewUser({ name: "", email: "", role: "Super Admin", district: "Statewide" }); setAddUserOpen(true); }} className="bg-amber-600 hover:bg-amber-700 text-white"><Shield className="w-4 h-4 mr-1" /> Create Super Admin</Button>
          </div>
        </div>

        {toast && (
          <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or email..." className="pl-9" />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-48 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-sm">All Roles</SelectItem>
              {roles.map(r => <SelectItem key={r} value={r} className="text-sm">{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Users table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">District</th>
                  <th className="px-4 py-3 font-medium">Permissions</th>
                  <th className="px-4 py-3 font-medium">Last Login</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                          {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{u.role}</Badge></td>
                    <td className="px-4 py-3 text-muted-foreground">{u.district}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.permissions.map((p, pi) => (
                          <Badge key={pi} variant="outline" className="text-[10px] bg-blue-50 text-primary">{p}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastLogin}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${u.status === "Active" ? "bg-emerald-50 text-emerald-700" : u.status === "Inactive" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>
                        {u.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(u)} title={u.status === "Active" ? "Suspend" : "Activate"}>
                          <Shield className={`w-4 h-4 ${u.status === "Active" ? "text-emerald-500" : "text-red-500"}`} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditUser({ ...u })} title="Edit User">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(u)} title="Delete User">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit User Dialog */}
        <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
            {editUser && (
              <div className="space-y-4">
                <div>
                  <Label className="mb-1.5 block">Name</Label>
                  <Input value={editUser.name} onChange={e => setEditUser({ ...editUser, name: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Email</Label>
                  <Input value={editUser.email} onChange={e => setEditUser({ ...editUser, email: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Role</Label>
                  <Select value={editUser.role} onValueChange={v => setEditUser({ ...editUser, role: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roles.map(r => <SelectItem key={r} value={r} className="text-sm">{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">District</Label>
                  <Input value={editUser.district} onChange={e => setEditUser({ ...editUser, district: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-1.5 block">Status</Label>
                  <Select value={editUser.status} onValueChange={v => setEditUser({ ...editUser, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active" className="text-sm">Active</SelectItem>
                      <SelectItem value="Inactive" className="text-sm">Inactive</SelectItem>
                      <SelectItem value="Suspended" className="text-sm">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setEditUser(null)}>Cancel</Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleSaveEdit}><Save className="w-4 h-4 mr-1" /> Save</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Name</Label>
                <Input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Enter full name" />
              </div>
              <div>
                <Label className="mb-1.5 block">Email</Label>
                <Input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="email@bihar.gov.in" />
              </div>
              <div>
                <Label className="mb-1.5 block">Role</Label>
                <Select value={newUser.role} onValueChange={v => setNewUser({ ...newUser, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r} value={r} className="text-sm">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1.5 block">District</Label>
                <Input value={newUser.district} onChange={e => setNewUser({ ...newUser, district: e.target.value })} placeholder="District" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setAddUserOpen(false)}>Cancel</Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleAddUser} disabled={!newUser.name || !newUser.email}><UserPlus className="w-4 h-4 mr-1" /> Add User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* RBAC info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h4 className="font-bold text-primary mb-2 text-sm flex items-center gap-2"><Shield className="w-4 h-4" /> Role-Based Access Control (RBAC)</h4>
          <p className="text-sm text-primary">Secure role-based access control is enforced for State CC agents, field officers, Nodal Officers, State Monitoring Teams, and System Admins. Each role has predefined permission scopes - customizable per user via the Manage Links section.</p>
        </div>
      </div>
    </PortalLayout>
  );
}