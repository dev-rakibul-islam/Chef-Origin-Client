import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FaUsers,
  FaShoppingBag,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function StatisticsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const { data: statistics, isLoading: loading } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/statistics");
      return res.data;
    },
    refetchInterval: 5000, // Poll every 5 seconds for stats
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-500">Failed to load statistics</p>
      </div>
    );
  }

  // Data for charts
  const orderStatusData = [
    { name: "Pending", value: statistics.pendingOrders },
    { name: "Delivered", value: statistics.deliveredOrders },
  ];

  const metricsData = [
    { name: "Users", value: statistics.totalUsers },
    { name: "Orders", value: statistics.totalOrders },
    { name: "Pending", value: statistics.pendingOrders },
    { name: "Delivered", value: statistics.deliveredOrders },
  ];

  const PIE_COLORS = ["#f59e0b", "#10b981"]; // Amber (Pending), Emerald (Delivered)
  const BAR_COLOR = "#8b5cf6"; // Violet-500

  const StatCard = ({
    title,
    value,
    icon: Icon,
    colorFrom,
    colorTo,
    delay,
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ delay, type: "spring", stiffness: 300 }}
      className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-between overflow-hidden relative group"
    >
      <div className="z-10">
        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      <div
        className={`p-4 rounded-2xl bg-linear-to-br ${colorFrom} ${colorTo} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="text-2xl" />
      </div>
      <div
        className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-linear-to-br ${colorFrom} ${colorTo} opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-300`}
      />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold font-playfair mb-2 ">
            <span className="text-4xl md:text-5xl text-orange-500">P</span>
            latform Analytics
          </h1>
          <p className="text-gray-500 text-lg">
            Real-time insights and performance metrics
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <StatCard
            title="Total Revenue"
            value={`$${statistics.totalPayment?.toFixed(2) || "0.00"}`}
            icon={FaMoneyBillWave}
            colorFrom="from-violet-500"
            colorTo="to-purple-600"
            delay={0}
          />
          <StatCard
            title="Total Users"
            value={statistics.totalUsers}
            icon={FaUsers}
            colorFrom="from-blue-400"
            colorTo="to-indigo-600"
            delay={0.1}
          />
          <StatCard
            title="Pending Orders"
            value={statistics.pendingOrders}
            icon={FaClock}
            colorFrom="from-amber-400"
            colorTo="to-orange-500"
            delay={0.2}
          />
          <StatCard
            title="Delivered Orders"
            value={statistics.deliveredOrders}
            icon={FaCheckCircle}
            colorFrom="from-emerald-400"
            colorTo="to-green-600"
            delay={0.3}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Order Status Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Order Status Distribution
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Metrics Bar Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Platform Overview
            </h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metricsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f9fafb" }}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      padding: "12px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill={BAR_COLOR}
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
