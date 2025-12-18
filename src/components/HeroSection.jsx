import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";

const OrbitItem = ({ meal, index, activeIndex, total, radius, onClick }) => {
  // Calculate angle for this item
  const angle = (360 / total) * index;

  // Calculate rotation offset based on active index
  // We want the active item to be at -90 degrees (top)
  const shift = -90;
  const rotation = angle - (360 / total) * activeIndex + shift;

  // Convert polar to cartesian coordinates
  const radian = (rotation * Math.PI) / 180;
  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  const isActive = index === activeIndex;

  return (
    <motion.div
      className={`absolute top-1/2 left-1/2 w-14 h-14 md:w-20 md:h-20 -ml-7 -mt-7 md:-ml-10 md:-mt-10 rounded-full border-2 shadow-md overflow-hidden cursor-pointer z-10 transition-all duration-300  ${
        isActive
          ? "border-orange-500 scale-110 ring-4 ring-orange-200"
          : "border-white hover:scale-105"
      }`}
      animate={{ x, y }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      onClick={onClick}
    >
      <img
        src={meal.foodImage}
        alt={meal.foodName}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};

const HeroSection = ({ meals = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(210); // Default mobile radius

  // Fallback data if no meals provided
  const defaultMeals = [
    {
      _id: "1",
      foodName: "Delicious Pasta",
      description:
        "Experience the authentic taste of Italian pasta, made with fresh ingredients and love.",
      foodImage:
        "https://ik.imagekit.io/rakibdev/Chef_Banner.jpg?updatedAt=1696222637083",
      price: 12.99,
    },
    {
      _id: "2",
      foodName: "Grilled Chicken",
      description:
        "Juicy grilled chicken marinated in special spices, served with roasted vegetables.",
      foodImage: "https://via.placeholder.com/400x300",
      price: 15.99,
    },
    {
      _id: "3",
      foodName: "Fresh Salad",
      description:
        "A refreshing mix of organic greens, cherry tomatoes, and our signature dressing.",
      foodImage: "https://via.placeholder.com/400x300",
      price: 9.99,
    },
    {
      _id: "4",
      foodName: "Steak",
      description:
        "Premium quality steak cooked to perfection, tender and full of flavor.",
      foodImage: "https://via.placeholder.com/400x300",
      price: 24.99,
    },
    {
      _id: "5",
      foodName: "Sushi Platter",
      description:
        "Authentic Japanese sushi with fresh fish and perfectly seasoned rice.",
      foodImage: "https://via.placeholder.com/400x300",
      price: 18.99,
    },
    {
      _id: "6",
      foodName: "Burger",
      description:
        "Classic beef burger with melted cheese, fresh lettuce, and tomato.",
      foodImage: "https://via.placeholder.com/400x300",
      price: 10.99,
    },
  ];

  const displayMeals = (meals.length > 0 ? meals : defaultMeals).slice(0, 6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setRadius(190); // Desktop radius
      } else {
        setRadius(120); // Mobile radius
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleNext = () => {
      setActiveIndex((prev) => (prev + 1) % displayMeals.length);
    };

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Auto-slide every 5 seconds
    return () => clearInterval(interval);
  }, [displayMeals.length]);

  return (
    <div className="relative w-11/12 mx-auto min-h-[85vh] overflow-hidden flex items-center justify-center">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] bg-orange-100/50 rounded-full translate-x-1/4 -translate-y-1/4 -z-10 opacity-80 blur-3xl md:blur-0 md:opacity-100" />

      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
        {/* Left Content */}
        <div className="w-full md:w-1/2 pt-10 md:pt-0 text-center md:text-left">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary-accent text-3xl md:text-5xl font-serif mb-2 font-bold"
          >
            <span className="text-4xl md:text-6xl text-orange-500">A</span>
            uthentic Taste
          </motion.h3>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Homemade Meals,{" "}
            <span className="relative inline-block">
              Delivered.
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-primary-accent"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="#f54a00"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            key={activeIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="text-gray-600 text-lg mb-8 max-w-md mx-auto md:mx-0"
          >
            {displayMeals[activeIndex]?.description ||
              "Connect with local chefs and enjoy fresh, homemade meals delivered straight to your doorstep."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/meals"
              className="inline-flex items-center gap-2 bg-white text-[#f54a00] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-inner hover:shadow-xl transform hover:-translate-y-1"
            >
              Order Now <FiArrowRight />
            </Link>
          </motion.div>
        </div>

        {/* Right Visual - The Orbit Slider */}
        <div className="w-full md:w-1/2 my-15 md:my-0 md:pt-10 relative h-[250px] md:h-[380px] flex items-center justify-center md:justify-end">
          <div className="relative w-[250px] h-[250px] md:w-[380px] md:h-[380px]">
            {/* The Green Circle Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] md:w-[280px] md:h-[280px] bg-white rounded-full flex items-center justify-center shadow-inner">
              {/* Dashed Orbit Line */}
              <div
                className="absolute w-[140%] h-[140%] border-2 border-dashed border-orange-200 rounded-full animate-spin-slow"
                style={{ animationDuration: "60s" }}
              ></div>
            </div>

            {/* Center Image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 z-20">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={displayMeals[activeIndex]?.foodImage}
                  alt={displayMeals[activeIndex]?.foodName}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-orange-500"
                />
              </AnimatePresence>

              {/* Price Tag */}
              <motion.div
                key={`price-${activeIndex}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-orange-500 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm md:text-base shadow-lg border-4 border-white z-30"
              >
                ${displayMeals[activeIndex]?.price}
              </motion.div>
            </div>

            {/* Orbiting Small Images */}
            <div className="absolute inset-0 pointer-events-none">
              {displayMeals.map((meal, index) => (
                <div key={meal._id} className="pointer-events-auto">
                  <OrbitItem
                    meal={meal}
                    index={index}
                    activeIndex={activeIndex}
                    total={displayMeals.length}
                    radius={radius}
                    onClick={() => setActiveIndex(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
