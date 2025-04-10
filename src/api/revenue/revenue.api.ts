import http from "@/api/http.api";
import { ApiResponseType } from "@/types/common/common.type";
import {
  GetRevenueRequestType,
  RevenueType,
} from "@/types/revenue/revenue.type";

export const revenueApi = {
  getByPeriod: async (params: GetRevenueRequestType) => {
    const res = (await http.get("/revenue/chart", {
      params,
    })) as ApiResponseType<RevenueType>;

    return res.data;
  },
};
