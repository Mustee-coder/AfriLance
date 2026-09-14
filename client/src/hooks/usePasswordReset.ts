import { useMutation } from "@tanstack/react-query";

import {
  forgotPassword,
  resetPassword,
} from "@/api/auth.api";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};