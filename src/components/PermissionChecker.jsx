import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FullScreenLoader from "./FullScreenLoader";

export default function PermissionChecker({ permission, children }) {
  const { hasPermission, profile } = useAuth();

  if (!profile) {
    return <FullScreenLoader />;
  }

  const isAllowed = hasPermission(permission);
  console.log({isAllowed, permission, profile})
  if (!isAllowed) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
