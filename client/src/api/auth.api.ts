import api from "./axios";

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "developer" | "client";
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
}


export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export const forgotPassword = async (
  data: ForgotPasswordData,
) => {
  const response = await api.post(
    "/auth/forgot-password",
    data,
  );

  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordData,
) => {
  const response = await api.post(
    "/auth/reset-password",
    data,
  );

  return response.data;
};
