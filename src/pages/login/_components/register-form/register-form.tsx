import { Button, Form, Input, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { RegisterUserRequestType } from "@/types/user/user.type";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/api/user/user.api";
import { ApiResponseType } from "@/types/common/common.type";

export default function RegisterForm() {
  const { mutate } = useMutation<
    null,
    ApiResponseType<null>,
    RegisterUserRequestType
  >({
    mutationFn: (body: RegisterUserRequestType) => userApi.register(body),
  });
  const onFinish = (values: RegisterUserRequestType) => {
    mutate(values, {
      onSuccess: () => {
        message.success("Đăng ký thành công");
      },
      onError: (error) => {
        error.error.map((item) => message.error(item));
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Form
        name="register"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
              type: "email",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="name@example.com"
            size="large"
          />
        </Form.Item>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="example" size="large" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} size="large" />
        </Form.Item>
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" className="w-full">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
