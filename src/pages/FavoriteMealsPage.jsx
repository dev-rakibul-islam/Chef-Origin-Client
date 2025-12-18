import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaHeart } from "react-icons/fa";

export default function FavoriteMealsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get(`/api/favorites/${user.email}`);
        setFavorites(res.data);
      } catch (error) {
        toast.error("Failed to load favorites");
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  const handleDelete = async (favoriteId) => {
    try {
      await axiosInstance.delete(`/api/favorites/${favoriteId}`);
      setFavorites(favorites.filter((f) => f._id !== favoriteId));
      toast.success("Meal removed from favorites successfully.");
    } catch (error) {
      toast.error("Failed to remove from favorites");
      console.error("Error deleting favorite:", error);
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
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1
            className="text-4xl font-bold font-playfair mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            My Favorites
          </h1>
          <p style={{ color: "var(--color-text-light)" }}>
            Your curated collection of delicious meals
          </p>
        </motion.div>

        {favorites.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <table className="table w-full">
              {/* head */}
              <thead>
                <tr className="text-base text-gray-700 border-b-2 border-orange-100">
                  <th className="py-4">Meal Name</th>
                  <th className="py-4">Chef Name</th>
                  <th className="py-4">Price</th>
                  <th className="py-4">Date Added</th>
                  <th className="py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {favorites.map((favorite, index) => (
                    <motion.tr
                      key={favorite._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <td className="py-4 font-medium text-gray-800">
                        <div className="flex items-center gap-3">
                          {favorite.mealImage && (
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img
                                  src={favorite.mealImage}
                                  alt={favorite.mealName}
                                />
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="font-bold">{favorite.mealName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-600">
                        {favorite.chefName}
                      </td>
                      <td className="py-4 font-semibold text-orange-600">
                        {favorite.price ? `$${favorite.price}` : "N/A"}
                      </td>
                      <td className="py-4 text-gray-500">
                        {new Date(favorite.addedTime).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <button
                          onClick={() => handleDelete(favorite._id)}
                          className="btn btn-sm bg-red-50 text-red-500 hover:bg-red-100 border-none gap-2"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-4xl text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Favorites Yet
            </h3>
            <p className="text-gray-500 mb-8">
              Start exploring and save your favorite dishes here.
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
