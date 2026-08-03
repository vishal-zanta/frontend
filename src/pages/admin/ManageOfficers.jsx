import React, { useState } from "react";
import { Plus, Search, Pencil, Trash2, Check, X } from "lucide-react";
import { OFFICERS, DISTRICTS, SERVICES } from "@/lib/biharData";
import PortalLayout from "@/components/PortalLayout";
import { SectionTitle } from "@/components/ChartCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ExportButton from "@/components/ExportButton";
import { OfficerId } from "@/components/ComplaintDetailDialog";
import { useLanguage } from "@/context/LanguageContext";

const exportColumns = [
  { key: "id", label: "Officer ID" },
  { key: "name", label: "Name" },
  { key: "designationLabel", label: "Designation" },
  { key: "districtName", label: "District" },
  { key: "wards", label: "Wards" },
  { key: "resolved", label: "Resolved" },
  { key: "pending", label: "Pending" },
  { key: "slaBreached", label: "SLA Breached" },
  { key: "status", label: "Status" },
];

export default function ManageOfficers() {
  const { t } = useLanguage();
  const [officers, setOfficers] = useState(
    OFFICERS.map((o) => ({
      ...o,
      districtName:
        DISTRICTS.find((d) => d.id === o.district)?.name || o.district,
    })),
  );
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [dialog, setDialog] = useState(null);
  const [editOfficer, setEditOfficer] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const filtered = officers.filter(
    (o) =>
      !search ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = () => {
    showToast(`Officer ${editOfficer ? "updated" : "added"} successfully`);
    setDialog(null);
    setEditOfficer(null);
  };

  const handleDelete = (officer) => {
    setOfficers((prev) => prev.filter((o) => o.id !== officer.id));
    showToast(`"${officer.name}" deleted`);
  };

  return (
    <PortalLayout role="superadmin">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SectionTitle
          title={t("Manage Officers", "अधिकारी प्रबंधित करें")}
          subtitle={t(
            "CRUD management of all field officers - L1, L2, Zone, Division & SUDA level",
            "क्षेत्रीय अधिकारियों का प्रबंधन - L1, L2, जोन, प्रमंडल और सूडा स्तर",
          )}
        />

        {toast && (
          <div className="fixed top-16 right-6 z-50 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-blue-600">
              {officers.length}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("Total Officers", "कुल अधिकारी")}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-emerald-600">
              {officers.filter((o) => o.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("Active", "सक्रिय")}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-purple-600">
              {
                officers.filter(
                  (o) =>
                    o.designation === "l2-officer" ||
                    o.designation.includes("admin"),
                ).length
              }
            </div>
            <div className="text-sm text-muted-foreground">
              {t("Supervisory+", "पर्यवेक्षी+")}
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="text-2xl font-bold text-amber-600">
              {officers.filter((o) => o.slaBreached > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">
              {t("SLA Breach Risk", "SLA उल्लंघन जोखिम")}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(
                "Search by name or officer ID...",
                "नाम या अधिकारी आईडी से खोजें...",
              )}
              className="pl-9"
            />
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              setEditOfficer(null);
              setDialog({
                name: "",
                designation: "l1-officer",
                designationLabel: "L1 Field Officer",
                district: "patna",
                wards: [],
                services: [],
                mobile: "",
                resolved: 0,
                pending: 0,
                slaBreached: 0,
                status: "active",
              });
            }}
          >
            <Plus className="w-4 h-4 mr-1" />{" "}
            {t("Add Officer", "अधिकारी जोड़ें")}
          </Button>
          <ExportButton
            data={officers}
            columns={exportColumns}
            filename="officers_list"
          />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">
                    {t("Officer ID", "अधिकारी आईडी")}
                  </th>
                  <th className="px-4 py-3 font-medium">{t("Name", "नाम")}</th>
                  <th className="px-4 py-3 font-medium">
                    {t("Designation", "पदनाम")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("Department / Services", "विभाग / सेवाएं")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("District", "जिला")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("Wards", "वार्ड")}
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    {t("Resolved", "निराकृत")}
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    {t("Pending", "लंबित")}
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    {t("SLA Breached", "SLA उल्लंघन")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("Status", "स्थिति")}
                  </th>
                  <th className="px-4 py-3 font-medium text-center">
                    {t("Actions", "कार्रवाई")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((o, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <OfficerId id={o.id} />
                    </td>
                    <td className="px-4 py-3 font-medium">{o.name}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${o.designation === "l1-officer" ? "bg-primary/10 text-primary" : o.designation === "l2-officer" ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}
                      >
                        {o.designationLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {o.services && o.services.length > 0 ? (
                          o.services.map((s) => {
                            const svc = SERVICES.find((sv) => sv.id === s);
                            return (
                              <Badge
                                key={s}
                                variant="outline"
                                className="text-[10px] bg-primary/10 text-primary"
                              >
                                {svc?.name || s}
                              </Badge>
                            );
                          })
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            All (Admin)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {o.districtName}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {o.wards.length > 0 ? o.wards.join(", ") : "-"}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-emerald-600">
                      {o.resolved}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-amber-600">
                      {o.pending}
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-red-600">
                      {o.slaBreached}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${o.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted/50 text-muted-foreground"}`}
                      >
                        {o.status === "active" ? "● Active" : "● Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditOfficer(o);
                            setDialog({ ...o });
                          }}
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDelete(o)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {dialog && (
          <div
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setDialog(null)}
          >
            <div
              className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">
                  {editOfficer ? "Edit Officer" : "Add Officer"}
                </h3>
                <button
                  onClick={() => setDialog(null)}
                  className="p-1.5 hover:bg-muted rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <Label className="mb-1.5 block">
                    Officer Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={dialog.name || ""}
                    onChange={(e) =>
                      setDialog({ ...dialog, name: e.target.value })
                    }
                    placeholder="e.g., Rajesh Kumar Singh"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">Designation</Label>
                  <select
                    className="w-full border border-input rounded-md p-2 text-sm"
                    value={dialog.designation || ""}
                    onChange={(e) => {
                      const des = e.target.value;
                      const label =
                        {
                          "l1-officer": "L1 Field Officer",
                          "l2-officer": "L2 Supervisory Officer",
                          "zone-admin": "Zone Administrator",
                          "ulb-admin": "ULB Administrator",
                          "div-admin": "Divisional Administrator",
                          "suda-admin": "SUDA Administrator",
                        }[des] || des;
                      setDialog({
                        ...dialog,
                        designation: des,
                        designationLabel: label,
                      });
                    }}
                  >
                    <option value="l1-officer">L1 Field Officer</option>
                    <option value="l2-officer">L2 Supervisory Officer</option>
                    <option value="zone-admin">Zone Administrator</option>
                    <option value="ulb-admin">ULB Administrator</option>
                    <option value="div-admin">Divisional Administrator</option>
                    <option value="suda-admin">SUDA Administrator</option>
                  </select>
                </div>
                <div>
                  <Label className="mb-1.5 block">District</Label>
                  <select
                    className="w-full border border-input rounded-md p-2 text-sm"
                    value={dialog.district || "patna"}
                    onChange={(e) =>
                      setDialog({
                        ...dialog,
                        district: e.target.value,
                        districtName: DISTRICTS.find(
                          (d) => d.id === e.target.value,
                        )?.name,
                      })
                    }
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="mb-1.5 block">Mobile</Label>
                  <Input
                    value={dialog.mobile || ""}
                    onChange={(e) =>
                      setDialog({ ...dialog, mobile: e.target.value })
                    }
                    placeholder="+91 94310 12345"
                  />
                </div>
                <div>
                  <Label className="mb-1.5 block">
                    Wards (comma-separated)
                  </Label>
                  <Input
                    value={(dialog.wards || []).join(", ")}
                    onChange={(e) =>
                      setDialog({
                        ...dialog,
                        wards: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="e.g., Patna Ward-12, Patna Ward-13"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="mb-1.5 block">Resolved</Label>
                    <Input
                      type="number"
                      value={dialog.resolved || 0}
                      onChange={(e) =>
                        setDialog({
                          ...dialog,
                          resolved: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">Pending</Label>
                    <Input
                      type="number"
                      value={dialog.pending || 0}
                      onChange={(e) =>
                        setDialog({
                          ...dialog,
                          pending: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 block">SLA Breached</Label>
                    <Input
                      type="number"
                      value={dialog.slaBreached || 0}
                      onChange={(e) =>
                        setDialog({
                          ...dialog,
                          slaBreached: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={dialog.status === "active"}
                    onChange={(e) =>
                      setDialog({
                        ...dialog,
                        status: e.target.checked ? "active" : "inactive",
                      })
                    }
                    className="rounded"
                  />
                  <Label>Active</Label>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDialog(null)}>
                  Cancel
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleSave}
                >
                  <Check className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
