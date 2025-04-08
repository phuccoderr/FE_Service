import { SubscriptionDurationType } from "./../../types/subscription-duration/subscription-duration.type";
import http from "@/api/http.api";
import { ApiResponseType } from "@/types/common/common.type";
import {
  CreateSubscriptionDurationRequestType,
  UpdateSubscriptionDurationRequestType,
} from "@/types/subscription-duration/subscription-duration.type";

export const subscriptionDurationApi = {
  create: async (body: CreateSubscriptionDurationRequestType) => {
    const res = (await http.post(
      "/subscription-durations",
      body
    )) as ApiResponseType<SubscriptionDurationType>;
    return res.data;
  },
  update: async (id: number, body: UpdateSubscriptionDurationRequestType) => {
    const res = (await http.put(
      `/subscription-durations/${id}`,
      body
    )) as ApiResponseType<null>;
    return res.data;
  },
  delete: async (id: number) => {
    const res = (await http.delete(
      `/subscription-durations/${id}`
    )) as ApiResponseType<null>;
    return res.data;
  },
  getAll: async () => {
    const res = (await http.get("/subscription-durations")) as ApiResponseType<
      SubscriptionDurationType[]
    >;
    return res.data;
  },
  getOneById: async (id: number) => {
    const res = (await http.get(
      `/subscription-durations/${id}`
    )) as ApiResponseType<SubscriptionDurationType>;
    return res.data;
  },
};
