import { PackageType } from "@/types/package/package.type";
import { SubscriptionDurationType } from "@/types/subscription-duration/subscription-duration.type";

export type CreateGuestOrderRequestType = {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  payment_method: "cod" | "bank-transfer";
};

export type GuestOrderItemType = {
  id: number;
  guest_order: GuestOrderType;
  package: PackageType;
  subscription_duration: SubscriptionDurationType;
  price_at_purchase: number;
};

export type GuestOrderType = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  total_amount: number;
  order_status: "pending" | "processing" | "completed" | "cancelled";
  payment_method: "cod" | "bank-transfer";
  created_at: number;
  guest_order_item: GuestOrderItemType[];
};
