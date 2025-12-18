import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaQuoteLeft,
  FaSave,
  FaTimes,
  FaCommentDots,
} from "react-icons/fa";

export default function MyReviewsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/api/reviews?email=${user.email}`);
        setReviews(res.data);
      } catch (error) {
        toast.error("Failed to load reviews");
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user, navigate]);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r._id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error("Failed to delete review");
      console.error("Error deleting review:", error);
    }
  };

  const handleEditStart = (review) => {
    setEditingId(review._id);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  const handleEditSave = async (reviewId) => {
    try {
      await axiosInstance.put(`/api/reviews/${reviewId}`, editData);
      setReviews(
        reviews.map((r) => (r._id === reviewId ? { ...r, ...editData } : r))
      );
      setEditingId(null);
      toast.success("Review updated successfully");
    } catch (error) {
      toast.error("Failed to update review");
      console.error("Error updating review:", error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  const renderEditableStars = (currentRating, setRating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <FaStar
              className={`text-2xl ${
                i < currentRating ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
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
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1
            className="text-4xl font-bold font-playfair mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            My Reviews
          </h1>
          <p style={{ color: "var(--color-text-light)" }}>
            Your feedback helps us improve
          </p>
        </motion.div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence>
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 p-4 sm:p-6 md:p-8 relative"
                >
                  <FaQuoteLeft className="absolute top-6 left-6 text-orange-100 text-6xl z-0" />

                  <div className="relative z-10">
                    {editingId === review._id ? (
                      <div className="space-y-4 bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
                        <div>
                          <label className="label text-sm font-bold text-gray-500 uppercase">
                            Rating
                          </label>
                          {renderEditableStars(editData.rating, (r) =>
                            setEditData({ ...editData, rating: r })
                          )}
                        </div>

                        <div>
                          <label className="label text-sm font-bold text-gray-500 uppercase">
                            Comment
                          </label>
                          <textarea
                            value={editData.comment}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                comment: e.target.value,
                              })
                            }
                            className="textarea textarea-bordered w-full focus:ring-2 focus:ring-orange-200"
                            rows="4"
                          ></textarea>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="btn btn-sm btn-ghost"
                          >
                            <FaTimes /> Cancel
                          </button>
                          <button
                            onClick={() => handleEditSave(review._id)}
                            className="btn btn-sm btn-primary text-white"
                            style={{
                              backgroundColor: "var(--color-primary-accent)",
                              borderColor: "var(--color-primary-accent)",
                            }}
                          >
                            <FaSave /> Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col sm:flex-row gap-4 mb-6 border-b border-gray-100 pb-4">
                          <div className="flex items-center gap-4 flex-1">
                            {review.mealImage && (
                              <img
                                src={review.mealImage}
                                alt={review.mealName}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shadow-sm"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 truncate">
                                {review.mealName || "Unknown Meal"}
                              </h3>
                              <div className="flex gap-1 text-sm">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end sm:self-start">
                            <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 text-base sm:text-lg italic mb-6 leading-relaxed pl-2 border-l-4 border-orange-200">
                          "{review.comment}"
                        </p>

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            onClick={() => handleEditStart(review)}
                            className="btn btn-sm btn-ghost text-gray-500 hover:text-orange-500 hover:bg-orange-50"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="btn btn-sm btn-ghost text-gray-500 hover:text-red-500 hover:bg-red-50"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCommentDots className="text-4xl text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-gray-500 mb-8">
              Share your thoughts on the meals you've tasted.
            </p>
            <button
              onClick={() => navigate("/meals")}
              className="btn btn-primary text-white px-8"
              style={{
                backgroundColor: "var(--color-primary-accent)",
                borderColor: "var(--color-primary-accent)",
              }}
            >
              Browse Meals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
