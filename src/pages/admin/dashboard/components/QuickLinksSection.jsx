import React from "react";
import { Link } from "react-router-dom";
import { Activity, TrendingUp, Newspaper, Users, ArrowRight } from "lucide-react";

const quickLinks = [
  {
    label: "Operational Dashboards",
    path: "/admin/operational",
    icon: Activity,
    color: "bg-blue-50 text-primary dark:bg-blue-950/30 dark:text-blue-400",
  },
  {
    label: "AI Analytical Reports",
    path: "/admin/ai-reports",
    icon: TrendingUp,
    color: "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400",
  },
  {
    label: "MIS Reports",
    path: "/admin/mis",
    icon: Newspaper,
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
  },
  {
    label: "User Management",
    path: "/admin/users",
    icon: Users,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
  },
];

export default function QuickLinksSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {quickLinks.map((q, i) => {
        const Icon = q.icon;
        return (
          <Link
            key={i}
            to={q.path}
            className="bg-white dark:bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all flex items-center gap-3 group"
          >
            <div
              className={`w-9 h-9 rounded-lg ${q.color} flex items-center justify-center`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-foreground flex-1">
              {q.label}
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        );
      })}
    </div>
  );
}
