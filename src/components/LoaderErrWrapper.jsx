import React from "react";
import { ClipLoader } from "react-spinners";

const LoaderErrWrapper = ({ isLoading, error, children, customLoader, loadingText = "Loading..." }) => {
  if (isLoading) {
    if (customLoader) return customLoader;
    return (
      <div className="flex items-center flex-col gap-1 justify-center h-full py-4">
        <ClipLoader color="#0A5ADB" size={32} />
        <p className="text-foreground text-sm font-medium">{loadingText}</p>
      </div>
    );
  }

  if (error) {
    let msg =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error == "string" ? error : "Something went wrong !!!");
    if (msg.includes("Requires permission:")) {
      msg =
        " You do not have access to this module. Please contact your administrator.";
    }
    return (
      <div className="flex items-center justify-center h-full min-h-40">
        <p className="text-red-500 text-lg font-semibold">⚠{" "}{msg}</p>
      </div>
    );
  }

  return children;
};

export default LoaderErrWrapper;
