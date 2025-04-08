import http from "@/api/http.api";
import { ApiResponseType } from "@/types/common/common.type";
import {
  CreatePackageFeatureRequestType,
  PackageFeatureType,
  UpdatePackageFeatureRequestType,
} from "@/types/package-feature/package-feature.type";

export const packageFeatureApi = {
  create: async (body: CreatePackageFeatureRequestType) => {
    const res = (await http.post(
      "/package-features",
      body
    )) as ApiResponseType<PackageFeatureType>;
    return res.data;
  },
  update: async (id: number, body: UpdatePackageFeatureRequestType) => {
    const res = (await http.put(
      `/package-features/${id}`,
      body
    )) as ApiResponseType<null>;
    return res.data;
  },
  delete: async (id: number) => {
    const res = (await http.delete(
      `/package-features/${id}`
    )) as ApiResponseType<null>;
    return res.data;
  },
  getAll: async () => {
    const res = (await http.get("/package-features")) as ApiResponseType<
      PackageFeatureType[]
    >;
    return res.data;
  },
  getOneById: async (id: number) => {
    const res = (await http.get(
      `/package-features/${id}`
    )) as ApiResponseType<PackageFeatureType>;
    return res.data;
  },
};
