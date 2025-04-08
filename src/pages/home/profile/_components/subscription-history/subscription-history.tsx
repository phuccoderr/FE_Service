import { subscriptionApi } from "@/api/subscription/subscription.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { SubscriptionType } from "@/types/subscription/subscription.type";
import { formatDateTimestamp } from "@/utils/format.util";
import { useQuery } from "@tanstack/react-query";
import { Col, Input, Row, Table, TableProps } from "antd";
import { useState } from "react";

export default function SubscriptionHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: subscriptions } = useQuery({
    queryKey: [TANSTACK_KEY.SUBSCRIPTION_ALL],
    queryFn: () => subscriptionApi.getByMe(),
  });

  const filteredData = subscriptions?.filter((sub) =>
    sub.package.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      render: (_, record) => {
        if (record.status === "active") {
          return (
            <span className="text-sm text-green-600 bg-green-200 p-1 rounded">
              Đang hoạt động
            </span>
          );
        } else if (record.status === "expired") {
          return (
            <span className="text-sm text-yellow-600 bg-yellow-200 p-1 rounded">
              Đã hết hạn
            </span>
          );
        } else {
          return (
            <span className="text-sm text-red-600 bg-red-200 p-1 rounded">
              Đã huỷ
            </span>
          );
        }
      },
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
