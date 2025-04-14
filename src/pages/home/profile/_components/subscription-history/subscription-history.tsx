import { subscriptionApi } from "@/api/subscription/subscription.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { SubscriptionType } from "@/types/subscription/subscription.type";
import { formatDateTimestamp } from "@/utils/format.util";
import { useQuery } from "@tanstack/react-query";
import {
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  TableProps,
} from "antd";
import { useState } from "react";
import { ExclamationCircleFilled, EyeOutlined } from "@ant-design/icons";
import { queryClient } from "@/query-client";

export default function SubscriptionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: subscriptions } = useQuery({
    queryKey: [TANSTACK_KEY.SUBSCRIPTION_ALL],
    queryFn: () => subscriptionApi.getByMe(),
  });

  const filteredData = subscriptions?.filter((sub) =>
    sub.package.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showChangeOrderStatusConfirm = (
    id: number,
    status: "active" | "expired" | "cancelled"
  ) => {
    Modal.confirm({
      title: "Thay đổi trạng thái dịch vụ gói cước",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc chắn muốn thay đổi trạng thái dịch vụ gói cước ?",
      onOk: async () => {
        try {
          await subscriptionApi.updateStatus(id, { status });
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.SUBSCRIPTION_ALL],
          });
          message.success("Thay đổi trạng thái dịch vụ gói cước thành công");
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const columns: TableProps<SubscriptionType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "package",
      key: "package",
      render: (_, record) => <span>{record.package.name}</span>,
    },
    {
      title: "Data hiện còn",
      dataIndex: "data_remaining",
      key: "data_remaining",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (_, record) => (
        <span>
          {formatDateTimestamp(record.start_date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },

    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (_, record) => (
        <span>
          {formatDateTimestamp(record.end_date).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "order_status",
      key: "order_status",
      width: 200,
      render: (_, record) => (
        <Select
          value={record.status}
          style={{ width: "100%" }}
          onChange={(value) => showChangeOrderStatusConfirm(record.id, value)}
          disabled={record.status === "cancelled"}
          options={[
            { value: "active", label: "Đang hoạt động" },
            { value: "cancelled", label: "Huỷ bỏ dịch vụ" },
          ]}
        />
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Input
          placeholder="Tìm kiếm thông tin hoá đơn tên, số điện thoại, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Col>
      <Col span={24}>
        <Table<SubscriptionType>
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
        />
      </Col>
    </Row>
  );
}
