import FullScreenLoader from "@/components/FullScreenLoader";
import { USER_ROLES_EXECULDED } from "@/utils/constants";
import { checkPermissionManual } from "@/utils/helpers";
import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [newPath, setNewPath] = useState(null);
  const nav = useNavigate();
  const timerRef = useRef();
  console.log({ profile });

  const hasPermission = (permission) => {
    // console.log("CHECKING PERMISSION", {permission, profile})
    // const validPermissions = Array.isArray(profile?.roles)
    //   ? (profile?.roles?.map((v) => v?.permissions) || []).flat()
    //   :  [];
    const validPermissions = profile?.role?.permissions || [];
    // console.log({
    //   validPermissions,
    //   permission,
    //   role: profile.role,
    //   roles: profile.roles,
    // });
    return checkPermissionManual(validPermissions, permission);
  };
  const profiledata = {
    role: profile?.role?.designationEnglish,
    isAdmin: profile?.role?.designationEnglish === USER_ROLES_EXECULDED?.[0],
    isCRM:
      profile?.role?.designationEnglish === USER_ROLES_EXECULDED?.[1] ||
      profile?.role?.designationEnglish === USER_ROLES_EXECULDED?.[2],
    isOfficer: !USER_ROLES_EXECULDED.includes(
      profile?.role?.designationEnglish,
    ),
    isMultiRoles: Array.isArray(profile?.roles)
      ? profile?.roles?.length > 1
      : false,
  };

  useEffect(() => {
    if (!!profile && !!newPath) {
      // console.log("Navigating", profile);
      timerRef.current = setTimeout(() => {
        nav(newPath.path, { replace: !!newPath.replace });
        setNewPath(null);
      }, 1000);
    }

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [profile, newPath]);
  return (
    <authContext.Provider
      value={{ profile, setProfile, hasPermission, profiledata, setNewPath }}
    >
      {newPath && newPath?.isLoading && <FullScreenLoader />}
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
