import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import LoadingPage from "./LoadingPage";
import {
  FaUtensils,
  FaUser,
  FaMapMarkerAlt,
  FaReceipt,
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelope,
  FaIdCard,
  FaHashtag,
} from "react-icons/fa";

export default function OrderPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);

  const quantity = watch("quantity") || 1;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMeal = async () => {
      try {
        // Check user status first
        const userRes = await axiosInstance.get(`/api/users/${user.uid}`);
        if (userRes.data.status === "fraud") {
          toast.error("Your account is restricted. You cannot place orders.");
          navigate("/");
          return;
        }

        const res = await axiosInstance.get(`/api/meals/${id}`);
        setMeal(res.data);
      } catch (error) {
        toast.error("Failed to load meal");
        console.error("Error fetching meal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeal();
  }, [id, user, navigate, authLoading]);

  const onSubmit = (data) => {
    const totalPrice = parseFloat(meal.price) * parseInt(data.quantity);
    setPendingOrderData({ ...data, totalPrice });
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    try {
      const orderData = {
        foodId: id,
        mealName: meal.foodName,
        price: meal.price,
        quantity: parseInt(pendingOrderData.quantity),
        chefId: meal.chefId,
        chefName: meal.chefName,
        deliveryTime: meal.estimatedDeliveryTime,
        userEmail: user.email,
        userAddress: pendingOrderData.address,
      };

      await axiosInstance.post("/api/orders", orderData);
      toast.success("Order placed successfully!");
      navigate("/dashboard/orders");
    } catch (error) {
      toast.error("Failed to place order");
      console.error("Error placing order:", error);
    }
  };

  if (authLoading || loading) {
    return <LoadingPage />;
  }

  if (!meal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Meal not found
          </h1>
          <button
            onClick={() => navigate("/meals")}
            className="btn btn-primary text-white"
          >
            Back to Meals
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = parseFloat(meal.price) * parseInt(quantity || 1);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(`/meals/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-8 font-medium"
        >
          <FaArrowLeft /> Back to Meal Details
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Order Summary & Meal Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 h-full"
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col">
              <div className="bg-orange-500 p-6 text-white">
                <h2 className="text-2xl font-bold font-playfair flex items-center gap-2">
                  <FaReceipt /> Order Summary
                </h2>
                <p className="opacity-90">
                  Review your order details before proceeding
                </p>
              </div>

              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0 text-orange-500 text-3xl">
                    {meal.mealImage ? (
                      <img
                        src={meal.mealImage}
                        alt={meal.foodName}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <FaUtensils />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {meal.foodName}
                    </h3>
                    <p className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                      <FaUser className="text-orange-400" /> Chef:{" "}
                      {meal.chefName}
                    </p>
                    <p className="text-orange-600 font-bold mt-1">
                      ${meal.price} / unit
                    </p>
                  </div>
                </div>

                <hr className="border border-dashed border-gray-200 my-4" />

                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Price per unit</span>
                    <span className="font-medium">${meal.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantity</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2">
                    <span>Total Amount</span>
                    <span className="text-orange-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Delivery Details Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-full flex flex-col">
              <h2 className="text-2xl font-bold font-playfair text-gray-800 mb-6">
                Delivery Details
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Read-only fields for context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label pt-0">
                      <span className="label-text font-medium text-gray-600">
                        Your Email
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={user.email}
                        disabled
                        className="input input-bordered w-full pl-10 bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="form-control">
                    <label className="label pt-0">
                      <span className="label-text font-medium text-gray-600">
                        Chef ID
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={meal.chefId}
                        disabled
                        className="input input-bordered w-full pl-10 bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium text-gray-800">
                      Quantity
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaHashtag className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      className="input input-bordered w-full pl-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      {...register("quantity", {
                        required: "Quantity is required",
                        min: {
                          value: 1,
                          message: "Quantity must be at least 1",
                        },
                      })}
                    />
                  </div>
                  {errors.quantity && (
                    <span className="text-error text-sm mt-1">
                      {errors.quantity.message}
                    </span>
                  )}
                </div>

                {/* Address Input */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium text-gray-800">
                      Delivery Address
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-gray-400">
                      <FaMapMarkerAlt />
                    </div>
                    <textarea
                      placeholder="Enter your full delivery address"
                      className="textarea textarea-bordered w-full pl-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 min-h-[120px]"
                      {...register("address", {
                        required: "Delivery address is required",
                        minLength: {
                          value: 10,
                          message: "Address must be at least 10 characters",
                        },
                      })}
                    ></textarea>
                  </div>
                  {errors.address && (
                    <span className="text-error text-sm mt-1">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn btn-primary w-full text-white text-lg normal-case bg-orange-500 hover:bg-orange-600 border-none shadow-lg shadow-orange-500/30"
                >
                  Proceed to Checkout
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              >
                <div className="bg-orange-500 p-6 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl">
                    <FaCheckCircle />
                  </div>
                  <h2 className="text-2xl font-bold text-white font-playfair">
                    Confirm Order
                  </h2>
                </div>

                <div className="p-8 text-center">
                  <p className="text-gray-600 text-lg mb-6">
                    You are about to place an order for{" "}
                    <span className="font-bold text-gray-800">
                      {quantity}x {meal.foodName}
                    </span>
                    .
                  </p>

                  <div className="bg-orange-50 rounded-xl p-4 mb-8">
                    <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
                      Total Amount
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      ${pendingOrderData?.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowConfirmation(false)}
                      className="btn btn-ghost flex-1 text-gray-500 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmOrder}
                      className="btn btn-primary flex-1 text-white bg-orange-500 hover:bg-orange-600 border-none"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
