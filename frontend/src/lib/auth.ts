import http from "./http";

export interface LoginResponse {
  token: string;
  id: number;
  profile: string;
  name: string;
  email: string;
  photo: string | null;
}

export const login = async (email: string, password: string) => {
  const response = await http.post<LoginResponse>('/auth', { email, password });
  return response.data;
};

const AuthService = {
  login,
};

export default AuthService;
