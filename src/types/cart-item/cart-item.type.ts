import { PackageType } from "@/types/package/package.type";
import { SubscriptionDurationType } from "@/types/subscription-duration/subscription-duration.type";

export type CreateCartItemRequestType = {
  package_id: number;
  subscription_duration_id: number;
};

export type DeleteCartItemRequestType = {
  package_id: number;
};

export type CartItemType = {
  id: number;
  package: PackageType;
  subscription_duration: SubscriptionDurationType;
};
