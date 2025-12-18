import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaShoppingBag,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaUtensils,
  FaCreditCard,
  FaTag,
  FaTruck,
  FaUser,
  FaIdBadge,
} from "react-icons/fa";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (paymentUrl) {
      window.location.href = paymentUrl;
    }
  }, [paymentUrl]);

  const { data: orders = [], isLoading: loading } = useQuery({
    queryKey: ["userOrders", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/orders/user/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
    refetchInterval: 2000, // Poll every 2 seconds
  });

  const handlePayment = async (orderId) => {
    try {
      // Note: stripe.redirectToCheckout is deprecated for hosted checkout.
      // We use the URL returned by the backend instead.
      const res = await axiosInstance.post("/create-checkout-session", {
        orderId,
      });

      if (res.data.url) {
        setPaymentUrl(res.data.url);
      }
    } catch (error) {
      toast.error("Failed to initiate payment");
      console.error("Payment error:", error);
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
          className="mb-10 text-center md:text-left"
        >
          <h1
            className="text-4xl font-bold font-playfair mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span className="text-orange-500 text-5xl">O</span>rder History
          </h1>
          <p style={{ color: "var(--color-text-light)" }}>
            Track your past and current culinary adventures
          </p>
        </motion.div>

        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-orange-50 p-3 rounded-full">
                        <FaUtensils className="text-orange-500 text-xl" />
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                          order.orderStatus
                        )} uppercase tracking-wide`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <h2
                      className="text-xl font-bold text-gray-800 mb-2 line-clamp-1"
                      title={order.mealName}
                    >
                      {order.mealName}
                    </h2>

                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <FaClock className="text-gray-400" /> Date
                        </span>
                        <span className="font-medium">
                          {new Date(order.orderTime).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <FaTag className="text-gray-400" /> Price
                        </span>
                        <span className="font-medium">${order.price}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <FaShoppingBag className="text-gray-400" /> Quantity
                        </span>
                        <span className="font-medium">{order.quantity}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <FaMoneyBillWave className="text-gray-400" /> Total
                        </span>
                        <span className="font-bold text-lg text-gray-800">
                          ${(order.price * order.quantity).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <FaTruck className="text-gray-400" /> Delivery
                        </span>
                        <span className="font-medium">
                          {order.deliveryTime || "Standard"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <FaUser className="text-gray-400" /> Chef
                        </span>
                        <span className="font-medium">
                          {order.chefName || "Unknown"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <FaIdBadge className="text-gray-400" /> Chef ID
                        </span>
                        <span
                          className="font-medium text-xs truncate max-w-[150px]"
                          title={order.chefId}
                        >
                          {order.chefId}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gray-400" /> Address
                        </span>
                        <span
                          className="truncate max-w-[150px]"
                          title={order.userAddress}
                        >
                          {order.userAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    {order.orderStatus === "accepted" &&
                    order.paymentStatus === "Pending" ? (
                      <button
                        onClick={() => handlePayment(order._id)}
                        className="btn btn-primary w-full text-white gap-2"
                        style={{
                          backgroundColor: "var(--color-primary-accent)",
                          borderColor: "var(--color-primary-accent)",
                        }}
                      >
                        <FaCreditCard /> Pay Now
                      </button>
                    ) : order.paymentStatus === "paid" ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Payment Status</span>
                        <span className="badge badge-success text-white gap-1">
                          <FaCheckCircle className="text-xs" /> Paid
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Payment Status</span>
                        <span className="badge badge-ghost gap-1">
                          {order.paymentStatus || "Pending"}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-4xl text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-500 mb-8">
              You haven't placed any orders yet. Hungry?
            </p>
            <button
              onClick={() => navigate("/meals")}
              className="btn btn-primary text-white px-8"
              style={{
                backgroundColor: "var(--color-primary-accent)",
                borderColor: "var(--color-primary-accent)",
              }}
            >
              Browse Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FaCheckCircle({ className }) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      className={className}
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628 0z"></path>
    </svg>
  );
}
