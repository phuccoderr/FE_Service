import {
  LoginResponseType,
  LoginUserRequestType,
  RegisterUserRequestType,
  UpdateUserRequestType,
  UserType,
} from "@/types/user/user.type";
import http from "../http.api";
import { ApiResponseType } from "@/types/common/common.type";

export const userApi = {
  login: async (body: LoginUserRequestType) => {
    const res = (await http.post(
      "/auth/login",
      body
    )) as ApiResponseType<LoginResponseType>;
    return res.data;
  },
  register: async (body: RegisterUserRequestType) => {
    const res = (await http.post(
      "/users/register",
      body
    )) as ApiResponseType<null>;
    return res.data;
  },
  getMe: async () => {
    const res = (await http.get("/users/me")) as ApiResponseType<UserType>;
    return res.data;
  },
  update: async (body: UpdateUserRequestType) => {
    const res = (await http.put("/users", body)) as ApiResponseType<null>;
    return res.data;
  },
};
