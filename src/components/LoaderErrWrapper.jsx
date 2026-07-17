import React from "react";
import { ClipLoader } from "react-spinners";

const LoaderErrWrapper = ({ isLoading, error, children }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-4">
        <ClipLoader color="#0A5ADB" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-40">
        <p className="text-red-500 text-lg font-semibold">{ error?.response?.data?.message  ||error?.message || error}</p>
      </div>
    );
  }

  return children;
};

export default LoaderErrWrapper;