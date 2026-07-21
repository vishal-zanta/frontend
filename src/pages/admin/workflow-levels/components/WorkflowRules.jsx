import React from "react";

const WorkflowRules = () => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
      <h4 className="font-bold text-amber-800 mb-2 text-sm">
        ⚠ Workflow Rules
      </h4>
      <ul className="text-sm text-amber-700 space-y-1">
        <li>
          • If action not taken within SLA time, ticket auto-escalates to next
          level with SMS notification
        </li>
        <li>
          • Every SLA level must have at least 1 officer assigned - or the
          ticket will not be visible
        </li>
        <li>
          • Officers can only be added manually due to location restriction
        </li>
        <li>
          • If a ticket remains unassigned, it can be reassigned later by the
          admin
        </li>
        <li>• Complaints can be transferred department-to-department</li>
      </ul>
    </div>
  );
};

export default WorkflowRules;
