import http from "@/api/http.api";
import { ApiResponseType } from "@/types/common/common.type";
import {
  CreateGuestOrderRequestType,
  GuestOrderItemType,
  GuestOrderType,
} from "@/types/guest-order/guest-order.type";

export const guestOrderApi = {
  create: async (body: CreateGuestOrderRequestType) => {
    const res = (await http.post(
      "/guest-orders",
      body
    )) as ApiResponseType<GuestOrderType>;
    return res.data;
  },
  getAll: async () => {
    const res = (await http.get("/guest-orders")) as ApiResponseType<
      GuestOrderType[]
    >;
    return res.data;
  },
  getItemById: async (id: number) => {
    const res = (await http.get(
      `/guest-orders/items/${id}`
    )) as ApiResponseType<GuestOrderItemType[]>;
    return res.data;
  },
  getByUser: async () => {
    const res = (await http.get("/guest-orders/user")) as ApiResponseType<
      GuestOrderType[]
    >;
    return res.data;
  },

  updateStatus: async (
    id: number,
    order_status: "pending" | "processing" | "completed" | "cancelled"
  ) => {
    const res = (await http.put(`/guest-orders/${id}`, {
      order_status,
    })) as ApiResponseType<null>;
    return res.data;
  },
};
