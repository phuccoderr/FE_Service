import http from "@/api/http.api";
import { ApiResponseType } from "@/types/common/common.type";
import { NotificationType } from "@/types/notification/notification.type";

export const notificationApi = {
  getByMe: async () => {
    const res = (await http.get(`/notifications/me`)) as ApiResponseType<
      NotificationType[]
    >;
    return res.data;
  },
};
