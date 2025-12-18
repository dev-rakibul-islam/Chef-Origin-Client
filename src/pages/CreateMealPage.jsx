import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import imagekitUploader from "../utils/imagekitUploader";
import {
  FaUtensils,
  FaImage,
  FaDollarSign,
  FaList,
  FaClock,
  FaMapMarkerAlt,
  FaUserTie,
  FaEnvelope,
  FaIdCard,
  FaStar,
} from "react-icons/fa";

export default function CreateMealPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get(`/api/users/${user.uid}`);
        if (res.data.role !== "chef" && res.data.role !== "admin") {
          toast.error("Only chefs can create meals");
          navigate("/dashboard/profile");
          return;
        }
        if (res.data.status === "fraud") {
          toast.error("Your account is restricted. You cannot create meals.");
          navigate("/dashboard/profile");
          return;
        }
        setUserData(res.data);
      } catch (error) {
        toast.error("Failed to load user data");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, authLoading, navigate]);

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
    if (!userData) {
      toast.error("User data not loaded");
      return;
    }
    setSubmitting(true);
    try {
      const ingredients = data.ingredients
        .split(",")
        .map((ing) => ing.trim())
        .filter((ing) => ing.length > 0);

      const mealData = {
        foodName: data.foodName,
        chefName: userData.name,
        foodImage: data.foodImage,
        price: parseFloat(data.price),
        rating: parseFloat(data.rating),
        ingredients,
        estimatedDeliveryTime: data.estimatedDeliveryTime,
        chefExperience: data.chefExperience,
        chefId: userData.chefId,
        userEmail: user.email,
        deliveryArea: data.deliveryArea,
      };

      await axiosInstance.post("/api/meals", mealData);
      toast.success("Meal created successfully!");
      navigate("/dashboard/my-meals");
    } catch (error) {
      toast.error("Failed to create meal");
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold text-gray-700">
          Failed to load user data
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary bg-orange-500 border-none text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1
            className="text-4xl font-bold font-playfair mb-2"
            style={{ color: "var(--color-text-primary)" }}
          >
            Create New Meal
          </h1>
          <p style={{ color: "var(--color-text-light)" }}>
            Share your culinary masterpiece with the world
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          <div className="p-8 md:p-10">
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
                        min: { value: 0, message: "Price must be positive" },
                      })}
                    />
                  </div>
                  {errors.price && (
                    <span className="text-error text-xs mt-1 ml-1">
                      {errors.price.message}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium text-gray-700">
                      Rating
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaStar className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200"
                      {...register("rating", {
                        required: "Rating is required",
                        min: { value: 0, message: "Rating must be positive" },
                        max: { value: 5, message: "Rating cannot exceed 5" },
                      })}
                    />
                  </div>
                  {errors.rating && (
                    <span className="text-error text-xs mt-1 ml-1">
                      {errors.rating.message}
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

              {/* Section 4: Read-only Info */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium text-gray-500">
                      Chef Name
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserTie className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={userData?.name || ""}
                      disabled
                      className="input input-bordered w-full pl-10 bg-white text-gray-500"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label pt-0">
                    <span className="label-text font-medium text-gray-500">
                      Email
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="input input-bordered w-full pl-10 bg-white text-gray-500"
                    />
                  </div>
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label pt-0">
                    <span className="label-text font-medium text-gray-500">
                      Chef ID
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={userData?.chefId || ""}
                      disabled
                      className="input input-bordered w-full pl-10 bg-white text-gray-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="btn btn-primary w-full text-white text-lg normal-case bg-orange-500 hover:bg-orange-600 border-none shadow-lg shadow-orange-500/30"
                >
                  {submitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Publish Meal"
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
