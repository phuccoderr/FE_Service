import { packageApi } from "@/api/package/package.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { calcPrice } from "@/utils/format.util";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Flex,
  Row,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

const { Title } = Typography;
export default function Home() {
  const navigate = useNavigate();
  const { data: listHotDeal } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL, 1],
    queryFn: () => packageApi.getAll({ package_category_id: 1 }),
  });

  const { data: listService } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL, 3],
    queryFn: () => packageApi.getAll({ package_category_id: 3 }),
  });

  const { data: listTvCaps } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL, 4],
    queryFn: () => packageApi.getAll({ package_category_id: 4 }),
  });
  return (
    <Row>
      <Col span={24}>
        <Flex vertical>
          <Title level={3}>Hot Deal</Title>
          <Carousel
            arrows
            infinite={true}
            slidesToShow={4}
            autoplay={{ dotDuration: true }}
            autoplaySpeed={3000}
            waitForAnimate={false}
          >
            {listHotDeal?.map((item) => (
              <Card
                key={item.id}
                style={{
                  padding: "0 10px",
                }}
              >
                <Flex vertical align="center">
                  <Title level={3}>{item.name}</Title>
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
                  <Title level={4}>
                    {calcPrice(item.price, item.discount).toLocaleString(
                      "vi-VN"
                    ) + " đ/lượt"}
                  </Title>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate(`/product-detail/${item.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </Flex>
              </Card>
            ))}
          </Carousel>
        </Flex>
      </Col>

      <Col span={24}>
        <Flex vertical>
          <Title level={3}>Hot Deal</Title>
          <Carousel arrows infinite={false} slidesToShow={4} draggable>
            {listService?.map((item) => (
              <Card
                key={item.id}
                style={{
                  padding: "0 10px",
                }}
              >
                <Flex vertical align="center">
                  <Title level={3}>{item.name}</Title>
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
                  <Title level={4}>
                    {calcPrice(item.price, item.discount).toLocaleString(
                      "vi-VN"
                    ) + " đ/lượt"}
                  </Title>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate(`/product-detail/${item.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </Flex>
              </Card>
            ))}
          </Carousel>
        </Flex>
      </Col>
      <Col span={24}>
        <Flex vertical>
          <Title level={3}>Hot Deal</Title>
          <Carousel arrows infinite={false} slidesToShow={4} draggable>
            {listTvCaps?.map((item) => (
              <Card
                key={item.id}
                style={{
                  padding: "0 10px",
                }}
              >
                <Flex vertical align="center">
                  <Title level={3}>{item.name}</Title>
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
                  <Title level={4}>
                    {calcPrice(item.price, item.discount).toLocaleString(
                      "vi-VN"
                    ) + " đ/lượt"}
                  </Title>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate(`/product-detail/${item.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </Flex>
              </Card>
            ))}
          </Carousel>
        </Flex>
      </Col>
    </Row>
  );
}
