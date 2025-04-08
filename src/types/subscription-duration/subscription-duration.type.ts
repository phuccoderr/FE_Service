export type CreateSubscriptionDurationRequestType = {
  months: number;
  discount_percentage: number;
};

export type UpdateSubscriptionDurationRequestType = {
  months?: number;
  discount_percentage?: number;
};

export type SubscriptionDurationType = {
  id: number;
  months: number;
  discount_percentage: number;
};
