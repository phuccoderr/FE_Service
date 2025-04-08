import http from "@/api/http.api";
import { ApiResponseType } from "@/types/common/common.type";
import {
  CreatePackageRequestType,
  GetAllPackagesResponseType,
  PackageType,
  UpdatePackageRequestType,
} from "@/types/package/package.type";

export const packageApi = {
  create: async (body: CreatePackageRequestType) => {
    const res = (await http.post(
      "/packages",
      body
    )) as ApiResponseType<PackageType>;
    return res.data;
  },
  update: async (id: number, body: UpdatePackageRequestType) => {
    const res = (await http.put(
      `/packages/${id}`,
      body
    )) as ApiResponseType<null>;
    return res.data;
  },
  delete: async (id: number) => {
    const res = (await http.delete(`/packages/${id}`)) as ApiResponseType<null>;
    return res.data;
  },
  getAll: async (params?: GetAllPackagesResponseType) => {
    const res = (await http.get("/packages", { params })) as ApiResponseType<
      PackageType[]
    >;
    return res.data;
  },
  getOneById: async (id: number) => {
    const res = (await http.get(
      `/packages/${id}`
    )) as ApiResponseType<PackageType>;
    return res.data;
  },
};
