import FullScreenLoader from "@/components/FullScreenLoader";
import useGetRoles from "@/hooks/query/useGetRoles";
import {
  CCE_ONLY_ROLES,
  CCE_ROLES,
  CCS_ONLY_ROLES,
  MAX_LIMIT,
  USER_ROLES_EXECULDED,
} from "@/utils/constants";
import { checkPermissionManual } from "@/utils/helpers";
import { createContext, useState, useContext, useEffect, useRef, useMemo } from "react";
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

  const hasRolePermission = ({ exclude = null, include = null }) => {
    if (!profile?.role) return false;
    const role = profile?.role?.designationEnglish;
    if (!!exclude) {
      return !exclude.includes(role);
    }
    if (!!include) {
      return include.includes(role);
    }
    return false;
  };
  const profiledata = {
    role: profile?.role?.designationEnglish,
    isAdmin: profile?.role?.designationEnglish === USER_ROLES_EXECULDED?.[0],
    isCRM: CCE_ROLES.includes(profile?.role?.designationEnglish),
    isOfficer: !USER_ROLES_EXECULDED.includes(
      profile?.role?.designationEnglish,
    ),
    isMultiRoles: Array.isArray(profile?.roles)
      ? profile?.roles?.length > 1
      : false,
    isCCE: CCE_ONLY_ROLES.includes(profile?.role?.designationEnglish),
    isCCS: CCS_ONLY_ROLES.includes(profile?.role?.designationEnglish),
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

  const { data } = useGetRoles([], { page: 1, limit: MAX_LIMIT }, !!profile);
  const rolesMap = useMemo(()=> {
const rolesMap = new Map();
  (data?.data?.docs || []).forEach((role) => {
    rolesMap.set(role.designationEnglish, role?._id);
  });
  return rolesMap;
  },[data?.data?.docs]) 

  // console.log({rolesMap});


  return (
    <authContext.Provider
      value={{
        profile,
        setProfile,
        hasPermission,
        profiledata,
        setNewPath,
        hasRolePermission,
        rolesMap
      }}
    >
      {newPath && newPath?.isLoading && <FullScreenLoader />}
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
