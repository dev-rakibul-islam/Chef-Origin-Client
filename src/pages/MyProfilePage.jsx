import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdBadge,
  FaUserShield,
  FaUtensils,
  FaCheckCircle,
} from "react-icons/fa";

export default function MyProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const {
    data: userData,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/users/${user.uid}`);
      return res.data;
    },
    enabled: !!user?.uid,
    refetchInterval: 2000,
  });

  const handleBeChef = async () => {
    try {
      await axiosInstance.post("/api/requests", {
        userName: userData.name,
        userEmail: userData.email,
        requestType: "chef",
      });
      toast.success("Request submitted! Waiting for admin approval.");
      await refetch();
    } catch (error) {
      toast.error("Failed to submit request");
      console.error("Error:", error);
    }
  };

  const handleBeAdmin = async () => {
    try {
      await axiosInstance.post("/api/requests", {
        userName: userData.name,
        userEmail: userData.email,
        requestType: "admin",
      });
      toast.success("Request submitted! Waiting for admin approval.");
      await refetch();
    } catch (error) {
      toast.error("Failed to submit request");
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center md:text-left"
        >
          <h1
            className="text-4xl font-bold font-playfair"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span className="text-4xl md:text-5xl text-orange-500">M</span>y
            Profile
          </h1>
          <p style={{ color: "var(--color-text-light)" }}>
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="h-32 bg-linear-to-r from-orange-400 to-red-500 relative">
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 shadow-xl">
                      <img
                        src={
                          userData.photoURL || "https://via.placeholder.com/150"
                        }
                        alt={userData.name}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-20 pb-8 px-6 text-center">
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {userData.name}
                </h2>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--color-text-light)" }}
                >
                  {userData.email}
                </p>

                <div className="flex justify-center gap-2 mb-6">
                  <span
                    className={`badge badge-lg ${
                      userData.role === "admin"
                        ? "badge-error text-white"
                        : userData.role === "chef"
                        ? "badge-warning text-white"
                        : "badge-ghost"
                    }`}
                  >
                    {userData.role === "admin" && (
                      <FaUserShield className="mr-1" />
                    )}
                    {userData.role === "chef" && (
                      <FaUtensils className="mr-1" />
                    )}
                    {userData.role || "User"}
                  </span>
                  <span className="badge badge-lg badge-success text-white gap-1">
                    <FaCheckCircle className="text-xs" />{" "}
                    {userData.status || "Active"}
                  </span>
                </div>

                <hr className="border border-dashed border-gray-200 my-4" />

                <div className="flex flex-col gap-3">
                  {userData.role !== "chef" && userData.role !== "admin" && (
                    <button
                      onClick={handleBeChef}
                      className="btn btn-outline btn-warning w-full gap-2 hover:text-white"
                    >
                      <FaUtensils /> Request to be Chef
                    </button>
                  )}
                  {userData.role !== "admin" && (
                    <button
                      onClick={handleBeAdmin}
                      className="btn btn-outline btn-error w-full gap-2 hover:text-white"
                    >
                      <FaUserShield /> Request Admin Access
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-full">
              <h3
                className="text-xl font-bold mb-6 flex items-center gap-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                <FaIdBadge className="text-orange-500" /> Account Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-500">
                      Full Name
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={userData.name}
                      disabled
                      className="input input-bordered w-full pl-10 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-500">
                      Email Address
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="input input-bordered w-full pl-10 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium text-gray-500">
                      Delivery Address
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={userData.address}
                      disabled
                      className="input input-bordered w-full pl-10 bg-gray-50"
                    />
                  </div>
                </div>

                {userData.chefId && (
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium text-gray-500">
                        Chef ID
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUtensils className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={userData.chefId}
                        disabled
                        className="input input-bordered w-full pl-10 bg-gray-50 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-2">Account Status</h4>
                <p className="text-sm text-blue-600">
                  Your account is currently <strong>{userData.status}</strong>.
                  You have <strong>{userData.role}</strong> privileges.
                  {userData.role === "user" &&
                    " Upgrade to Chef to start selling your own meals!"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
