import { guestOrderApi } from "@/api/guest-order/guest-order.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { GuestOrderType } from "@/types/guest-order/guest-order.type";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Flex,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useState } from "react";
import { ExclamationCircleFilled, EyeOutlined } from "@ant-design/icons";
import { formatDateTimestamp } from "@/utils/format.util";
import { queryClient } from "@/query-client";

const { Title } = Typography;
export default function GuestOrder() {
  const [isModalDetail, setIsModalDetail] = useState(false);
  const [guestOrderId, setGuestOrderId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: guestOrders } = useQuery({
    queryKey: [TANSTACK_KEY.GUEST_ORDER_ALL],
    queryFn: () => guestOrderApi.getAll(),
  });
  const { data: guestOrderItems } = useQuery({
    queryKey: [TANSTACK_KEY.GUEST_ORDER_ONE, guestOrderId],
    queryFn: () => guestOrderApi.getItemById(guestOrderId),
    enabled: !!guestOrderId,
  });

  const hanldeGuestOrderItem = (id: number) => {
    setGuestOrderId(id);
    setIsModalDetail(true);
  };

  const showChangeOrderStatusConfirm = (
    id: number,
    status: "pending" | "processing" | "completed" | "cancelled"
  ) => {
    Modal.confirm({
      title: "Thay đổi trạng thái hoá đơn",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc chắn muốn thay đổi trạng thái hoá đơn ?",
      onOk: async () => {
        try {
          await guestOrderApi.updateStatus(id, status);
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.GUEST_ORDER_ALL],
          });
          message.success("Thay đổi trạng thái hoá đơn thành công");
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const filteredData = guestOrders?.filter(
    (guestOrder) =>
      guestOrder.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guestOrder.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guestOrder.phone_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      title: "Ngày gói cước",
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
      render: (_, record) => (
        <Select
          value={record.order_status}
          style={{ width: "100%" }}
          onChange={(value) => showChangeOrderStatusConfirm(record.id, value)}
          disabled={
            record.order_status === "completed" ||
            record.order_status === "cancelled"
          }
          options={[
            { value: "pending", label: "Đang chờ xác nhận" },
            { value: "processing", label: "Đang xử lý" },
            { value: "completed", label: "Thanh toán hoàn tất" },
            { value: "cancelled", label: "Đã huỷ" },
          ]}
        />
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
        </Flex>
      ),
    },
  ];

  return (
    <>
      <Row gutter={[16, 16]} className="p-4">
        <Col span={24}>
          <Flex justify="space-between" align="center">
            <Title level={4}>Quản lý hoá đơn</Title>
            <Flex gap={4}>
              <Input
                placeholder="Tìm kiếm gói"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Flex>
          </Flex>
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
      {/* Modal Detail */}
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
    </>
  );
}
