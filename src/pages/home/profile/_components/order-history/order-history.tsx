import { guestOrderApi } from "@/api/guest-order/guest-order.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { GuestOrderType } from "@/types/guest-order/guest-order.type";
import { formatDateTimestamp } from "@/utils/format.util";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Flex, Input, Modal, Row, Table, TableProps } from "antd";
import { useState } from "react";
import { CarOutlined, EyeOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

export default function OrderHistory() {
  const [isModalDetail, setIsModalDetail] = useState(false);
  const [isModalAddress, setIsModalAddress] = useState(false);
  const [textAddress, setTextAddress] = useState("");

  const [guestOrderId, setGuestOrderId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: guestOrderByMe } = useQuery({
    queryKey: [TANSTACK_KEY.GUEST_ORDERS_ME],
    queryFn: () => guestOrderApi.getByUser(),
  });
  const { data: guestOrderItems } = useQuery({
    queryKey: [TANSTACK_KEY.GUEST_ORDER_ONE, guestOrderId],
    queryFn: () => guestOrderApi.getItemById(guestOrderId),
    enabled: !!guestOrderId,
  });

  const filteredData = guestOrderByMe?.filter(
    (guestOrder) =>
      guestOrder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guestOrder.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guestOrder.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hanldeGuestOrderItem = (id: number) => {
    setGuestOrderId(id);
    setIsModalDetail(true);
  };

  const handleModalAddress = (address: string) => {
    setTextAddress(address);
    setIsModalAddress(true);
  };

  const columns: TableProps<GuestOrderType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Họ và tên",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, record) => (
        <span>
          {formatDateTimestamp(record.created_at).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "order_status",
      key: "order_status",
      width: 200,
      render: (_, record) => {
        if (record.order_status === "pending") {
          return (
            <span className="text-sm text-sky-600 bg-sky-200 p-1 rounded">
              Đang chờ xác nhận
            </span>
          );
        } else if (record.order_status === "processing") {
          return (
            <span className="text-sm text-yellow-600 bg-yellow-200 p-1 rounded">
              Đang xử lý
            </span>
          );
        } else if (record.order_status === "completed") {
          return (
            <span className="text-sm text-green-600 bg-green-200 p-1 rounded">
              Hoàn tất
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
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      key: "totaltotal_amount_price",
      render: (_, record) => (
        <span>{Number(record.total_amount).toLocaleString("vi-VN")} VND</span>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Flex gap={4}>
          <Button
            size="small"
            color="primary"
            variant="outlined"
            icon={<EyeOutlined />}
            onClick={() => hanldeGuestOrderItem(record.id)}
          />
          <Button
            size="small"
            color="primary"
            variant="outlined"
            icon={<CarOutlined />}
            onClick={() => handleModalAddress(record.address)}
          />
        </Flex>
      ),
    },
  ];
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            placeholder="Tìm kiếm thông tin hoá đơn tên, số điện thoại, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col span={24}>
          <Table<GuestOrderType>
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
          />
        </Col>
      </Row>
      <Modal
        open={isModalDetail}
        onCancel={() => setIsModalDetail(false)}
        footer={null}
      >
        <span className="text-lg text-sky-500">Chi tiết hoá đơn</span>
        <Row>
          <Col span={24}>
            <Row>
              <Col span={8}>
                <span>Tên dịch vụ</span>
              </Col>
              <Col span={8}>
                <span>Số tiền thanh toán</span>
              </Col>
              <Col span={8}>
                <span>Thời hạn</span>
              </Col>
            </Row>
          </Col>
          {guestOrderItems?.map((item) => (
            <Col span={24}>
              <Row>
                <Col span={8}>
                  <span>{item.package.name}</span>
                </Col>
                <Col span={8}>
                  <span>
                    {Number(item.price_at_purchase).toLocaleString("vi-VN")}đ
                  </span>
                </Col>
                <Col span={8}>
                  <span>{item.subscription_duration.months} tháng</span>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Modal>
      <Modal
        open={isModalAddress}
        onCancel={() => setIsModalAddress(false)}
        footer={null}
      >
        <Flex vertical gap={6}>
          <span className="text-2xl text-sky-500 ">Chi tiết địa chỉ</span>
          <span>Đây là thông địa chỉ của hoá đơn</span>
        </Flex>
        <TextArea rows={5} value={textAddress} readOnly />
      </Modal>
    </>
  );
}
