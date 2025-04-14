import http from "@/api/http.api";
import { ApiResponseType } from "@/types/common/common.type";
import { SubscriptionType } from "@/types/subscription/subscription.type";

export const subscriptionApi = {
  getByMe: async () => {
    const res = (await http.get(`/subscriptions/me`)) as ApiResponseType<
      SubscriptionType[]
    >;
    return res.data;
  },
  updateStatus: async (
    id: number,
    body: { status: "active" | "expired" | "cancelled" }
  ) => {
    const res = (await http.put(
      `/subscriptions/${id}`,
      body
    )) as ApiResponseType<null>;
    return res.data;
  },
};
