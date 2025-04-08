import { PackageType } from "@/types/package/package.type";

export type SubscriptionType = {
  id: number;
  package: PackageType;
  start_date: number;
  end_date: number;
  status: "active" | "expired" | "cancelled";
  data_remaining: number;
};
