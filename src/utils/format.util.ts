import { PackageType } from "@/types/package/package.type";
import { SubscriptionDurationType } from "@/types/subscription-duration/subscription-duration.type";

export const calcPrice = (price: number, discount: number): number =>
  (price * (100 - discount)) / 100;

export const calcPriceWithSubscriptionDuration = (
  packagee: PackageType | undefined,
  subscriptionDuration: SubscriptionDurationType | undefined
): number => {
  if (!packagee || !subscriptionDuration) return 0;
  const discountPrice = calcPrice(packagee.price, packagee.discount);

  const price = discountPrice * subscriptionDuration.months;

  return calcPrice(price, subscriptionDuration.discount_percentage);
};

export function formatDateTimestamp(timestamp: number | null) {
  if (timestamp) {
    return new Date(timestamp * 1000);
  }
  return new Date();
}
