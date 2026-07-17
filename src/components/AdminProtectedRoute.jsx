import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../api/auth.api";
import FullScreenLoader from "./FullScreenLoader";
import { useEffect } from "react";

const AdminProtectedRoute = ({ children }) => {
  const { setProfile } = useAuth();
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
  });

  useEffect(() => {
    if (isLoading || error || !data) return;
    setProfile(data?.data?.data);
  }, [isLoading, error, data, setProfile]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (error || !data) {
    localStorage.removeItem("usertoken");
    sessionStorage.removeItem("usertoken");

    return <Navigate to="/" replace state={{ redirect: false }} />;
  }

  return children;
};

export default AdminProtectedRoute;
