import http from "@/api/http.api";
import { ApiResponseType } from "@/types/common/common.type";
import {
  CreatePackageCategoryRequestType,
  PackageCategoryType,
  UpdatePackageCategoryRequestType,
} from "@/types/package-category/package-category.type";

export const packageCategoryApi = {
  create: async (body: CreatePackageCategoryRequestType) => {
    const res = (await http.post(
      "/package-categories",
      body
    )) as ApiResponseType<PackageCategoryType>;
    return res.data;
  },
  update: async (id: number, body: UpdatePackageCategoryRequestType) => {
    const res = (await http.put(
      `/package-categories/${id}`,
      body
    )) as ApiResponseType<null>;
    return res.data;
  },
  getAll: async () => {
    const res = (await http.get("/package-categories")) as ApiResponseType<
      PackageCategoryType[]
    >;
    return res.data;
  },
  getById: async (id: number) => {
    const res = (await http.get(
      `/package-categories/${id}`
    )) as ApiResponseType<PackageCategoryType>;
    return res.data;
  },
  delete: async (id: number) => {
    const res = (await http.delete(
      `/package-categories/${id}`
    )) as ApiResponseType<null>;
    return res.data;
  },
};
