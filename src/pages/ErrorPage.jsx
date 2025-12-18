import { useRouteError, Link } from "react-router";
import { FiHome, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";
import PageTitle from "../components/PageTitle";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <PageTitle title="Error | Chef Origin" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block mb-6"
        >
          <FiAlertTriangle className="text-8xl text-orange-500" />
        </motion.div>

        <h1 className="text-6xl font-bold font-playfair mb-4 text-gray-800">
          Oops!
        </h1>
        <p className="text-xl mb-2 text-gray-600 font-medium">
          Something went wrong
        </p>
        <p className="mb-8 text-gray-500">
          {error?.statusText ||
            error?.message ||
            "An unexpected error occurred. Please try again later."}
        </p>

        <Link
          to="/"
          className="btn btn-primary gap-2 text-white px-8 h-12 text-lg shadow-lg hover:shadow-xl transition-all"
          style={{
            backgroundColor: "var(--color-primary-accent)",
            borderColor: "var(--color-primary-accent)",
          }}
        >
          <FiHome /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
