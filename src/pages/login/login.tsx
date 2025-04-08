import { Card } from "antd";
import LoginForm from "./_components/login-form/login-form";
import PackageCard from "./_components/package-card";
import RegisterForm from "@/pages/login/_components/register-form";
import { useState } from "react";

export default function Login() {
  const [activeTabKey, setActiveTabKey] = useState<string>("login");
  const tabList = [
    {
      key: "login",
      tab: "Đăng nhập",
    },
    {
      key: "register",
      tab: "Đăng ký",
    },
  ];

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const contentList: Record<string, React.ReactNode> = {
    login: <LoginForm />,
    register: <RegisterForm />,
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Service packages sidebar */}
      <div className="bg-gradient-to-b from-sky-400 to-blue-600 md:w-1/3 p-8 flex flex-col justify-center items-center text-white">
        <h1 className="text-3xl font-bold mb-6">Service Packages</h1>
        <div className="space-y-6 w-full max-w-xs">
          <PackageCard
            title="Basic Plan"
            price="$9.99/month"
            features={["10GB Data", "Basic Support", "1 User"]}
          />
          <PackageCard
            title="Premium Plan"
            price="$19.99/month"
            features={["50GB Data", "24/7 Support", "5 Users"]}
            highlighted
          />
          <PackageCard
            title="Enterprise Plan"
            price="$49.99/month"
            features={["Unlimited Data", "Priority Support", "Unlimited Users"]}
          />
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex justify-center items-center p-8">
        <Card
          title="Welcome Back"
          className="w-full max-w-md "
          headStyle={{ textAlign: "center", fontSize: "1.5rem" }}
          tabList={tabList}
          activeTabKey={activeTabKey}
          onTabChange={onTabChange}
        >
          {contentList[activeTabKey]}
        </Card>
      </div>
    </div>
  );
}
