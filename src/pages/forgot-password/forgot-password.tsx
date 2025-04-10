import { userApi } from "@/api/user/user.api";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, message } from "antd";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    mutationFn: (email: string) => userApi.forgotPassword(email),
  });

  function handleForgotPassword() {
    mutation.mutate(email, {
      onSuccess: () => {
        message.success("Gửi yêu cầu thành công");
      },
      onError: () => {
        message.error("Gửi yêu cầu thất bại, email không đúng");
      },
    });
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex gap-2 flex-col w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center">Quên mật khẩu</h2>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email"
        />
        <Button
          onClick={handleForgotPassword}
          className="w-full mt-6 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ForgotPassword;
