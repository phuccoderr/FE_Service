import { Flex } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

export default function Thank() {
  return (
    <Flex justify="center" align="center" className="min-h-screen">
      <Flex vertical gap={12} align="center">
        <CheckCircleOutlined
          style={{ fontSize: "64px", color: "oklch(79.2% 0.209 151.711)" }}
        />
        <span className="text-3xl text-green-400 font-semibold">
          Cảm ơn bạn đã đặt hàng
        </span>
        <span className="text-sm">
          Đơn hàng của bạn đã được xác nhận thành công.
        </span>
      </Flex>
    </Flex>
  );
}
