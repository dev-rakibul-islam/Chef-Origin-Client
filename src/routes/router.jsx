import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MealsPage from "../pages/MealsPage";
import MealDetailsPage from "../pages/MealDetailsPage";
import OrderPage from "../pages/OrderPage";
import MyProfilePage from "../pages/MyProfilePage";
import MyOrdersPage from "../pages/MyOrdersPage";
import MyReviewsPage from "../pages/MyReviewsPage";
import FavoriteMealsPage from "../pages/FavoriteMealsPage";
import CreateMealPage from "../pages/CreateMealPage";
import MyMealsPage from "../pages/MyMealsPage";
import OrderRequestsPage from "../pages/OrderRequestsPage";
import ManageUsersPage from "../pages/ManageUsersPage";
import ManageRequestsPage from "../pages/ManageRequestsPage";
import StatisticsPage from "../pages/StatisticsPage";
import ErrorPage from "../pages/ErrorPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ChefRoute from "./ChefRoute";
import PageTitle from "../components/PageTitle";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <>
            <PageTitle title="Home | Chef Origin" />
            <HomePage />
          </>
        ),
      },
      {
        path: "login",
        element: (
          <>
            <PageTitle title="Login | Chef Origin" />
            <LoginPage />
          </>
        ),
      },
      {
        path: "register",
        element: (
          <>
            <PageTitle title="Register | Chef Origin" />
            <RegisterPage />
          </>
        ),
      },
      {
        path: "meals",
        element: (
          <>
            <PageTitle title="Meals | Chef Origin" />
            <MealsPage />
          </>
        ),
      },
      {
        path: "meals/:id",
        element: (
          <>
            <PageTitle title="Meal Details | Chef Origin" />
            <MealDetailsPage />
          </>
        ),
      },
      {
        path: "order/:id",
        element: (
          <>
            <PageTitle title="Order | Chef Origin" />
            <OrderPage />
          </>
        ),
      },
      {
        path: "payment/success",
        element: (
          <>
            <PageTitle title="Payment Success | Chef Origin" />
            <PaymentSuccessPage />
          </>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="profile" replace />,
      },
      {
        path: "profile",
        element: (
          <>
            <PageTitle title="My Profile | Chef Origin" />
            <MyProfilePage />
          </>
        ),
      },
      {
        path: "orders",
        element: (
          <>
            <PageTitle title="My Orders | Chef Origin" />
            <MyOrdersPage />
          </>
        ),
      },
      {
        path: "reviews",
        element: (
          <>
            <PageTitle title="My Reviews | Chef Origin" />
            <MyReviewsPage />
          </>
        ),
      },
      {
        path: "favorites",
        element: (
          <>
            <PageTitle title="Favorite Meals | Chef Origin" />
            <FavoriteMealsPage />
          </>
        ),
      },
      {
        path: "create-meal",
        element: (
          <ChefRoute>
            <PageTitle title="Create Meal | Chef Origin" />
            <CreateMealPage />
          </ChefRoute>
        ),
      },
      {
        path: "my-meals",
        element: (
          <ChefRoute>
            <PageTitle title="My Meals | Chef Origin" />
            <MyMealsPage />
          </ChefRoute>
        ),
      },
      {
        path: "order-requests",
        element: (
          <ChefRoute>
            <PageTitle title="Order Requests | Chef Origin" />
            <OrderRequestsPage />
          </ChefRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <PageTitle title="Manage Users | Chef Origin" />
            <ManageUsersPage />
          </AdminRoute>
        ),
      },
      {
        path: "manage-requests",
        element: (
          <AdminRoute>
            <PageTitle title="Manage Requests | Chef Origin" />
            <ManageRequestsPage />
          </AdminRoute>
        ),
      },
      {
        path: "statistics",
        element: (
          <AdminRoute>
            <PageTitle title="Statistics | Chef Origin" />
            <StatisticsPage />
          </AdminRoute>
        ),
      },
    ],
  },
]);
