import { userApi } from "@/api/user/user.api";
import { TANSTACK_KEY } from "@/config/tanstack-key.config";
import { queryClient } from "@/query-client";
import { ApiResponseType } from "@/types/common/common.type";
import { UpdateUserRequestType } from "@/types/user/user.type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Col, Flex, Form, Input, message, Row } from "antd";
import FormItem from "antd/es/form/FormItem";
import TextArea from "antd/es/input/TextArea";
import { useEffect } from "react";

export default function Info() {
  const [form] = Form.useForm();
  const { data: me } = useQuery({
    queryKey: [TANSTACK_KEY.ME],
    queryFn: () => userApi.getMe(),
  });

  const { mutate: updateUser } = useMutation<
    null,
    ApiResponseType<null>,
    UpdateUserRequestType
  >({
    mutationFn: (body) => userApi.update(body),
  });

  const onFinish = (values: UpdateUserRequestType) => {
    updateUser(values, {
      onSuccess: () => {
        message.success("Thay đổi thông tin thành công");
        queryClient.refetchQueries({
          queryKey: [TANSTACK_KEY.ME],
        });
      },
      onError: (error) => {
        error.error.map((item) => message.error(item));
      },
    });
  };

  useEffect(() => {
    if (me) {
      form.setFieldsValue({
        first_name: me.first_name,
        last_name: me.last_name,
        email: me.email,
        phone_number: me.phone_number,
        address: me.address,
      });
    }
  }, [me]);

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Row gutter={[16, 0]}>
        <Col span={24}>
          <Flex>
            <span className="text-stone-500">
              Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
            </span>
          </Flex>
        </Col>
        <Col span={12}>
          <Form.Item label="Họ" name="first_name">
            <Input placeholder="Họ" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tên" name="last_name">
            <Input placeholder="Tên" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Email" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Số điện thoại" name="phone_number">
            <Input placeholder="Số điện thoại" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <FormItem label="Địa chỉ" name="address">
            <TextArea rows={4} placeholder="Địa chỉ của bạn" />
          </FormItem>
        </Col>
        <Col span={24}>
          <Button className="float-right" htmlType="submit">
            Lưu thông tin của bạn
          </Button>
        </Col>
      </Row>
    </Form>
  );
}
