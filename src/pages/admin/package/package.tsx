import { packageApi } from "@/api/package/package.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { queryClient } from "@/query-client";
import { ApiResponseType } from "@/types/common/common.type";
import {
  CreatePackageRequestType,
  PackageType,
  UpdatePackageRequestType,
} from "@/types/package/package.type";
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
  Select,
  Switch,
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
import TextArea from "antd/es/input/TextArea";
import { packageCategoryApi } from "@/api/package-category/package-category.api";

const { Title } = Typography;
export default function Package() {
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [packageId, setPackageId] = useState(0);
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: packages } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ALL],
    queryFn: () => packageApi.getAll(),
  });
  const { data: packagee } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_ONE, packageId],
    queryFn: () => packageApi.getOneById(packageId),
    enabled: !!packageId,
  });

  const { data: packageCategories } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ALL],
    queryFn: () => packageCategoryApi.getAll(),
  });
  const listPackageCategories = useMemo(
    () =>
      packageCategories?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [packageCategories]
  );

  const { mutate: createPackage, isPending: createPackagePending } =
    useMutation<PackageType, ApiResponseType<null>, CreatePackageRequestType>({
      mutationFn: (body) => packageApi.create(body),
    });

  const { mutate: updatePackage, isPending: updatePackagePending } =
    useMutation<
      null,
      ApiResponseType<null>,
      { id: number; body: UpdatePackageRequestType }
    >({
      mutationFn: ({ id, body }) => packageApi.update(id, body),
    });

  const handleCreateOk = () => {
    formCreate.submit();
  };

  const handleUpdateOk = () => {
    formUpdate.submit();
  };

  const onChangeActive = (id: number, value: boolean) => {
    updatePackage(
      { id, body: { is_actived: value } },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_ALL],
          });
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_ONE, id],
          });
          message.success("Cập nhật trạng thái gói thành công");
        },
        onError: (error) => {
          error.error.map((item) => message.error(item));
        },
      }
    );
  };

  const onFinishCreate = (values: CreatePackageRequestType) => {
    createPackage(values, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: [TANSTACK_KEY.PACKAGE_ALL],
        });
        setIsModalCreate(false);
        formCreate.resetFields();
        message.success("Tạo gói thành công");
      },
      onError: (error) => {
        error.error.map((item) => message.error(item));
      },
    });
  };

  const onFinishUpdate = (values: UpdatePackageRequestType) => {
    updatePackage(
      { id: packageId, body: values },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_ALL],
          });
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_ONE, packageId],
          });
          setIsModalUpdate(false);
          message.success("Cập nhật gói danh mục thành công");
        },
        onError: (error) => {
          error.error.map((item) => message.error(item));
        },
      }
    );
  };

  const showDeleteConfirm = (id: number) => {
    Modal.confirm({
      title: "Xoá gói danh mục ?",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc chắn muốn xoá gói danh mục này",
      onOk: async () => {
        try {
          await packageApi.delete(id);
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_ALL],
          });
          message.success("Xoá gói thành công");
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const filteredData = packages?.filter(
    (packagee) =>
      packagee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      packagee.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: TableProps<PackageType>["columns"] = [
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
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trang thái",
      dataIndex: "is_actived",
      key: "is_actived",
      render: (_, record) => (
        <Switch
          value={record.is_actived}
          onChange={(value) => onChangeActive(record.id, value)}
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
            icon={<EditOutlined />}
            onClick={() => {
              setPackageId(record.id);
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
    if (packagee) {
      formUpdate.setFieldsValue({
        name: packagee.name,
        description: packagee.description,
        package_category_id: packagee.package_category.id,
        price: Number(packagee.price),
        discount: Number(packagee.discount),
        data_amount: packagee.data_amount,
      });
    }
  }, [packagee]);

  return (
    <>
      <Row gutter={[16, 16]} className="p-4">
        <Col span={24}>
          <Flex justify="space-between" align="center">
            <Title level={4}>Quản lý gói dịch vụ</Title>
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
          <Table<PackageType>
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
        confirmLoading={createPackagePending}
      >
        <Form
          form={formCreate}
          layout="vertical"
          onFinish={onFinishCreate}
          requiredMark={false}
        >
          <Form.Item
            label="Tên gói danh mục"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="Internet..." />
          </Form.Item>
          <Form.Item label="Thuộc gói dịch vụ" name="package_category_id">
            <Select options={listPackageCategories} />
          </Form.Item>
          <Form.Item
            label="Giá tiền gói"
            name="price"
            style={{ marginBottom: 8 }}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Tiền giảm giá %"
            name="discount"
            style={{ marginBottom: 8 }}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Dung lượng MB"
            name="data_amount"
            style={{ marginBottom: 8 }}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
          >
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal Update */}
      <Modal
        open={isModalUpdate}
        onOk={handleUpdateOk}
        onCancel={() => setIsModalUpdate(false)}
        confirmLoading={updatePackagePending}
      >
        <Form form={formUpdate} layout="vertical" onFinish={onFinishUpdate}>
          <Form.Item
            label="Tên gói danh mục"
            name="name"
            style={{ marginBottom: 8 }}
          >
            <Input placeholder="Internet..." />
          </Form.Item>
          <Form.Item label="Thuộc gói dịch vụ" name="package_category_id">
            <Select options={listPackageCategories} />
          </Form.Item>
          <Form.Item
            label="Giá tiền gói"
            name="price"
            style={{ marginBottom: 8 }}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Tiền giảm giá %"
            name="discount"
            style={{ marginBottom: 8 }}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Dung lượng MB"
            name="data_amount"
            style={{ marginBottom: 8 }}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
          >
            <TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
