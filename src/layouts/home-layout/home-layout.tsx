import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Flex,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Row,
} from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  BellOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  PoweroffOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { cartItemApi } from "@/api/cart-item/cart-item.api";
import { queryClient } from "@/query-client";
import {
  calcPriceWithSubscriptionDuration,
  formatDateTimestamp,
} from "@/utils/format.util";
import { notificationApi } from "@/api/notification/notification.api";

export default function HomeLayout() {
  if (sessionStorage.getItem("USER") !== "CUSTOMER") {
    return <Navigate to="/admin/package-category" />;
  }
  const navigate = useNavigate();

  const { data: cartItems } = useQuery({
    queryKey: [TANSTACK_KEY.CART_ITEM_ALL],
    queryFn: () => cartItemApi.getAllByUserId(),
  });

  const { data: notifications } = useQuery({
    queryKey: [TANSTACK_KEY.NOTIFICATION_ALL],
    queryFn: () => notificationApi.getByMe(),
  });

  const [isModalCart, setIsModalCart] = useState(false);

  const { mutate: deleteCartItem } = useMutation({
    mutationFn: (package_id: number) => cartItemApi.delete({ package_id }),
  });

  const handleDeleteCartItem = (package_id: number) => {
    deleteCartItem(package_id, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: [TANSTACK_KEY.CART_ITEM_ALL],
        });
      },
    });
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const itemsNotifications: MenuProps["items"] = notifications?.map((item) => ({
    key: item.id,
    label: (
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <span>{item.subscription.package.name}</span>
        </Col>
        <Col span={8}>
          <span>{item.message}</span>
        </Col>

        <Col span={8}>
          <span>
            {formatDateTimestamp(item.created_at).toLocaleDateString("vi-VN")}
          </span>
        </Col>
      </Row>
    ),
  }));

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <Link to="/profile">
          <UserOutlined style={{ fontSize: "12px" }} /> Profile
        </Link>
      ),
    },
    {
      label: (
        <span className="text-red-400" onClick={handleLogout}>
          <PoweroffOutlined style={{ fontSize: "12px" }} /> Đăng xuất
        </span>
      ),
      key: "2",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh", overflowY: "auto" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Button>Logo</Button>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={[
            {
              key: "/",
              label: "Trang chủ",
            },
            {
              key: "/product",
              label: "Trang sản phẩm",
            },
          ]}
          style={{ flex: 1, minWidth: 0, backgroundColor: "#7abade" }}
          onClick={({ key }) => navigate(key)}
        />
        <Flex gap={12}>
          <Dropdown
            menu={{ items: itemsNotifications }}
            placement="bottomRight"
            arrow
            trigger={["click"]}
          >
            <Button
              color="primary"
              variant="outlined"
              size="large"
              icon={<BellOutlined />}
            />
          </Dropdown>
          <Badge count={cartItems?.length} size="small">
            <Button
              type="primary"
              size="large"
              onClick={() => setIsModalCart(true)}
              icon={<ShoppingCartOutlined />}
            />
          </Badge>
          <Dropdown menu={{ items }}>
            <Button
              color="primary"
              variant="outlined"
              size="large"
              icon={<UserOutlined />}
            />
          </Dropdown>
        </Flex>
      </Header>
      <Content style={{ padding: "12px 48px" }}>
        <Outlet />
      </Content>
      <Footer style={{ backgroundColor: "#7abade", color: "#fff" }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">Về chúng tôi</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Tin tức
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Liên hệ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Dịch vụ</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Gói cước di động
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Internet WiFi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Dịch vụ gia tăng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Dịch vụ quốc tế
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Hỗ trợ</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Câu hỏi thường gặp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Hướng dẫn sử dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Điều khoản dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-300 !text-white">
                    Chính sách bảo mật
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Liên hệ</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-phone"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>1800 1234</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-mail"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>support@teleconnect.vn</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-map-pin"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>123 Đường ABC, Quận 1, TP.HCM</span>
                </li>
              </ul>

              <div className="mt-4 flex gap-4">
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-blue-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-youtube"
                  >
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Footer>
      {/* Cart Modal */}
      <Modal
        title={
          <div className="text-sky-500 text-xl">
            <ShoppingCartOutlined /> Giỏ hàng của bạn
          </div>
        }
        footer={[
          <Button key={"back"} onClick={() => setIsModalCart(false)}>
            Huỷ
          </Button>,
          <Button
            icon={<CreditCardOutlined />}
            onClick={() => {
              setIsModalCart(false);
              navigate("/checkout");
            }}
            disabled={!cartItems?.length}
          >
            Thanh toán
          </Button>,
        ]}
        open={isModalCart}
        onCancel={() => setIsModalCart(false)}
      >
        {cartItems?.map((item) => (
          <Card key={item.id}>
            <Flex gap={4}>
              <Flex vertical>
                <span className="text-lg font-semibold">
                  {item.package.name}
                </span>
                <span className="text-sm">
                  {item.package.package_category.name}
                </span>
                {/* Feature */}
                {item.package.package_feature.map((feature) => (
                  <Flex key={feature.id} gap={4} align="center">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                    <span>{feature.name}</span>
                  </Flex>
                ))}
              </Flex>
              <Flex vertical gap={4} style={{ marginLeft: "auto" }}>
                <span className="text-sky-500">
                  {calcPriceWithSubscriptionDuration(
                    item.package,
                    item.subscription_duration
                  ).toLocaleString("vi-VN") + "đ"}
                </span>
                <span className="text-stone-400">
                  {item.subscription_duration.months}/tháng
                </span>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  style={{ marginTop: "auto" }}
                  onClick={() => handleDeleteCartItem(item.package.id)}
                >
                  Xoá
                </Button>
              </Flex>
            </Flex>
          </Card>
        ))}
        <Card>
          <Flex gap={4}>
            <Flex vertical>
              <span className="text-lg font-semibold">Gói Tiêu Chuẩn</span>
              <span className="text-sm">Gói cước di động</span>
              {/* Feature */}
              <Flex gap={4} align="center">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                <span>5Gb/ngày</span>
              </Flex>
            </Flex>
            <Flex vertical gap={4} style={{ marginLeft: "auto" }}>
              <span className="text-sky-500">199.000đ</span>
              <span className="text-stone-400">/tháng</span>
              <Button
                icon={<DeleteOutlined />}
                danger
                size="small"
                style={{ marginTop: "auto" }}
              >
                Xoá
              </Button>
            </Flex>
          </Flex>
        </Card>
      </Modal>
    </Layout>
  );
}
