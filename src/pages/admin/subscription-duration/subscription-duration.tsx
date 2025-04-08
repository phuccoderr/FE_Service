import { subscriptionDurationApi } from "@/api/subscription-duration/subscription-duration.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { queryClient } from "@/query-client";
import { ApiResponseType } from "@/types/common/common.type";
import {
  CreateSubscriptionDurationRequestType,
  SubscriptionDurationType,
  UpdateSubscriptionDurationRequestType,
} from "@/types/subscription-duration/subscription-duration.type";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;
export default function SubscriptionDuration() {
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [sdId, setSdId] = useState(0);
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: subscriptionDurations } = useQuery({
    queryKey: [TANSTACK_KEY.SUBSCRIPTION_DURATION_ALL],
    queryFn: () => subscriptionDurationApi.getAll(),
  });
  const { data: subscriptionDuration } = useQuery({
    queryKey: [TANSTACK_KEY.SUBSCRIPTION_DURATION_ONE, sdId],
    queryFn: () => subscriptionDurationApi.getOneById(sdId),
    enabled: !!sdId,
  });

  const {
    mutate: createSubscriptionDuration,
    isPending: createSubscriptionDurationPending,
  } = useMutation<
    SubscriptionDurationType,
    ApiResponseType<null>,
    CreateSubscriptionDurationRequestType
  >({
    mutationFn: (body) => subscriptionDurationApi.create(body),
  });

  const {
    mutate: updateSubscriptionDuration,
    isPending: updateSubscriptionDurationPending,
  } = useMutation<
    null,
    ApiResponseType<null>,
    { id: number; body: UpdateSubscriptionDurationRequestType }
  >({
    mutationFn: ({ id, body }) => subscriptionDurationApi.update(id, body),
  });

  const handleCreateOk = () => {
    formCreate.submit();
  };

  const handleUpdateOk = () => {
    formUpdate.submit();
  };

  const onFinishCreate = (values: CreateSubscriptionDurationRequestType) => {
    createSubscriptionDuration(values, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: [TANSTACK_KEY.SUBSCRIPTION_DURATION_ALL],
        });
        setIsModalCreate(false);
        formCreate.resetFields();
        message.success("Tạo gói tháng thành công");
      },
      onError: (error) => {
        error.error.map((item) => message.error(item));
      },
    });
  };

  const onFinishUpdate = (values: UpdateSubscriptionDurationRequestType) => {
    updateSubscriptionDuration(
      { id: sdId, body: values },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.SUBSCRIPTION_DURATION_ALL],
          });
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.SUBSCRIPTION_DURATION_ONE, sdId],
          });
          setIsModalUpdate(false);
          message.success("Cập nhật gói tháng thành công");
        },
        onError: (error) => {
          error.error.map((item) => message.error(item));
        },
      }
    );
  };

  const showDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: "Xoá gói tháng ?",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc chắn muốn xoá gói tháng này",
      onOk: async () => {
        try {
          await subscriptionDurationApi.delete(id);
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.SUBSCRIPTION_DURATION_ALL],
          });
          message.success("Xoá gói thành công");
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const filteredData = subscriptionDurations?.filter(
    (packagee) =>
      packagee.months.toString().includes(searchTerm.toLowerCase()) ||
      packagee.discount_percentage.toString().includes(searchTerm.toLowerCase())
  );

  const columns: TableProps<SubscriptionDurationType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tháng",
      dataIndex: "months",
      key: "months",
    },
    {
      title: "Giảm giá: %",
      dataIndex: "discount_percentage",
      key: "discount_percentage",
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
            icon={<EditOutlined />}
            onClick={() => {
              setSdId(record.id);
              setIsModalUpdate(true);
            }}
          />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    if (subscriptionDuration) {
      formUpdate.setFieldsValue({
        months: subscriptionDuration.months,
        discount_percentage: subscriptionDuration.discount_percentage,
      });
    }
  }, [subscriptionDuration]);

  return (
    <>
      <Row gutter={[16, 16]} className="p-4">
        <Col span={24}>
          <Flex justify="space-between" align="center">
            <Title level={4}>Quản lý gói tháng</Title>
            <Flex gap={4}>
              <Input
                placeholder="Tìm kiếm gói"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="primary" onClick={() => setIsModalCreate(true)}>
                Thêm gói dịch vụ
              </Button>
            </Flex>
          </Flex>
        </Col>
        <Col span={24}>
          <Table<SubscriptionDurationType>
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
          />
        </Col>
      </Row>
      {/* Modal Create */}
      <Modal
        open={isModalCreate}
        onOk={handleCreateOk}
        onCancel={() => setIsModalCreate(false)}
        confirmLoading={createSubscriptionDurationPending}
      >
        <Form
          form={formCreate}
          layout="vertical"
          onFinish={onFinishCreate}
          requiredMark={false}
        >
          <Form.Item label="Tháng" name="months" style={{ marginBottom: 8 }}>
            <InputNumber defaultValue={1} />
          </Form.Item>
          <Form.Item
            label="Giảm giá: %"
            name="discount_percentage"
            style={{ marginBottom: 8 }}
          >
            <InputNumber defaultValue={1} min={0} max={100} />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal Update */}
      <Modal
        open={isModalUpdate}
        onOk={handleUpdateOk}
        onCancel={() => setIsModalUpdate(false)}
        confirmLoading={updateSubscriptionDurationPending}
      >
        <Form form={formUpdate} layout="vertical" onFinish={onFinishUpdate}>
          <Form.Item label="Tháng" name="months" style={{ marginBottom: 8 }}>
            <InputNumber defaultValue={1} />
          </Form.Item>
          <Form.Item
            label="Giảm giá: %"
            name="discount_percentage"
            style={{ marginBottom: 8 }}
          >
            <InputNumber defaultValue={1} min={0} max={100} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
