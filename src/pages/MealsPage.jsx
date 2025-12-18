import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaSearch, FaStar, FaMapMarkerAlt, FaUtensils } from "react-icons/fa";
import { SiCodechef } from "react-icons/si";

export default function MealsPage() {
  const [allMeals, setAllMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const itemsPerPage = 10; // Changed to 9 for better grid alignment (3x3)

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axiosInstance.get("/api/meals");
        setAllMeals(response.data);
        setFilteredMeals(response.data);
      } catch (error) {
        toast.error("Failed to fetch meals");
        console.error("Error fetching meals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // Handle search and sort
  useEffect(() => {
    let results = allMeals;

    if (searchTerm.trim() !== "") {
      results = allMeals.filter(
        (meal) =>
          meal.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meal.chefName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meal.deliveryArea?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...results].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    setFilteredMeals(sorted);
    setCurrentPage(1);
  }, [searchTerm, sortOrder, allMeals]);

  const handleViewDetails = (mealId) => {
    if (!user) {
      toast.error("Please login first to view details");
      navigate("/login");
      return;
    }
    navigate(`/meals/${mealId}`);
  };

  // Pagination
  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMeals = filteredMeals.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen py-12 w-11/12 mx-auto">
      <div className="">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1
            className="text-4xl  font-bold mb-4 font-playfair"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span className="text-4xl md:text-5xl text-orange-500">E</span>
            xplore Our Menu
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: "var(--color-text-light)" }}
          >
            Discover delicious meals prepared by our expert chefs. From local
            favorites to international cuisines, find your perfect dish today.
          </p>
        </motion.div>

        {/* Controls Section */}
        <motion.div
          className="bg-white rounded-2xl p-6 mb-10 shadow-sm border border-white/50"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/2 lg:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search meals, chefs, or locations..."
                className="input input-bordered w-full pl-10 bg-white/80 focus:bg-white transition-colors"
                style={{
                  borderColor: "var(--color-bg-dark)",
                  color: "var(--color-text-primary)",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span
                className="text-sm font-medium hidden md:inline"
                style={{ color: "var(--color-text-light)" }}
              >
                Sort by Price:
              </span>
              <div className="join w-full md:w-auto">
                <button
                  onClick={() => setSortOrder("asc")}
                  className={`join-item btn btn-sm flex-1 ${
                    sortOrder === "asc" ? "btn-active" : ""
                  }`}
                  style={{
                    backgroundColor:
                      sortOrder === "asc"
                        ? "var(--color-primary-accent)"
                        : "white",
                    color:
                      sortOrder === "asc"
                        ? "white"
                        : "var(--color-text-primary)",
                    borderColor: "var(--color-bg-dark)",
                  }}
                >
                  Low to High
                </button>
                <button
                  onClick={() => setSortOrder("desc")}
                  className={`join-item btn btn-sm flex-1 ${
                    sortOrder === "desc" ? "btn-active" : ""
                  }`}
                  style={{
                    backgroundColor:
                      sortOrder === "desc"
                        ? "var(--color-primary-accent)"
                        : "white",
                    color:
                      sortOrder === "desc"
                        ? "white"
                        : "var(--color-text-primary)",
                    borderColor: "var(--color-bg-dark)",
                  }}
                >
                  High to Low
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center text-sm border-t border-gray-200 pt-4">
            <span style={{ color: "var(--color-text-light)" }}>
              Showing {paginatedMeals.length} of {filteredMeals.length} results
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-red-500 hover:underline text-xs"
              >
                Clear Search
              </button>
            )}
          </div>
        </motion.div>

        {/* Meals Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <span
              className="loading loading-spinner loading-lg"
              style={{ color: "var(--color-primary-accent)" }}
            ></span>
          </div>
        ) : paginatedMeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedMeals.map((meal) => (
              <motion.div
                key={meal._id}
                className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Image Container */}
                <figure className="h-64 overflow-hidden relative">
                  <img
                    src={
                      meal.foodImage || "https://via.placeholder.com/400x300"
                    }
                    alt={meal.foodName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-bold text-sm">
                      {meal.rating || "New"}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm flex items-center gap-2">
                      <FaMapMarkerAlt className="text-orange-400" />
                      {meal.deliveryArea || "Available everywhere"}
                    </p>
                  </div>
                </figure>

                {/* Card Body */}
                <div className="card-body p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2
                      className="card-title text-xl font-bold line-clamp-1"
                      style={{ color: "var(--color-text-primary)" }}
                      title={meal.foodName}
                    >
                      {meal.foodName}
                    </h2>
                    <div
                      className="badge badge-lg font-bold border-none"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "var(--color-primary-accent)",
                        top: "-2.4rem",
                        position: "relative",
                        borderRadius: "5rem",
                      }}
                    >
                      ${meal.price}
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-2 mb-4 text-sm"
                    style={{ color: "var(--color-text-light)" }}
                  >
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-6">
                        <SiCodechef size={20} className="text-orange-500" />
                      </div>
                    </div>
                    <span className="font-medium">
                      Chef: {meal.chefName} | ID: {meal.chefId}{" "}
                    </span>
                  </div>

                  <div className="card-actions mt-auto">
                    <button
                      onClick={() => handleViewDetails(meal._id)}
                      className="btn btn-block text-white border-none relative overflow-hidden group/btn"
                      style={{
                        backgroundColor: "var(--color-primary-accent)",
                      }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        View Details <FaUtensils />
                      </span>
                      <div className="absolute inset-0 bg-black/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🍽️</div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              No meals found
            </h3>
            <p style={{ color: "var(--color-text-light)" }}>
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortOrder("asc");
              }}
              className="btn btn-link mt-4"
              style={{ color: "var(--color-primary-accent)" }}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="join shadow-sm">
              <button
                className="join-item btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`join-item btn ${
                      currentPage === page ? "btn-active" : ""
                    }`}
                    style={{
                      backgroundColor:
                        currentPage === page
                          ? "var(--color-primary-accent)"
                          : "white",
                      color:
                        currentPage === page
                          ? "white"
                          : "var(--color-text-primary)",
                      borderColor:
                        currentPage === page
                          ? "var(--color-primary-accent)"
                          : "#e5e7eb",
                    }}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                className="join-item btn"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
