import { SubscriptionType } from "@/types/subscription/subscription.type";

export type NotificationType = {
  id: number;
  message: string;
  subscription: SubscriptionType;
  is_read: boolean;
  created_at: number;
};
