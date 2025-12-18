import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FiHeart,
  FiShoppingCart,
  FiClock,
  FiMapPin,
  FiUser,
  FiStar,
  FiArrowLeft,
  FiCheck,
  FiMessageSquare,
} from "react-icons/fi";

export default function MealDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("description");
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Tabs dragging logic
  const tabsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    tabsRef.current.scrollLeft = scrollLeft - walk;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { data: meal, isLoading: mealLoading } = useQuery({
    queryKey: ["meal", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/meals/${id}`);
      return res.data;
    },
  });

  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/meals/${id}/reviews`);
      return res.data;
    },
    refetchInterval: 5000,
  });

  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ["favorites", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/favorites/${user.email}`);
      return res.data;
    },
    enabled: !!user,
  });

  const { data: userData } = useQuery({
    queryKey: ["userStatus", user?.uid],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/users/${user.uid}`);
      return res.data;
    },
    enabled: !!user,
  });

  const isFavorite = favorites.some((fav) => fav.mealId === id);
  const userStatus = userData?.status;
  const loading = mealLoading;

  const handleAddToFavorites = async () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (isFavorite) {
      toast.error("This meal is already in your favorites!");
      return;
    }

    try {
      await axiosInstance.post("/api/favorites", {
        userEmail: user.email,
        mealId: id,
        mealName: meal.foodName,
        chefId: meal.chefId,
        chefName: meal.chefName,
        price: meal.price,
      });
      await refetchFavorites();
      toast.success("Meal added to favorites successfully!");
    } catch (error) {
      toast.error("Failed to add to favorites");
      console.error("Error adding to favorites:", error);
    }
  };

  const handleOrderNow = () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    if (userStatus === "fraud") {
      toast.error("Your account is restricted. You cannot place orders.");
      return;
    }
    navigate(`/order/${id}`);
  };

  const onSubmitReview = async (data) => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axiosInstance.post("/api/reviews", {
        foodId: id,
        reviewerName: user.displayName || "Anonymous",
        reviewerEmail: user.email,
        reviewerImage: user.photoURL || "https://via.placeholder.com/50",
        rating: parseInt(data.rating),
        comment: data.comment,
      });

      toast.success("Review posted successfully!");
      reset();
      setShowReviewForm(false);

      // Reload reviews
      await refetchReviews();
    } catch (error) {
      toast.error("Failed to post review");
      console.error("Error posting review:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <span className="loading loading-spinner loading-lg text-primary-accent"></span>
      </div>
    );
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

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : meal.rating || "0.0";

  return (
    <div className="min-h-screen py-12 px-4 w-11/12 mx-auto">
      <div className="">
        <button
          onClick={() => navigate("/meals")}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-accent transition-colors mb-8 font-medium"
        >
          <FiArrowLeft /> Back to Meals
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 mb-16 items-start">
          {/* Meal Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative group"
          >
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-100 border-4 border-white h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={meal.foodImage || "https://via.placeholder.com/500"}
                alt={meal.foodName}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              {/* Floating Category Badge */}
              <div className="absolute top-6 left-6 z-20">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-gray-900 rounded-full text-sm font-bold shadow-lg border border-white/50 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  {meal.category || "Homemade"}
                </span>
              </div>
            </div>
            {/* Decorative background blob */}
            <div className="absolute -z-10 top-10 -left-10 w-full h-full bg-orange-200/30 rounded-[3rem] blur-3xl transform -rotate-3" />
          </motion.div>

          {/* Meal Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col h-full justify-center"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                  <FiStar className="text-yellow-500 fill-current text-lg" />
                  <span className="font-bold text-gray-900">
                    {meal.rating || "New"}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">
                    ({reviews.length} reviews)
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                  <FiMapPin className="text-orange-500" />
                  {meal.deliveryArea || "Local Area"}
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 font-serif leading-tight tracking-tight">
                {meal.foodName}
              </h1>

              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-orange-100 p-1 border-2 border-white shadow-md">
                    <div className="w-full h-full rounded-full bg-orange-500 flex items-center justify-center overflow-hidden">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">
                      Created by & id
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      Chef {meal.chefName} | {meal.chefId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-orange-600">
                    ${meal.price}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="p-5 bg-white rounded-2xl border border-orange-100 hover:border-orange-200 transition-colors group">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <FiClock className="text-white text-xl" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Delivery Time
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {meal.estimatedDeliveryTime || "30-45 mins"}
                  </p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-blue-100 hover:border-blue-200 transition-colors group">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <FiCheck className="text-white text-xl" />
                  </div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Chef Experience
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {meal.chefExperience || "Professional"}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-auto">
                <motion.button
                  // whileHover={{
                  //   scale: 1.02,
                  //   boxShadow: "0 20px 25px -5px rgba(249, 115, 22, 0.4)",
                  // }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOrderNow}
                  className="btn flex-1 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-16 text-lg rounded-2xl border-none shadow-orange-200 font-bold tracking-wide"
                >
                  <FiShoppingCart className="mr-2 text-xl" /> Order Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToFavorites}
                  className={`btn h-16 w-16 rounded-2xl border-2 transition-all duration-300 ${
                    isFavorite
                      ? "bg-red-50 border-red-500 text-red-500 shadow-lg shadow-red-100"
                      : "bg-white border-gray-200 text-gray-400 hover:border-orange-500 hover:text-orange-500 hover:shadow-lg"
                  }`}
                >
                  <FiHeart
                    className={`text-2xl ${isFavorite ? "fill-current" : ""}`}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div
            ref={tabsRef}
            className="flex border-b border-gray-100 overflow-x-auto cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            {["description", "ingredients", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 font-semibold text-lg capitalize transition-colors relative shrink-0 ${
                  activeTab === tab
                    ? "text-primary-accent"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-primary-accent"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-8 min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="prose max-w-none text-gray-600"
                >
                  <p className="text-lg leading-relaxed">
                    {meal.description ||
                      `Experience the authentic taste of ${meal.foodName}, prepared with love and care by Chef ${meal.chefName}. This dish represents the finest home cooking, using only fresh, locally sourced ingredients to ensure the highest quality and taste. Perfect for a comforting meal at home without the hassle of cooking.`}
                  </p>
                </motion.div>
              )}

              {activeTab === "ingredients" && (
                <motion.div
                  key="ingredients"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {meal.ingredients && meal.ingredients.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {meal.ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-2 h-2 rounded-full bg-primary-accent"></div>
                          <span className="text-gray-700 font-medium">
                            {ingredient}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">
                      Ingredients list not available.
                    </p>
                  )}
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* Review Summary Header */}
                  <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                      <div className="text-center md:text-left">
                        <div className="text-5xl font-bold text-gray-900 mb-2">
                          {averageRating}
                        </div>
                        <div className="flex justify-center md:justify-start text-yellow-400 mb-2 text-xl">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={
                                i < Math.round(parseFloat(averageRating))
                                  ? "fill-current"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-gray-500 font-medium">
                          Based on {reviews.length} reviews
                        </p>
                      </div>

                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = reviews.filter(
                            (r) => r.rating === star
                          ).length;
                          const percent = reviews.length
                            ? (count / reviews.length) * 100
                            : 0;
                          return (
                            <div
                              key={star}
                              className="flex items-center gap-3 text-sm"
                            >
                              <span className="font-bold w-3">{star}</span>
                              <FiStar className="text-yellow-400 fill-current w-4 h-4" />
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percent}%` }}
                                ></div>
                              </div>
                              <span className="text-gray-400 w-8 text-right">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-center md:text-right">
                        <p className="text-gray-600 mb-4">
                          Share your experience with others
                        </p>
                        <button
                          onClick={() => setShowReviewForm(!showReviewForm)}
                          className="btn btn-primary text-white w-full md:w-auto shadow-lg shadow-orange-200"
                        >
                          {showReviewForm ? "Cancel Review" : "Write a Review"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Review Form */}
                  <AnimatePresence>
                    {showReviewForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <form
                          onSubmit={handleSubmit(onSubmitReview)}
                          className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm mb-8"
                        >
                          <div className="flex flex-col md:flex-row gap-8">
                            {/* Left Side: Rating */}
                            <div className="md:w-1/3 space-y-4 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                              <h3 className="text-lg font-bold text-gray-900">
                                Rate your experience
                              </h3>
                              <p className="text-sm text-gray-500">
                                How was your meal? Tap the stars to rate.
                              </p>
                              <div className="form-control">
                                <div className="rating rating-lg gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <input
                                      key={star}
                                      type="radio"
                                      value={star}
                                      {...register("rating", {
                                        required: true,
                                      })}
                                      className="mask mask-star-2 bg-orange-400 hover:scale-110 transition-transform"
                                    />
                                  ))}
                                </div>
                                {errors.rating && (
                                  <span className="text-error text-sm mt-2">
                                    Please select a rating
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Right Side: Comment */}
                            <div className="md:w-2/3 space-y-4">
                              <div className="form-control">
                                <label className="label font-bold text-gray-900 text-lg pt-0">
                                  Share your thoughts
                                </label>
                                <textarea
                                  {...register("comment", {
                                    required: "Comment is required",
                                    minLength: 10,
                                  })}
                                  className="textarea textarea-bordered h-40 focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 text-base w-full rounded-xl bg-gray-50"
                                  placeholder="What did you like or dislike? What should other customers know?"
                                ></textarea>
                                {errors.comment && (
                                  <span className="text-error text-sm mt-1">
                                    {errors.comment.message}
                                  </span>
                                )}
                              </div>

                              <div className="flex justify-end pt-2">
                                <button
                                  type="submit"
                                  className="btn btn-primary text-white px-8 rounded-xl shadow-lg shadow-orange-200"
                                >
                                  Post Review
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Reviews Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={review._id}
                          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  review.reviewerImage ||
                                  "https://via.placeholder.com/50"
                                }
                                alt={review.reviewerName}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                              />
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm">
                                  {review.reviewerName}
                                </h4>
                                <span className="text-xs text-gray-400">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex bg-orange-50 px-2 py-1 rounded-lg">
                              <span className="font-bold text-orange-500 text-sm mr-1">
                                {review.rating}
                              </span>
                              <FiStar className="w-4 h-4 text-orange-500 fill-current mt-0.5" />
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                            {review.comment}
                          </p>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiMessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          No reviews yet
                        </h3>
                        <p className="text-gray-500">
                          Be the first to share your experience with this meal.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
