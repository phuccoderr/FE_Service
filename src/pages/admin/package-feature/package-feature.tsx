import { packageFeatureApi } from "@/api/package-feature/package-feature.api";
import { packageApi } from "@/api/package/package.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { queryClient } from "@/query-client";
import { ApiResponseType } from "@/types/common/common.type";
import {
  CreatePackageFeatureRequestType,
  PackageFeatureType,
  UpdatePackageFeatureRequestType,
} from "@/types/package-feature/package-feature.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  TableProps,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";

const { Title } = Typography;
export default function PackageFeature() {
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [packageFeatureId, setPackageFeatureId] = useState(0);
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: packageFeatures } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_FEATURE_ALL],
    queryFn: () => packageFeatureApi.getAll(),
  });
  const { data: packageFeature } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_FEATURE_ONE, packageFeatureId],
    queryFn: () => packageFeatureApi.getOneById(packageFeatureId),
    enabled: !!packageFeatureId,
  });

  const { data: packages } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL],
    queryFn: () => packageApi.getAll(),
  });
  const listPackages = useMemo(
    () =>
      packages?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [packages]
  );

  const {
    mutate: createPackageFeature,
    isPending: createPackageFeaturePending,
  } = useMutation<
    PackageFeatureType,
    ApiResponseType<null>,
    CreatePackageFeatureRequestType
  >({
    mutationFn: (body) => packageFeatureApi.create(body),
  });

  const {
    mutate: updatePackageFeature,
    isPending: updatePackageFeaturePending,
  } = useMutation<
    null,
    ApiResponseType<null>,
    { id: number; body: UpdatePackageFeatureRequestType }
  >({
    mutationFn: ({ id, body }) => packageFeatureApi.update(id, body),
  });

  const handleCreateOk = () => {
    formCreate.submit();
  };

  const handleUpdateOk = () => {
    formUpdate.submit();
  };

  const onFinishCreate = (values: CreatePackageFeatureRequestType) => {
    createPackageFeature(values, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: [TANSTACK_KEY.PACKAGE_FEATURE_ALL],
        });
        setIsModalCreate(false);
        formCreate.resetFields();
        message.success("Tạo tính năng gói thành công");
      },
      onError: (error) => {
        error.error.map((item) => message.error(item));
      },
    });
  };

  const onFinishUpdate = (values: UpdatePackageFeatureRequestType) => {
    updatePackageFeature(
      { id: packageFeatureId, body: values },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_FEATURE_ALL],
          });
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_FEATURE_ONE, packageFeatureId],
          });
          setIsModalUpdate(false);
          message.success("Cập nhật tính năng gói thành công");
        },
        onError: (error) => {
          error.error.map((item) => message.error(item));
        },
      }
    );
  };

  const showDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: "Xoá tính năng gói ?",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc chắn muốn xoá tính năng gói này",
      onOk: async () => {
        try {
          await packageFeatureApi.delete(id);
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_FEATURE_ALL],
          });
          message.success("Xoá gói thành công");
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const filteredData = packageFeatures?.filter(
    (packagee) =>
      packagee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      packagee.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: TableProps<PackageFeatureType>["columns"] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
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
              setPackageFeatureId(record.id);
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
    if (packageFeature) {
      formUpdate.setFieldsValue({
        name: packageFeature.name,
        value: packageFeature.value,
        package_id: packageFeature.package.id,
      });
    }
  }, [packageFeature]);

  return (
    <>
      <Row gutter={[16, 16]} className="p-4">
        <Col span={24}>
          <Flex justify="space-between" align="center">
            <Title level={4}>Quản lý gói tính năng</Title>
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
          <Table<PackageFeatureType>
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
        confirmLoading={createPackageFeaturePending}
      >
        <Form
          form={formCreate}
          layout="vertical"
          onFinish={onFinishCreate}
          requiredMark={false}
        >
          <Form.Item
            label="Tên tính năng"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item
            label="Giá trị tính năng"
            name="value"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="value" />
          </Form.Item>
          <Form.Item label="Thuộc gói" name="package_id">
            <Select options={listPackages} />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal Update */}
      <Modal
        open={isModalUpdate}
        onOk={handleUpdateOk}
        onCancel={() => setIsModalUpdate(false)}
        confirmLoading={updatePackageFeaturePending}
      >
        <Form form={formUpdate} layout="vertical" onFinish={onFinishUpdate}>
          <Form.Item
            label="Tên tính năng"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="name" />
          </Form.Item>
          <Form.Item
            label="Giá trị tính năng"
            name="value"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="value" />
          </Form.Item>
          <Form.Item label="Thuộc gói" name="package_id">
            <Select options={listPackages} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
