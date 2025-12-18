import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import axiosInstance from "../services/axiosInstance";
import { FaCheckCircle, FaCopy, FaShareAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState(
    !sessionId || !orderId ? "error" : "processing"
  );
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (!sessionId || !orderId) {
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await axiosInstance.post("/api/payment/success", {
          sessionId,
          orderId,
        });
        setPaymentData(res.data);
        setStatus("success");
      } catch (error) {
        console.error("Payment confirmation failed:", error);
        setStatus("error");
      }
    };

    confirmPayment();
  }, [sessionId, orderId]);

  const handleCopy = () => {
    if (!paymentData) return;
    const text = `Payment Receipt - Chef Origin
Order ID: ${paymentData.metadata?.orderId}
Amount: ${paymentData.amount} ${paymentData.currency.toUpperCase()}
Transaction ID: ${paymentData.paymentId}
Email: ${paymentData.metadata?.userEmail}`;

    navigator.clipboard.writeText(text);
    toast.success("Receipt copied to clipboard!");
  };

  const handleShare = async () => {
    if (!paymentData) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Payment Receipt",
          text: `Payment Successful for Order #${paymentData.metadata?.orderId}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center"
      >
        {status === "processing" && (
          <div className="flex flex-col items-center">
            <span className="loading loading-spinner loading-lg text-orange-500 mb-4"></span>
            <h2 className="text-2xl font-bold text-gray-800">
              Processing Payment...
            </h2>
            <p className="text-gray-500 mt-2">
              Please wait while we confirm your payment.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="text-5xl text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-500 mb-6">
              Thank you for your order. Your payment has been processed
              successfully.
            </p>

            {/* <div className="flex gap-3 pt-4 mt-2 border-t border-gray-200">
              <button
                onClick={handleCopy}
                className="btn btn-sm flex-1 bg-white border-gray-200 hover:bg-gray-50 text-gray-600 gap-2"
              >
                <FaCopy /> Copy
              </button>
              <button
                onClick={handleShare}
                className="btn btn-sm flex-1 bg-white border-gray-200 hover:bg-gray-50 text-gray-600 gap-2"
              >
                <FaShareAlt /> Share
              </button>
            </div> */}

            {paymentData && (
              <div className="bg-gray-50 p-4 rounded-xl w-full mb-6 text-left text-sm space-y-2 border border-gray-100">
                <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-2 mb-2">
                  Payment Details
                </h3>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount Paid:</span>
                  <span className="font-bold text-gray-800">
                    ${paymentData.amount} {paymentData.currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Order ID:</span>
                  <span className="font-mono text-gray-800">
                    {paymentData.metadata?.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="text-gray-800">
                    {paymentData.metadata?.userEmail}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction ID:</span>
                  <span
                    className="font-mono text-xs text-gray-600 truncate max-w-[150px]"
                    title={paymentData.paymentId}
                  >
                    {paymentData.paymentId}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 w-full">
              <button
                onClick={() => navigate("/dashboard/orders")}
                className="btn btn-primary flex-1 text-white"
                style={{
                  backgroundColor: "var(--color-primary-accent)",
                  borderColor: "var(--color-primary-accent)",
                }}
              >
                Back to Orders
              </button>
              <button
                onClick={handleCopy}
                className="btn btn-square btn-outline border-gray-200 hover:bg-gray-50 text-gray-600"
                title="Copy Receipt"
              >
                <FaCopy />
              </button>
              <button
                onClick={handleShare}
                className="btn btn-square btn-outline border-gray-200 hover:bg-gray-50 text-gray-600"
                title="Share Receipt"
              >
                <FaShareAlt />
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-500 mb-8">
              We couldn't confirm your payment. Please contact support if you
              believe this is an error.
            </p>
            <button
              onClick={() => navigate("/dashboard/orders")}
              className="btn btn-outline w-full"
            >
              Back to Orders
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
