import { cartItemApi } from "@/api/cart-item/cart-item.api";
import { packageApi } from "@/api/package/package.api";
import { subscriptionDurationApi } from "@/api/subscription-duration/subscription-duration.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { queryClient } from "@/query-client";
import { CreateCartItemRequestType } from "@/types/cart-item/cart-item.type";
import { calcPriceWithSubscriptionDuration } from "@/utils/format.util";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Carousel, Divider, Flex, message, Space } from "antd";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Query Packagee
  const { data: packagee } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ONE, id],
    queryFn: () => packageApi.getOneById(Number(id)),
  });
  // Query Subscription Duration
  const { data: subscriptionDurations } = useQuery({
    queryKey: [TANSTACK_KEY.SUBSCRIPTION_DURATION_ALL],
    queryFn: () => subscriptionDurationApi.getAll(),
  });
  // Query List Packages
  const { data: listPackages } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL, packagee?.package_category.id],
    queryFn: () =>
      packageApi.getAll({ package_category_id: packagee?.package_category.id }),
  });

  const [activeSubscriptionDuration, setActiveSubscriptionDuration] =
    useState(0);

  useEffect(() => {
    if (subscriptionDurations) {
      setActiveSubscriptionDuration(subscriptionDurations[0].id);
    }
  }, [subscriptionDurations]);

  const { mutate: addCartItem } = useMutation({
    mutationFn: (body: CreateCartItemRequestType) => cartItemApi.create(body),
  });

  const handleAddCartItem = () => {
    if (!activeSubscriptionDuration) return;

    addCartItem(
      {
        package_id: Number(id),
        subscription_duration_id: activeSubscriptionDuration,
      },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.CART_ITEM_ALL],
          });
          message.success("Thêm vào giỏ hàng thành công");
        },

        onError: () => {
          message.error("Gói này đã tồn tại trong giỏ hàng của bạn!");
        },
      }
    );
  };

  return (
    <>
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Card style={{ padding: "24px" }}>
          <Flex gap={12}>
            <img
              src="https://digishop.vnpt.vn/digitalShop/images/production/1743223180156Home%203-100.jpg"
              alt=""
            />
            <Flex vertical gap={4} flex={1}>
              <span>{packagee?.name}</span>
              <Flex gap={24}>
                <span>
                  {Number(packagee?.price).toLocaleString("vi-VN") + "đ"}
                </span>
                <span>{packagee?.discount}%</span>
              </Flex>
              <span className="text-[#E7007F]">
                {calcPriceWithSubscriptionDuration(
                  packagee,
                  subscriptionDurations?.find(
                    (item) => item.id === activeSubscriptionDuration
                  )
                ).toLocaleString("vi-VN") + "đ"}
              </span>
              <Divider style={{ margin: "12px 0" }} />
              {packagee?.package_feature?.map((item) => (
                <Flex gap={4} key={item.id}>
                  <span className="text-[#E7007F]">✓</span>
                  <span>{item.name}</span>
                </Flex>
              ))}
              <Flex gap={12}>
                {subscriptionDurations?.map((item) => (
                  <Button
                    key={item.id}
                    color="primary"
                    variant={
                      activeSubscriptionDuration === item.id
                        ? "solid"
                        : "outlined"
                    }
                    onClick={() => setActiveSubscriptionDuration(item.id)}
                  >
                    {item.months} tháng
                  </Button>
                ))}
              </Flex>
              <Button
                type="primary"
                style={{ width: "50%", marginTop: "auto" }}
                shape="round"
                onClick={handleAddCartItem}
              >
                Thêm vào giỏ hàng ngay
              </Button>
            </Flex>
          </Flex>
        </Card>
        <Card style={{ padding: "24px" }}>
          <Flex vertical gap={12}>
            <span className="text-2xl text-sky-500 font-semibold">
              Thông tin chi tiết
            </span>
            <span>
              1. Ưu đãi gói cước - Đường truyền Internet tốc độ từ 500 Mbps lên
              tới 1000 Mbps tuỳ thuộc khoảng cách tới thiết bị phát Wifi, chủng
              loại thiết bị và hạ tầng tại từng khu vực - Trang bị 01 Wifi Mesh
              5 hoặc 01 Wifi Mesh 6 + Wifi Mesh 5: * Wifi Mesh 5 iGate EW12ST là
              sự kết hợp giữa chuẩn Wifi 5 và công nghệ Mesh Wifi, phù hợp với
              hộ gia đình với mọi cấu trúc nhà ở. * Tốc độ lên đến 1200Mbps trên
              cả 2 băng tần 2,4-5GHz * Kết nối liền mạch, chỉ tạo tên 1 Wifi duy
              nhất * Hỗ trợ đồng thời 40 thiết bị * Cài đặt dễ dàng, triển khai
              linh hoạt. + Wifi Mesh 6: *Wifi Mesh 6 iGate EW30SX là sự kết hợp
              giữa chuẩn Wifi 6 và công nghệ Mesh, phù hợp với các doanh nghiệp,
              tổ chức vừa và nhỏ, các gia đình có nhu cầu sử dụng internet cao.
              * Tốc độ lên đến 3Gbps, trên cả hai băng tần 2,4 – 5GHz * Kết nối
              liền mạch, phù hợp mọi ngóc ngách * Hỗ trợ đồng thời 100 thiết bị
              * Độ trễ giảm 50%. - Lắp đặt nhanh chóng, chăm sóc và hỗ trợ khách
              hàng 24/7 2. Cước đấu nối hòa mạng - Cước đấu nối hòa mạng áp dụng
              cho thuê bao đăng ký mới dịch vụ cho Khách hàng cá nhân, Hộ gia
              đình: 300.000 VNĐ/thuê bao (đã bao gồm VAT) 3. Khu vực áp dụng -
              Áp dụng tại ngoại thành Hà Nội, TP.HCM & 61 Tỉnh/thành phố 4. Tổng
              đài hỗ trợ - Để được hỗ trợ về dịch vụ internet và truyền hình,
              Quý khách vui lòng liên hệ 1800 1166 (miễn phí)
            </span>
          </Flex>
        </Card>
        <Flex vertical>
          <span className="text-2xl font-semibold text-sky-500">
            Gói cước khác
          </span>
          <Carousel arrows infinite={false} slidesToShow={4} draggable>
            {listPackages?.map((item) => (
              <Card
                key={item.id}
                style={{
                  padding: "0 10px",
                }}
              >
                <Flex vertical align="center">
                  <span className="text-xl font-semibold text-sky-600">
                    {item.name}
                  </span>
                  <Divider />
                  <Flex align="center" gap={6} style={{ minHeight: "100px" }}>
                    <p>-</p>
                    {item.package_feature.map((item) => (
                      <Fragment key={item.id}>
                        <span className="font-bold">{item.name}</span>
                        <span>{item.value}</span>
                      </Fragment>
                    ))}
                  </Flex>
                  <Divider />
                  <span className="text-lg ">
                    {Number(item.price).toLocaleString("vi-VN") + " đ/lượt"}
                  </span>
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => navigate(`/product-detail/${item.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </Flex>
              </Card>
            ))}
          </Carousel>
        </Flex>
      </Space>
    </>
  );
}
