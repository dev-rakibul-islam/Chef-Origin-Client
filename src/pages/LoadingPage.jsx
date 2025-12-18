import { motion } from "framer-motion";
import { FaUtensils } from "react-icons/fa";
import PageTitle from "../components/PageTitle";

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <PageTitle title="Loading... | Chef Origin" />
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity },
        }}
        className="text-6xl text-orange-500 mb-6"
      >
        <FaUtensils />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-xl font-bold font-playfair text-gray-800 tracking-widest uppercase"
      >
        Preparing your experience...
      </motion.p>
    </div>
  );
}
