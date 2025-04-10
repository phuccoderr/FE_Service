import { userApi } from "@/api/user/user.api";
import { ApiResponseType } from "@/types/common/common.type";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useLocation } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token") ?? "";
  const [form] = Form.useForm();

  const { mutate } = useMutation<
    null,
    ApiResponseType<null>,
    { token: string; password: string }
  >({
    mutationFn: (body) => userApi.resetPassword(body.token, body.password),
  });

  const onFinish = (values: { password: string }) => {
    console.log(values);
    mutate(
      { token, password: values.password },
      {
        onSuccess: () => {
          message.success("Thay đổi mật khẩu thành công");
        },
        onError: (error) => {
          error.error.map((item) => message.error(item));
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center">Đăng Nhập</h2>
        <Form
          form={form}
          name="register"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
        >
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" className="w-full">
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
