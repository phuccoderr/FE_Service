export type GetRevenueRequestType = {
  period: "30days" | "6months" | "1year";
};

export type RevenueType = {
  labels: string[];
  data: number[];
};
