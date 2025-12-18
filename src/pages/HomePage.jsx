import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FiClock,
  FiMapPin,
  FiStar,
  FiUser,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import HorizontalComparisonCard from "../components/HorizontalComparisonCard";
import HeroSection from "../components/HeroSection";

export default function HomePage() {
  const [meals, setMeals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mealsRes = await axiosInstance.get("/api/meals?limit=6");
        setMeals(mealsRes.data);

        const reviewsRes = await axiosInstance.get("/api/reviews?limit=3");
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="">
        {" "}
        <HeroSection meals={meals} />
      </div>

      {/* Daily Meals Section */}
      <section className="py-13 w-11/12 mx-auto">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
                <span className="text-4xl md:text-5xl text-orange-500">D</span>
                aily Special Meals
              </h2>
              <p className="text-gray-600 text-lg">
                Freshly prepared for today's menu
              </p>
            </div>
            <Link
              to="/meals"
              className="hidden md:flex items-center gap-2 text-primary-accent font-semibold hover:text-orange-700 transition-colors"
            >
              View All Menu <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="loading loading-spinner loading-lg text-primary-accent"></span>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {meals.map((meal) => (
                <motion.div
                  key={meal._id}
                  variants={itemVariants}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        meal.foodImage || "https://via.placeholder.com/400x300"
                      }
                      alt={meal.foodName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-800 shadow-sm flex items-center gap-1">
                      <FiStar className="text-yellow-400 fill-current" />{" "}
                      {meal.rating || "New"}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-medium flex items-center gap-2">
                        <FiClock /> 30-45 min delivery
                      </p>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-accent transition-colors line-clamp-1">
                        {meal.foodName}
                      </h3>
                      <span className="text-xl font-bold text-primary-accent">
                        ${meal.price}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm">
                      <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                        <FiUser className="w-full h-full p-1" />
                      </div>
                      <span>By {meal.chefName}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiMapPin /> {meal.deliveryArea || "Local Area"}
                      </span>
                      <Link
                        to={`/meals/${meal._id}`}
                        className="text-primary-accent font-semibold hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link to="/meals" className="btn btn-primary w-full text-white">
              View All Menu
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-13 relative">
        <img
          src="https://ik.imagekit.io/rakibdev/Center-bg.png"
          alt=""
          className="absolute -mt-30 -ml-45 top-0 left-0 w-64 md:w-96 z-10 opacity-10 pointer-events-none"
        />
        <div className="w-11/12 mx-auto container px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
              <span className="text-4xl md:text-5xl text-orange-500">H</span>ow
              It Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Ordering your favorite homemade meal is easier than ever. Just
              follow these simple steps.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
          >
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 -z-10"></div>

            {[
              {
                step: "01",
                title: "Choose Your Meal",
                desc: "Browse through our extensive menu of authentic homemade dishes.",
                icon: "🥗",
              },
              {
                step: "02",
                title: "Place Your Order",
                desc: "Select your delivery time and customize your meal preferences.",
                icon: "📱",
              },
              {
                step: "03",
                title: "Enjoy Your Food",
                desc: "Sit back and relax while we deliver fresh food to your doorstep.",
                icon: "😋",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center bg-white p-6 rounded-2xl shadow-inner hover:shadow-xl transition-all duration-100 group "
              >
                <div className="w-24 h-24 mx-auto bg-orange-50 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-white shadow-lg">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-13 w-11/12 mx-auto overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              variants={fadeInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <HorizontalComparisonCard />
            </motion.div>

            <motion.div
              variants={fadeInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <span className="text-primary-accent font-bold tracking-wider uppercase text-sm mb-2 block">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 font-serif">
                <span className="text-4xl md:text-5xl text-orange-500">W</span>e
                Serve The Taste You Love
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Our platform connects you with passionate home chefs who cook
                with love and care. We ensure quality, hygiene, and authentic
                taste in every meal.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Quality Food",
                    desc: "Healthy and hygienic food from top rated chefs.",
                  },
                  {
                    title: "Fast Delivery",
                    desc: "We deliver your food hot and fresh in record time.",
                  },
                  {
                    title: "Easy Payment",
                    desc: "Secure and hassle-free payment options.",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-primary-accent shrink-0">
                      <FiCheckCircle className="text-xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-13 relative">
        <img
          src="https://ik.imagekit.io/rakibdev/Center-bg.png"
          alt=""
          className="absolute -mt-30 -mr-45 top-0 right-0 w-64 md:w-96 z-20 opacity-10 pointer-events-none"
        />
        <div className="container w-11/12 mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-serif">
              <span className="text-4xl md:text-5xl text-orange-500">W</span>hat
              Our Customers Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Don't just take our word for it. Here's what our happy customers
              have to say about their experience.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg text-primary-accent"></span>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {reviews.map((review) => (
                <motion.div
                  key={review._id}
                  variants={itemVariants}
                  className="bg-white p-8 rounded-2xl hover:border-primary-accent transition-colors relative shadow-inner"
                >
                  <div className="absolute -top-4 left-8 text-6xl text-orange-500 font-serif">
                    "
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={
                        review.reviewerImage || "https://via.placeholder.com/50"
                      }
                      alt={review.reviewerName}
                      className="w-14 h-14 rounded-full border-2 border-orange-500 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-lg">
                        {review.reviewerName}
                      </h3>
                      <div className="flex text-orange-500 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={
                              i < review.rating
                                ? "fill-current"
                                : "text-orange-500"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-orange-300 leading-relaxed">
                    "{review.comment}"
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-13 w-11/12 mx-auto relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-[url('https://ik.imagekit.io/rakibdev/Raw_meal.jpg')] opacity-3"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold  mb-6 font-serif">
              <span className="text-4xl md:text-5xl text-orange-500">R</span>
              eady to Order?
            </h2>
            <p className=" text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of happy foodies and start your culinary journey
              with Chef Origin today.
            </p>
            <Link
              to="/meals"
              className="inline-block px-7 py-3 bg-white text-orange-500 rounded-full font-bold text-lg shadow-inner hover:bg-orange-100 hover:scale-105 transition-all"
            >
              Explore Menu
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
