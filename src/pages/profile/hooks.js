import { useMutation } from "@tanstack/react-query";
import { patchUserProfile } from "./api";

export const useUpdateProfile = (options = {}) => {
  return useMutation({
    mutationFn: patchUserProfile,
    ...options,
  });
};
