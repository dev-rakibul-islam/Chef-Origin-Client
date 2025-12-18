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
  FaHistory,
  FaUserClock,
  FaUserTie,
  FaUserShield,
} from "react-icons/fa";

export default function ManageRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const {
    data: requests = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/requests");
      return res.data;
    },
    refetchInterval: 2000,
  });

  const handleApprove = async (requestId, requestType) => {
    try {
      await axiosInstance.put(`/api/requests/${requestId}`, {
        requestStatus: "approved",
        newRole: requestType,
      });

      await refetch();
      toast.success(`Request approved! User is now a ${requestType}.`);
    } catch (error) {
      toast.error("Failed to approve request");
      console.error("Error approving request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axiosInstance.put(`/api/requests/${requestId}`, {
        requestStatus: "rejected",
      });

      await refetch();
      toast.success("Request rejected");
    } catch (error) {
      toast.error("Failed to reject request");
      console.error("Error rejecting request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  const pendingRequests = requests.filter((r) => r.requestStatus === "pending");
  const processedRequests = requests.filter(
    (r) => r.requestStatus !== "pending"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className="text-4xl font-bold font-playfair mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span className="text-4xl md:text-5xl text-orange-500">R</span>
            equest Management
          </h1>
          <p style={{ color: "var(--color-text-light)" }}>
            Review and manage role upgrade requests
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-3 px-4 font-bold text-sm uppercase tracking-wide transition-colors relative ${
              activeTab === "pending"
                ? "text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <FaUserClock /> Pending ({pendingRequests.length})
            </div>
            {activeTab === "pending" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 px-4 font-bold text-sm uppercase tracking-wide transition-colors relative ${
              activeTab === "history"
                ? "text-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <FaHistory /> History ({processedRequests.length})
            </div>
            {activeTab === "history" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
              />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "pending" ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              {pendingRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr className="bg-orange-50 border-b border-orange-100">
                        <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider">
                          User
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider">
                          Request Type
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-orange-800 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="py-4 px-6 text-right text-xs font-bold text-orange-800 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pendingRequests.map((request) => (
                        <tr
                          key={request._id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-800">
                              {request.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.userEmail}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                              {request.requestType === "chef" ? (
                                <FaUserTie />
                              ) : (
                                <FaUserShield />
                              )}
                              {request.requestType}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {new Date(request.requestTime).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() =>
                                handleApprove(request._id, request.requestType)
                              }
                              className="btn btn-sm btn-success text-white gap-1"
                            >
                              <FaCheck /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(request._id)}
                              className="btn btn-sm btn-error text-white gap-1"
                            >
                              <FaTimes /> Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  No pending requests at the moment.
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              {processedRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Request Type
                        </th>
                        <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {processedRequests.map((request) => (
                        <tr
                          key={request._id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <div className="font-bold text-gray-800">
                              {request.userName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.userEmail}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {request.requestType}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            {request.requestStatus === "approved" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                <FaCheck className="text-xs" /> Approved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 capitalize">
                                <FaTimes className="text-xs" /> Rejected
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right text-sm text-gray-600">
                            {new Date(request.requestTime).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  No request history found.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
