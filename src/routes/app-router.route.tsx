import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/login";
import HomeLayout from "@/layouts/home-layout";
import AdminLayout from "@/layouts/admin-layout";
import Home from "@/pages/home";
import PackageCategory from "@/pages/admin/package-category";
import Package from "@/pages/admin/package";
import PackageFeature from "@/pages/admin/package-feature";
import SubscriptionDuration from "@/pages/admin/subscription-duration";
import Product from "@/pages/home/product";
import { ConfigProvider } from "antd";
import ProductDetail from "@/pages/home/product-detail";
import Profile from "@/pages/home/profile";
import Checkout from "@/pages/home/checkout";
import Thank from "@/pages/home/thank";
import GuestOrder from "@/pages/admin/guest-order";
import Admin from "@/pages/admin";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";

const Provider = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            bodyPadding: 12,
          },
          Layout: {
            headerBg: "#7abade",
          },
        },
      }}
    >
      <Outlet />
    </ConfigProvider>
  );
};

const PrivateRoute = () => {
  const profile = sessionStorage.getItem("USER");
  if (!profile) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

const PublicRoute = () => {
  const profile = sessionStorage.getItem("USER");
  if (profile) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

const AppRouter = createBrowserRouter([
  {
    element: <Provider />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "/reset-password",
            element: <ResetPassword />,
          },
        ],
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <HomeLayout />,
            children: [
              {
                path: "/",
                element: <Home />,
              },
              {
                path: "product",
                element: <Product />,
              },
              {
                path: "product-detail/:id",
                element: <ProductDetail />,
              },
              {
                path: "profile",
                element: <Profile />,
              },
              {
                path: "checkout",
                element: <Checkout />,
              },
              {
                path: "thank",
                element: <Thank />,
              },
            ],
          },
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              {
                path: "dashboard",
                element: <Admin />,
              },
              {
                path: "package-category",
                element: <PackageCategory />,
              },
              {
                path: "package",
                element: <Package />,
              },
              {
                path: "package-feature",
                element: <PackageFeature />,
              },
              {
                path: "subscription-duration",
                element: <SubscriptionDuration />,
              },
              {
                path: "guest-order",
                element: <GuestOrder />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default AppRouter;
