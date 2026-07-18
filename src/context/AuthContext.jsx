import { checkPermissionManual } from "@/utils/helpers";
import { createContext, useState, useContext } from "react";

const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  console.log({profile})

  const hasPermission = (permission) => {
    // console.log("CHECKING PERMISSION", {permission, profile})
    const validPermissions = profile?.role?.permissions || [];


   return checkPermissionManual(validPermissions, permission)
  };
  const profiledata = {
    role : profile?.role?.designationEnglish,
  }
  return (
    <authContext.Provider value={{ profile, setProfile, hasPermission, profiledata }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
