import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import imagekitUploader from "../utils/imagekitUploader";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaUtensils,
  FaUserTie,
  FaIdCard,
  FaImage,
  FaDollarSign,
  FaList,
  FaTimes,
} from "react-icons/fa";

export default function MyMealsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const {
    data: meals = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["myMeals", user?.email],
    queryFn: async () => {
      const allMeals = await axiosInstance.get("/api/meals");
      const chefMeals = allMeals.data.filter(
        (meal) => meal.userEmail === user.email
      );
      return chefMeals;
    },
    enabled: !!user?.email,
    refetchInterval: 5000,
  });

  const handleDelete = async (mealId) => {
    if (!window.confirm("Are you sure you want to delete this meal?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/meals/${mealId}`);
      await refetch();
      toast.success("Meal deleted successfully");
    } catch (error) {
      toast.error("Failed to delete meal");
      console.error("Error deleting meal:", error);
    }
  };

  const handleEditStart = (meal) => {
    setEditingMeal(meal);
    setImagePreview(meal.foodImage);
    reset({
      foodName: meal.foodName,
      price: meal.price,
      deliveryArea: meal.deliveryArea,
      estimatedDeliveryTime: meal.estimatedDeliveryTime,
      ingredients: Array.isArray(meal.ingredients)
        ? meal.ingredients.join(", ")
        : meal.ingredients,
      chefExperience: meal.chefExperience,
      foodImage: meal.foodImage,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await imagekitUploader(file);
      setValue("foodImage", url);
      setImagePreview(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const ingredients = data.ingredients
        .split(",")
        .map((ing) => ing.trim())
        .filter((ing) => ing.length > 0);

      const updatedMealData = {
        ...data,
        ingredients,
        price: parseFloat(data.price),
      };

      await axiosInstance.put(`/api/meals/${editingMeal._id}`, updatedMealData);
      await refetch();
      setIsModalOpen(false);
      setEditingMeal(null);
      toast.success("Meal updated successfully");
    } catch (error) {
      toast.error("Failed to update meal");
      console.error("Error updating meal:", error);
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div>
            <h1
              className="text-4xl font-bold font-playfair mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              My Culinary Creations
            </h1>
            <p style={{ color: "var(--color-text-light)" }}>
              Manage your menu and update your offerings
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/create-meal")}
            className="btn text-white px-6 h-12 shadow-lg flex items-center gap-2"
            style={{
              backgroundColor: "var(--color-primary-accent)",
              borderColor: "var(--color-primary-accent)",
            }}
          >
            <FaPlus /> Add New Meal
          </motion.button>
        </div>

        {meals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {meals.map((meal) => (
                <motion.div
                  key={meal._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col"
                >
                  <figure className="h-56 relative overflow-hidden group">
                    <img
                      src={
                        meal.foodImage || "https://via.placeholder.com/400x300"
                      }
                      alt={meal.foodName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm font-bold text-orange-600">
                      ${meal.price}
                    </div>
                  </figure>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h2
                        className="text-xl font-bold font-playfair text-gray-800 line-clamp-1"
                        title={meal.foodName}
                      >
                        {meal.foodName}
                      </h2>
                      <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                        <FaStar /> {meal.rating}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FaUserTie className="text-orange-400" />
                        <span className="font-medium">{meal.chefName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FaIdCard className="text-orange-400" />
                        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {meal.chefId || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FaClock className="text-orange-400" />
                        <span>{meal.estimatedDeliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FaMapMarkerAlt className="text-orange-400" />
                        <span className="line-clamp-1">
                          {meal.deliveryArea}
                        </span>
                      </div>
                      {meal.ingredients && meal.ingredients.length > 0 && (
                        <div className="flex items-start gap-2 text-gray-500 text-sm mt-2">
                          <FaUtensils className="text-orange-400 mt-1 shrink-0" />
                          <span className="line-clamp-2 text-xs">
                            {Array.isArray(meal.ingredients)
                              ? meal.ingredients.join(", ")
                              : meal.ingredients}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleEditStart(meal)}
                        className="btn btn-sm flex-1 bg-orange-50 text-orange-600 hover:bg-orange-100 border-none"
                      >
                        <FaEdit /> Update
                      </button>
                      <button
                        onClick={() => handleDelete(meal._id)}
                        className="btn btn-sm flex-1 bg-red-50 text-red-600 hover:bg-red-100 border-none"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUtensils className="text-4xl text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Meals Yet
            </h3>
            <p className="text-gray-500 mb-8">
              Start your journey by creating your first delicious meal.
            </p>
            <button
              onClick={() => navigate("/dashboard/create-meal")}
              className="btn btn-primary text-white px-8"
              style={{
                backgroundColor: "var(--color-primary-accent)",
                borderColor: "var(--color-primary-accent)",
              }}
            >
              Create Your First Meal
            </button>
          </div>
        )}
      </div>

      {/* Update Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-2xl font-bold font-playfair text-gray-800">
                  Update Meal
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Section 1: Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label pt-0">
                        <span className="label-text font-medium text-gray-700">
                          Food Name
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUtensils className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Spicy Chicken Curry"
                          className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200"
                          {...register("foodName", {
                            required: "Food name is required",
                          })}
                        />
                      </div>
                      {errors.foodName && (
                        <span className="text-error text-xs mt-1 ml-1">
                          {errors.foodName.message}
                        </span>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label pt-0">
                        <span className="label-text font-medium text-gray-700">
                          Price ($)
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaDollarSign className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200"
                          {...register("price", {
                            required: "Price is required",
                            min: {
                              value: 0,
                              message: "Price must be positive",
                            },
                          })}
                        />
                      </div>
                      {errors.price && (
                        <span className="text-error text-xs mt-1 ml-1">
                          {errors.price.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Section 2: Image & Details */}
                  <div className="form-control">
                    <label className="label pt-0">
                      <span className="label-text font-medium text-gray-700">
                        Food Image
                      </span>
                    </label>
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaImage className="text-gray-400" />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file-input file-input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200"
                        />
                        <input
                          type="hidden"
                          {...register("foodImage", {
                            required: "Food image is required",
                          })}
                        />
                      </div>
                      {uploadingImage && (
                        <div className="text-sm text-orange-500 flex items-center gap-2">
                          <span className="loading loading-spinner loading-xs"></span>
                          Uploading image...
                        </div>
                      )}
                      {imagePreview && (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {errors.foodImage && (
                      <span className="text-error text-xs mt-1 ml-1">
                        {errors.foodImage.message}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label pt-0">
                        <span className="label-text font-medium text-gray-700">
                          Estimated Delivery Time
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaClock className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. 30-45 mins"
                          className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200"
                          {...register("estimatedDeliveryTime", {
                            required: "Delivery time is required",
                          })}
                        />
                      </div>
                      {errors.estimatedDeliveryTime && (
                        <span className="text-error text-xs mt-1 ml-1">
                          {errors.estimatedDeliveryTime.message}
                        </span>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label pt-0">
                        <span className="label-text font-medium text-gray-700">
                          Delivery Area
                        </span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Downtown, North Side"
                          className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200"
                          {...register("deliveryArea", {
                            required: "Delivery area is required",
                          })}
                        />
                      </div>
                      {errors.deliveryArea && (
                        <span className="text-error text-xs mt-1 ml-1">
                          {errors.deliveryArea.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Section 3: Descriptions */}
                  <div className="form-control">
                    <label className="label pt-0">
                      <span className="label-text font-medium text-gray-700">
                        Ingredients (comma separated)
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FaList className="text-gray-400" />
                      </div>
                      <textarea
                        placeholder="Chicken, Spices, Rice, Onion, Garlic..."
                        className="textarea textarea-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200 min-h-[100px]"
                        {...register("ingredients", {
                          required: "Ingredients are required",
                        })}
                      ></textarea>
                    </div>
                    {errors.ingredients && (
                      <span className="text-error text-xs mt-1 ml-1">
                        {errors.ingredients.message}
                      </span>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label pt-0">
                      <span className="label-text font-medium text-gray-700">
                        Chef Experience
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <FaStar className="text-gray-400" />
                      </div>
                      <textarea
                        placeholder="Describe your experience with this dish..."
                        className="textarea textarea-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200 min-h-[100px]"
                        {...register("chefExperience", {
                          required: "Experience is required",
                        })}
                      ></textarea>
                    </div>
                    {errors.chefExperience && (
                      <span className="text-error text-xs mt-1 ml-1">
                        {errors.chefExperience.message}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn flex-1 btn-outline border-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || uploadingImage}
                      className="btn flex-1 btn-primary text-white bg-orange-500 hover:bg-orange-600 border-none"
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
