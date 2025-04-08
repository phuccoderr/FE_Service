import { packageCategoryApi } from "@/api/package-category/package-category.api";
import {
  CreatePackageCategoryRequestType,
  PackageCategoryType,
  UpdatePackageCategoryRequestType,
} from "@/types/package-category/package-category.type";
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
  Switch,
  Table,
  TableProps,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { ApiResponseType } from "@/types/common/common.type";
import { queryClient } from "@/query-client";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";

const { Title } = Typography;

export default function PackageCategory() {
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [packageCategoryId, setPackageCategoryId] = useState(0);
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: packageCategories } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ALL],
    queryFn: () => packageCategoryApi.getAll(),
  });
  const { data: packageCategory } = useQuery({
    queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ONE, packageCategoryId],
    queryFn: () => packageCategoryApi.getById(packageCategoryId),
    enabled: !!packageCategoryId,
  });

  const {
    mutate: createPackageCategory,
    isPending: createPackageCategoryPending,
  } = useMutation<
    PackageCategoryType,
    ApiResponseType<null>,
    CreatePackageCategoryRequestType
  >({
    mutationFn: (body) => packageCategoryApi.create(body),
  });

  const {
    mutate: updatePackageCategory,
    isPending: updatePackageCategoryPending,
  } = useMutation<
    null,
    ApiResponseType<null>,
    { id: number; body: UpdatePackageCategoryRequestType }
  >({
    mutationFn: ({ id, body }) => packageCategoryApi.update(id, body),
  });

  const handleCreateOk = () => {
    formCreate.submit();
  };

  const handleUpdateOk = () => {
    formUpdate.submit();
  };

  const onChangeActive = (id: number, value: boolean) => {
    updatePackageCategory(
      { id, body: { is_actived: value } },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ALL],
          });
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ONE, id],
          });
          message.success("Cập nhật trạng thái gói danh mục thành công");
        },
        onError: (error) => {
          error.error.map((item) => message.error(item));
        },
      }
    );
  };

  const onFinishCreate = (values: CreatePackageCategoryRequestType) => {
    createPackageCategory(values, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ALL],
        });
        setIsModalCreate(false);
        formCreate.resetFields();
        message.success("Tạo gói danh mục thành công");
      },
      onError: (error) => {
        error.error.map((item) => message.error(item));
      },
    });
  };

  const onFinishUpdate = (values: UpdatePackageCategoryRequestType) => {
    updatePackageCategory(
      { id: packageCategoryId, body: values },
      {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ALL],
          });
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ONE, packageCategoryId],
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
      title: "Xoá gói ?",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc chắn muốn xoá gói này",
      onOk: async () => {
        try {
          await packageCategoryApi.delete(id);
          queryClient.refetchQueries({
            queryKey: [TANSTACK_KEY.PACKAGE_CATEGORY_ALL],
          });
          message.success("Xoá gói danh mục thành công");
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  };

  const filteredData = packageCategories?.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: TableProps<PackageCategoryType>["columns"] = [
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
              setPackageCategoryId(record.id);
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
    if (packageCategory) {
      formUpdate.setFieldsValue({
        name: packageCategory.name,
        description: packageCategory.description,
      });
    }
  }, [packageCategory]);

  return (
    <>
      <Row gutter={[16, 16]} className="p-4">
        <Col span={24}>
          <Flex justify="space-between" align="center">
            <Title level={4}>Quản lý danh mục gói dịch vụ</Title>
            <Flex gap={4}>
              <Input
                placeholder="Tìm kiếm danh mục gói"
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
          <Table<PackageCategoryType>
            rowKey="id"
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 10 }}
          />
        </Col>
      </Row>

      <Modal
        open={isModalCreate}
        onOk={handleCreateOk}
        onCancel={() => setIsModalCreate(false)}
        confirmLoading={createPackageCategoryPending}
      >
        <Form form={formCreate} layout="vertical" onFinish={onFinishCreate}>
          <Form.Item
            label="Tên gói danh mục"
            name="name"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập!",
              },
            ]}
          >
            <Input placeholder="Internet..." size="large" />
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
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={isModalUpdate}
        onOk={handleUpdateOk}
        onCancel={() => setIsModalUpdate(false)}
        confirmLoading={updatePackageCategoryPending}
      >
        <Form form={formUpdate} layout="vertical" onFinish={onFinishUpdate}>
          <Form.Item label="Tên gói danh mục" name="name">
            <Input placeholder="Internet..." size="large" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal Update */}
      {/* Modal Create */}
    </>
  );
}
