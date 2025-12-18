import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaCheck,
  FaTimes,
  FaTruck,
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaBoxOpen,
} from "react-icons/fa";

export default function OrderRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch user details to get chefId
  const { data: userData } = useQuery({
    queryKey: ["user", user?.uid],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/users/${user.uid}`);
      return res.data;
    },
    enabled: !!user?.uid,
  });

  // Fetch orders with polling
  const {
    data: orders = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["chefOrders", userData?.chefId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/orders/chef/${userData.chefId}`
      );
      return res.data;
    },
    enabled: !!userData?.chefId,
    refetchInterval: 2000, // Poll every 2 seconds
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/api/orders/${orderId}/status`, {
        orderStatus: newStatus,
      });

      await refetch();
      toast.success(`Order ${newStatus} successfully`);
    } catch (error) {
      toast.error("Failed to update order");
      console.error("Error updating order:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1
            className="text-4xl font-bold font-playfair mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Incoming Orders
          </h1>
          <p style={{ color: "var(--color-text-light)" }}>
            Manage and track your customer orders
          </p>
        </motion.div>

        {orders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-1">
                        {order.mealName}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaClock className="text-orange-400" />
                        {new Date(order.orderTime).toLocaleString()}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        order.orderStatus
                      )} uppercase tracking-wide`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-orange-50 p-3 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Customer
                        </p>
                        <div className="flex items-center gap-2 text-gray-800 font-medium">
                          <FaUser className="text-orange-400" />
                          <span className="truncate" title={order.userEmail}>
                            {order.userEmail}
                          </span>
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                          Total Amount
                        </p>
                        <div className="flex items-center gap-2 text-gray-800 font-medium">
                          <FaMoneyBillWave className="text-green-500" />
                          <span>
                            ${(order.price * order.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="flex items-center gap-2">
                          <FaBoxOpen className="text-gray-400" /> Quantity
                        </span>
                        <span className="font-bold">
                          {order.quantity} x ${order.price}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50">
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" /> Address
                        </span>
                        <span className="text-right max-w-[60%]">
                          {order.userAddress}
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-gray-400" /> Payment
                        </span>
                        <span
                          className={`badge badge-sm ${
                            order.paymentStatus === "paid"
                              ? "badge-success text-white"
                              : "badge-warning"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer / Actions */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleStatusChange(order._id, "cancelled")}
                      disabled={order.orderStatus !== "pending"}
                      className="btn btn-sm bg-white text-red-500 hover:bg-red-50 border-gray-200 hover:border-red-200 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <FaTimes /> Cancel
                    </button>
                    <button
                      onClick={() => handleStatusChange(order._id, "accepted")}
                      disabled={order.orderStatus !== "pending"}
                      className="btn btn-sm bg-white text-blue-500 hover:bg-blue-50 border-gray-200 hover:border-blue-200 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      onClick={() => handleStatusChange(order._id, "delivered")}
                      disabled={order.orderStatus !== "accepted"}
                      className="btn btn-sm bg-white text-green-500 hover:bg-green-50 border-gray-200 hover:border-green-200 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <FaTruck /> Deliver
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBoxOpen className="text-4xl text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-500">
              Wait for customers to discover your delicious meals!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
