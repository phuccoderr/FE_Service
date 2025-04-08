import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Radio,
  Row,
} from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  WifiOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {
  CreateGuestOrderRequestType,
  GuestOrderType,
} from "@/types/guest-order/guest-order.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { guestOrderApi } from "@/api/guest-order/guest-order.api";
import { ApiResponseType } from "@/types/common/common.type";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { cartItemApi } from "@/api/cart-item/cart-item.api";
import { useEffect, useMemo } from "react";
import { queryClient } from "@/query-client";
import {
  calcPrice,
  calcPriceWithSubscriptionDuration,
} from "@/utils/format.util";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/api/user/user.api";

export default function Checkout() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const radioValue = Form.useWatch("payment_method", form);

  const { data: me } = useQuery({
    queryKey: [TANSTACK_KEY.ME],
    queryFn: () => userApi.getMe(),
  });

  const { data: cartItems } = useQuery({
    queryKey: [TANSTACK_KEY.CART_ITEM_ALL],
    queryFn: () => cartItemApi.getAllByUserId(),
  });
  const total = useMemo(
    () =>
      cartItems?.reduce((total, item) => {
        const price =
          Number(item.package.price) * item.subscription_duration.months;
        return total + price;
      }, 0),
    [cartItems]
  );

  const totalDiscount = useMemo(
    () =>
      cartItems?.reduce((total, item) => {
        const priceDiscount =
          item.package.price *
          (item.package.discount / 100) *
          item.subscription_duration.months;
        const subscriptionDiscount =
          (calcPrice(item.package.price, item.package.discount) *
            item.subscription_duration.months *
            item.subscription_duration.discount_percentage) /
          100;
        const result = priceDiscount + subscriptionDiscount;
        return total + result;
      }, 0),
    [cartItems]
  );

  const totalResult = useMemo(
    () =>
      cartItems?.reduce((total, item) => {
        const priceDiscount = calcPriceWithSubscriptionDuration(
          item.package,
          item.subscription_duration
        );
        return total + priceDiscount;
      }, 0),
    [cartItems]
  );

  const { mutate: payment } = useMutation<
    GuestOrderType,
    ApiResponseType<null>,
    CreateGuestOrderRequestType
  >({
    mutationFn: (body) => guestOrderApi.create(body),
  });

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

  const onFinish = (values: CreateGuestOrderRequestType) => {
    payment(values, {
      onSuccess: () => {
        message.success("Thanh toán thành công");
        queryClient.refetchQueries({
          queryKey: [TANSTACK_KEY.CART_ITEM_ALL],
        });
        navigate("/thank");
      },
      onError: (error) => {
        error.error.map((item) => message.error(item));
      },
    });
  };

  const handlePayment = () => {
    form.submit();
  };

  useEffect(() => {
    if (me) {
      form.setFieldsValue({
        full_name: me.first_name + me.last_name,

        email: me.email,
        phone_number: me.phone_number,
        address: me.address,
      });
    }
  }, [me]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ payment_method: "bank-transfer" }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <span className="text-stone-800 font-semibold text-lg">
            <ArrowLeftOutlined style={{ fontSize: "16px" }} /> Quay lại trang
            chủ
          </span>
        </Col>
        <Col span={16}>
          <Card style={{ padding: "12px" }}>
            <Flex vertical gap={8}>
              <span className="text-2xl font-semibold">
                Thông tin cá nhân và địa chỉ
              </span>
              <span className="text-sm text-stone-500">
                Vui lòng cung cấp thông tin cá nhân và địa chỉ của bạn
              </span>
              <span className="text-lg font-semibold">Thông tin cá nhân</span>

              <Row gutter={[16, 0]}>
                <Col span={24}>
                  <Form.Item
                    label="Họ và tên"
                    name="full_name"
                    rules={[{ required: true, message: "Vui lòng nhập!" }]}
                  >
                    <Input placeholder="Họ và tên của bạn" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập!",
                        type: "email",
                      },
                    ]}
                  >
                    <Input placeholder="Email của bạn" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone_number"
                    rules={[{ required: true, message: "Vui lòng nhập!" }]}
                  >
                    <Input placeholder="+84..." />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập!" }]}
                  >
                    <TextArea rows={5} placeholder="Địa chỉ của bạn" />
                  </Form.Item>
                </Col>
              </Row>
            </Flex>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ padding: "12px" }}>
            <Flex vertical gap={8}>
              <span className="text-2xl font-semibold">Tóm tắt đơn hàng</span>
              {cartItems?.map((item) => (
                <Flex gap={4} key={item.id}>
                  <WifiOutlined
                    className="px-2 rounded  bg-sky-200 "
                    style={{ color: "blue" }}
                  />
                  <Flex vertical>
                    <span className="text-lg font-semibold">
                      {item.package.name}
                    </span>
                    <span className="text-sm">
                      {item.package.package_category.name}
                    </span>
                  </Flex>
                  <Flex vertical gap={4} style={{ marginLeft: "auto" }}>
                    <span className="text-sky-500">
                      {calcPriceWithSubscriptionDuration(
                        item.package,
                        item.subscription_duration
                      ).toLocaleString("vi-VN") + "đ"}
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
              ))}
            </Flex>
            <Divider />
            <Form.Item name="payment_method">
              <Radio.Group
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                options={[
                  {
                    value: "bank-transfer",
                    label: (
                      <>
                        Chuyển khoản ngân hàng
                        {radioValue === "bank-transfer" && (
                          <Flex
                            vertical
                            className="bg-sky-100 rounded"
                            style={{ padding: 8 }}
                          >
                            <span className="text-base text-sky-500 font-semibold">
                              Thông tin tài khoản
                            </span>
                            <Flex gap={4} className="text-sm">
                              <span className=" text-stone-400">
                                Ngân hàng:
                              </span>
                              <span className="text-stone-700 font-semibold">
                                Vietcombank
                              </span>
                            </Flex>
                            <Flex gap={4} className="text-sm">
                              <span className=" text-stone-400">
                                Số tài khoản:
                              </span>
                              <span className="text-stone-700 font-semibold">
                                1234567890
                              </span>
                            </Flex>
                            <Flex gap={4} className="text-sm">
                              <span className=" text-stone-400">
                                Chủ tài khoản:
                              </span>
                              <span className="text-stone-700 font-semibold">
                                CÔNG TY TELECONNECT
                              </span>
                            </Flex>
                            <Flex gap={4} className="text-sm">
                              <span className=" text-stone-400">
                                Nội dung chuyển khoản:
                              </span>
                              <span className="text-stone-700 font-semibold">
                                TC-158208
                              </span>
                            </Flex>
                          </Flex>
                        )}
                      </>
                    ),
                  },
                  { value: "cod", label: "Thanh toán khi lắp đặt (COD)" },
                ]}
              />
            </Form.Item>
            <Divider />
            <Flex vertical>
              <Flex justify="space-between">
                <span className="text-lg">Tạm tính</span>
                <span className="text-lg">
                  {total?.toLocaleString("vi-VN") + "đ"}
                </span>
              </Flex>
              <Flex justify="space-between">
                <span className="text-lg text-green-300">Giảm giá</span>
                <span className="text-lg text-green-300">
                  -{totalDiscount?.toLocaleString("vi-VN")}đ
                </span>
              </Flex>
            </Flex>
            <Divider />
            <Flex justify="space-between">
              <span className="text-lg font-semibold">Tống cộng</span>
              <span className="text-lg font-semibold text-sky-500">
                {totalResult?.toLocaleString("vi-VN")}đ
              </span>
            </Flex>
            <Button
              type="primary"
              block
              style={{ marginTop: "12px" }}
              size="large"
              onClick={handlePayment}
              disabled={!cartItems?.length}
            >
              Thanh toán
            </Button>
          </Card>
        </Col>
      </Row>
    </Form>
  );
}
