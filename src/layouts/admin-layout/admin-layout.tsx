import { Button, Layout, Menu, theme } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { MedicineBoxOutlined } from "@ant-design/icons";
import reactLogo from "@/assets/react.svg";

export default function AdminLayout() {
  if (sessionStorage.getItem("USER") !== "ADMIN") {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const handleSidebarItem = (url: string) => {
    navigate(url);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh", overflowY: "auto" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: 16 }}>
          <img src={reactLogo} />
        </div>
        <Menu
          theme="dark"
          mode="vertical"
          onClick={(e) => handleSidebarItem(e.key)}
          items={[
            {
              key: "package-category",
              icon: <MedicineBoxOutlined />,
              label: "Gói danh mục",
            },
            {
              key: "package",
              icon: <MedicineBoxOutlined />,
              label: "Gói",
            },
            {
              key: "package-feature",
              icon: <MedicineBoxOutlined />,
              label: "Gói tính năng",
            },
            {
              key: "subscription-duration",
              icon: <MedicineBoxOutlined />,
              label: "Gói tháng",
            },
            {
              key: "guest-order",
              icon: <MedicineBoxOutlined />,
              label: "Hóa đơn khách hàng",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "20px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div></div>
          <Button onClick={handleLogout}>Đăng xuất</Button>
        </Header>
        <Content
          style={{
            margin: "12px 12px",
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
