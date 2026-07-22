import React from "react";
import {
  Users,
  Activity,
  Lock,
  PhoneCall,
  PhoneOutgoing,
  UserCheck,
  Phone,
  Settings,
  Coffee,
  Clock,
  Hourglass,
} from "lucide-react";
import StatCard from "@/components/StatCard";

export default function RealTimeStats() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
        <div className="w-1.5 h-4 bg-primary rounded-full" />
        Real-Time Agent & Call Volume Stats
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
        <StatCard
          icon={Users}
          label="Total Active Agents"
          value="161"
          color="green"
        />
        <StatCard
          icon={Activity}
          label="IVRS Hits"
          value="47,320"
          color="purple"
          sublabel="Data for: 07 Jul 2026"
        />
        <StatCard
          icon={Lock}
          label="Role Logins"
          value="Manager: 3/5"
          color="blue"
          sublabel="Supervisor: 6/31"
        />
        <StatCard
          icon={PhoneCall}
          label="In-Bound Calls"
          value="8,444"
          color="red"
        />
        <StatCard
          icon={PhoneOutgoing}
          label="Out-Bound Calls"
          value="3,361"
          color="sky"
        />
        <StatCard
          icon={UserCheck}
          label="Ready"
          value="69"
          color="amber"
        />
        <StatCard
          icon={Phone}
          label="In-Call"
          value="81"
          color="purple"
        />
        <StatCard
          icon={Settings}
          label="Others"
          value="6"
          color="blue"
        />
        <StatCard
          icon={Coffee}
          label="Break"
          value="5"
          color="red"
        />
        <StatCard
          icon={Clock}
          label="Longest Call"
          value="00:18:43"
          color="purple"
        />
        <StatCard
          icon={Phone}
          label="Avg Talk Time (S)"
          value="222.00"
          color="sky"
          sublabel="Data for: 07 Jul 2026"
        />
        <StatCard
          icon={Hourglass}
          label="Avg Wait Time (S)"
          value="5.67"
          color="amber"
          sublabel="Data for: 07 Jul 2026"
        />
      </div>
    </div>
  );
}
