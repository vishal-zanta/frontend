import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import FullScreenLoader from "./FullScreenLoader";
import NotAuthorized from "../pages/NotAuthorized";

export default function PermissionChecker({
  permission,
  rolePermission,
  children,
}) {
  const { hasPermission, profile, hasRolePermission } = useAuth();

  if (!profile) {
    return <FullScreenLoader />;
  }

  const isAllowed =
    (permission ? hasPermission(permission) : true) &&
    (rolePermission ? hasRolePermission(rolePermission) : true);

  // console.log({ isAllowed, permission, profile });
  if (!isAllowed) {
    return <NotAuthorized />;
  }

  return children;
}
