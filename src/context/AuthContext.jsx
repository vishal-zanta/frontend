import { createContext, useState, useContext } from "react";

const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const hasPermission = (permission) => {
    // console.log("CHECKING PERMISSION", {permission, profile})
    const validPermissions = profile?.role?.permissions || [];
    if (validPermissions.includes("ALL") || permission == undefined)
      return true;
    if (!permission) return false;
    if (Array.isArray(permission)) {
      return permission.some((p) => validPermissions.includes(p));
    }
    return validPermissions.includes(permission);
  };
  return (
    <authContext.Provider value={{ profile, setProfile, hasPermission }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
