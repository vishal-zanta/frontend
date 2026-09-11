import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/auth.api";
import FullScreenLoader from "./FullScreenLoader";
import { useEffect, useState } from "react";
import RoleSelect from "../pages/RoleSelect";
const getLatestRole = () => {
  const roleValue = localStorage.getItem("role");
  if (!roleValue) return null;
  try {
    return JSON.parse(roleValue);
  } catch (error) {
    return null;
  }
};

const AdminProtectedRoute = ({ children }) => {
  const { setProfile, profile } = useAuth();

const role = getLatestRole();

  //   const path = window.location;
  //   console.log({path});
  const token =
    localStorage.getItem("usertoken") || sessionStorage.getItem("usertoken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["auth-profile"],
    queryFn: getProfile,
    retry: false,
    gcTime: 0,
    staleTime: 0,
  });


  useEffect(() => {
    if (isLoading || error || !data) return;
    setProfile(data?.data?.data);
    if (data?.data?.data?.roles?.length > 1) {
      if (role) {
        setProfile({ ...data.data.data, role: role });
      }
    } else {
      setProfile({ ...data.data.data, role: data?.data?.data?.roles?.[0] });
      handleSetRole(data?.data?.data?.roles?.[0]);
    }
  }, [isLoading, error, data, setProfile]);

  function handleSetRole(r) {
    // setRole(r);
    localStorage.setItem("role", JSON.stringify(r));
  }

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error || !data) {
    localStorage.removeItem("usertoken");
    sessionStorage.removeItem("usertoken");

    return <Navigate to="/" replace state={{ redirect: false }} />;
  }
  if (!profile?.role) {
    return <RoleSelect handleSetRole={handleSetRole} />;
  }

  return children;
};

export default AdminProtectedRoute;
