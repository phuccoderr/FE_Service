import { Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { LoginUserRequestType } from "@/types/user/user.type";
import { userApi } from "@/api/user/user.api";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (body: LoginUserRequestType) => userApi.login(body),
  });

  const onFinish = (values: LoginUserRequestType) => {
    mutate(values, {
      onSuccess: (res) => {
        message.success("Đăng nhập thành công");
        sessionStorage.setItem("SESSION", res.access_token);
        sessionStorage.setItem("USER", res.role);
        if (res.role === "ADMIN") {
          navigate("/admin/package-category");
        } else {
          navigate("/");
        }
      },
      onError: () => {
        message.error("Đăng nhập thất bại");
      },
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Form
        name="login"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
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
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
