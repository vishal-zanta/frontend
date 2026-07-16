import React, { useState } from "react";
import { UserCog, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MySelect from "@/components/inputs/MySelect";

export default function QuickTagOfficer({ officers = [], subservices = [], handleSaveTagging }) {
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedSubservices, setSelectedSubservices] = useState([]);
  const [wards, setWards] = useState("");

  const handleSubmit = () => {
    if (!selectedOfficer || selectedSubservices.length === 0 || !wards.trim()) {
      return;
    }
    handleSaveTagging({
      officer: selectedOfficer,
      services: selectedSubservices,
      wards: wards.split(",").map((w) => w.trim()).filter(Boolean),
    });
    // Clear state
    setSelectedOfficer("");
    setSelectedSubservices([]);
    setWards("");
  };

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <UserCog className="w-5 h-5 text-blue-500" /> Quick Tag Officer
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <MySelect
            label="Select Officer *"
            options={officers}
            value={selectedOfficer}
            onValueChange={setSelectedOfficer}
            placeholder="Select officer..."
          />
        </div>
        <div>
          <MySelect
            label="Sub-services (Multi-select) *"
            isMultiple
            options={subservices}
            value={selectedSubservices}
            onValueChange={setSelectedSubservices}
            placeholder="Select sub-services..."
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Wards (Comma-separated) <span className="text-red-500">*</span></label>
          <Input
            value={wards}
            onChange={(e) => setWards(e.target.value)}
            placeholder="e.g., Patna Ward-12, Patna Ward-13"
          />
          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Manual entry due to location restriction
          </div>
        </div>
      </div>
      <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleSubmit}>
        <Save className="w-4 h-4 mr-1" /> Save Tagging
      </Button>
    </div>
  );
}
