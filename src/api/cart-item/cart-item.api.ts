import http from "@/api/http.api";
import {
  CartItemType,
  CreateCartItemRequestType,
  DeleteCartItemRequestType,
} from "@/types/cart-item/cart-item.type";
import { ApiResponseType } from "@/types/common/common.type";

export const cartItemApi = {
  create: async (body: CreateCartItemRequestType) => {
    const res = (await http.post(
      "/cart-items",
      body
    )) as ApiResponseType<CartItemType>;
    return res.data;
  },
  delete: async (params: DeleteCartItemRequestType) => {
    const res = (await http.delete("/cart-items", {
      params,
    })) as ApiResponseType<null>;
    return res.data;
  },
  getAllByUserId: async () => {
    const res = (await http.get("/cart-items")) as ApiResponseType<
      CartItemType[]
    >;
    return res.data;
  },
};
