import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaSearch,
  FaUserShield,
  FaBan,
  FaUser,
  FaEnvelope,
  FaCheckCircle,
} from "react-icons/fa";

export default function ManageUsersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const {
    data: users = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/users");
      return res.data;
    },
    refetchInterval: 2000,
  });

  const handleMakeFraud = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to mark this user as fraud? They won't be able to place orders/create meals."
      )
    ) {
      return;
    }

    try {
      await axiosInstance.put(`/api/users/${userId}`, {
        status: "fraud",
      });

      await refetch();
      toast.success("User marked as fraud");
    } catch (error) {
      toast.error("Failed to update user status");
      console.error("Error updating user:", error);
    }
  };

  const filteredUsers = users
    .filter((u) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower) ||
        u.role.toLowerCase().includes(searchLower) ||
        (u.status || "").toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "email") return a.email.localeCompare(b.email);
      if (sortBy === "role") return a.role.localeCompare(b.role);
      if (sortBy === "status")
        return (a.status || "").localeCompare(b.status || "");
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4"
        >
          <div>
            <h1
              className="text-4xl font-bold font-playfair mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              <span className="text-4xl md:text-5xl text-orange-500">U</span>ser
              Management
            </h1>
            <p style={{ color: "var(--color-text-light)" }}>
              Oversee platform users and maintain security
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select
              className="select select-bordered w-full md:w-40 focus:ring-2 focus:ring-orange-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
              <option value="status">Status</option>
            </select>
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((userData) => (
                    <tr
                      key={userData._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="rounded-full w-10 h-10 bg-linear-to-br from-orange-400 to-red-500 text-white flex items-center justify-center font-bold">
                              {userData.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">
                              {userData.name}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <FaEnvelope className="text-xs" />{" "}
                              {userData.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`badge ${
                            userData.role === "admin"
                              ? "badge-primary"
                              : userData.role === "chef"
                              ? "badge-secondary"
                              : "badge-ghost"
                          } capitalize`}
                        >
                          {userData.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {userData.status === "fraud" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <FaBan className="text-xs" /> Fraud
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FaCheckCircle className="text-xs" /> Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {userData.role !== "admin" &&
                          userData.status !== "fraud" && (
                            <button
                              onClick={() => handleMakeFraud(userData._id)}
                              className="btn btn-sm btn-error btn-outline gap-2"
                            >
                              <FaUserShield /> Mark Fraud
                            </button>
                          )}
                        {userData.status === "fraud" && (
                          <span className="text-xs text-gray-400 italic">
                            Restricted Access
                          </span>
                        )}
                        {userData.role === "admin" && (
                          <span className="text-xs text-gray-400 italic">
                            Admin User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">
                      No users found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
