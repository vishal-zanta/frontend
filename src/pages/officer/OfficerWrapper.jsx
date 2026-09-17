import React from "react";
import { Outlet } from "react-router-dom";
import ScheduledVisitsDialog from "./officer-popups/ScheduledVisitsDialog";

const OfficerWrapper = () => {
  return (
    <>
      <Outlet />
      <ScheduledVisitsDialog />
    </>
  );
};

export default OfficerWrapper;