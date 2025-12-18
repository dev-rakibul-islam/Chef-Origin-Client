import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Login failed");
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
              "url('https://ik.imagekit.io/rakibdev/Chef_Login.png')",
          }}
        ></div>

        {/* Right Side - Login Form */}
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
                Login to Account
              </h1>
              <p style={{ color: "var(--color-text-light)" }}>
                Please enter your details to sign in
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label">
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
                    placeholder="Enter your email"
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
                  <span className="text-error text-sm mt-1 ml-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="form-control">
                <label className="label">
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
                    placeholder="Enter your password"
                    className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-orange-200 transition-all"
                    style={{
                      borderColor: "var(--color-bg-dark)",
                      color: "var(--color-text-primary)",
                    }}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                </div>
                {errors.password && (
                  <span className="text-error text-sm mt-1 ml-1">
                    {errors.password.message}
                  </span>
                )}
                <label className="label">
                  <a
                    href="#"
                    className="label-text-alt link link-hover text-orange-500"
                  >
                    Forgot password?
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-block text-white text-lg normal-case relative overflow-hidden group"
                style={{
                  backgroundColor: "var(--color-primary-accent)",
                  borderColor: "var(--color-primary-accent)",
                }}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    Sign In{" "}
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
                <div className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p style={{ color: "var(--color-text-light)" }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold hover:underline"
                  style={{ color: "var(--color-primary-accent)" }}
                >
                  Create an account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
