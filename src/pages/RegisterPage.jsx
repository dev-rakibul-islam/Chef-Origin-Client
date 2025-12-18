import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../services/axiosInstance";
import toast from "react-hot-toast";
import imagekitUploader from "../utils/imagekitUploader";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaArrowRight,
  FaCloudUploadAlt,
} from "react-icons/fa";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [progress, setProgress] = useState(0);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const password = watch("password");

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleRegistration = async (data) => {
    const file = data.imageUrl[0];

    if (!file) {
      toast.error("Please select a profile image");
      return;
    }
    try {
      const url = await imagekitUploader(file, (event) => {
        setProgress((event.loaded / event.total) * 100);
      });
      data.imageUrl = url;
    } catch (error) {
      console.error(error.message);
      toast.error("Image upload failed");
      return;
    }
    setIsLoading(true);
    try {
      // Register user with Firebase
      const user = await registerUser(
        data.email,
        data.password,
        data.name,
        data.imageUrl
      );

      // Save user to database
      await axiosInstance.post("/api/users", {
        uid: user.uid,
        name: data.name,
        email: data.email,
        photoURL: data.imageUrl,
        address: data.address,
        role: "user",
        status: "active",
      });

      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Image & Branding */}
        <div
          className="w-full md:w-1/2 bg-cover bg-center relative hidden md:block bg-[#F54A00]"
          style={{
            backgroundImage:
              "url('https://ik.imagekit.io/rakibdev/Chef_Register.png')",
          }}
        ></div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center md:text-left mb-8">
              <h1
                className="text-3xl font-bold font-playfair mb-2"
                style={{ color: "var(--color-text-primary)" }}
              >
                Create Account
              </h1>
              <p style={{ color: "var(--color-text-light)" }}>
                Fill in your details to get started
              </p>
            </div>

            <form
              onSubmit={handleSubmit(handleRegistration)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span
                      className="label-text font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Full Name
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200 transition-all"
                      style={{
                        borderColor: "var(--color-bg-dark)",
                        color: "var(--color-text-primary)",
                      }}
                      {...register("name", { required: "Name is required" })}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-error text-xs mt-1 ml-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span
                      className="label-text font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Email Address
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200 transition-all"
                      style={{
                        borderColor: "var(--color-bg-dark)",
                        color: "var(--color-text-primary)",
                      }}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-error text-xs mt-1 ml-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="form-control">
                <label className="label pt-0">
                  <span
                    className="label-text font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Delivery Address
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="123 Main St, City, Country"
                    className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200 transition-all"
                    style={{
                      borderColor: "var(--color-bg-dark)",
                      color: "var(--color-text-primary)",
                    }}
                    {...register("address", {
                      required: "Address is required",
                    })}
                  />
                </div>
                {errors.address && (
                  <span className="text-error text-xs mt-1 ml-1">
                    {errors.address.message}
                  </span>
                )}
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label className="label pt-0">
                  <span
                    className="label-text font-medium"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Profile Picture
                  </span>
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors relative"
                  style={{ borderColor: "var(--color-bg-dark)" }}
                >
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    {...register("imageUrl", {
                      onChange: handleFileChange,
                    })}
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <FaCloudUploadAlt className="text-2xl text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {fileName || "Click to upload"}
                    </span>
                  </div>
                </div>
                {progress > 0 && progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span
                      className="label-text font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Password
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200 transition-all"
                      style={{
                        borderColor: "var(--color-bg-dark)",
                        color: "var(--color-text-primary)",
                      }}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Min 6 chars",
                        },
                      })}
                    />
                  </div>
                  {errors.password && (
                    <span className="text-error text-xs mt-1 ml-1">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-control">
                  <label className="label pt-0">
                    <span
                      className="label-text font-medium"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      Confirm Password
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200 transition-all"
                      style={{
                        borderColor: "var(--color-bg-dark)",
                        color: "var(--color-text-primary)",
                      }}
                      {...register("confirmPassword", {
                        required: "Confirm password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-error text-xs mt-1 ml-1">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-block text-white text-lg normal-case mt-2 relative overflow-hidden group"
                style={{
                  backgroundColor: "var(--color-primary-accent)",
                  borderColor: "var(--color-primary-accent)",
                }}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    Create Account{" "}
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
                <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p style={{ color: "var(--color-text-light)" }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold hover:underline"
                  style={{ color: "var(--color-primary-accent)" }}
                >
                  Login here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
