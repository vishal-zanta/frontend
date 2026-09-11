import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FullScreenLoader from "./FullScreenLoader";
import NotAuthorized from "../pages/NotAuthorized";

export default function PermissionChecker({ permission, children }) {
  const { hasPermission, profile } = useAuth();

  if (!profile) {
    return <FullScreenLoader />;
  }

  const isAllowed = hasPermission(permission);
  console.log({ isAllowed, permission, profile });
  if (!isAllowed) {
    return <NotAuthorized />;
  }

  return children;
}
