import { useEffect, useState } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const totalHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;

    if (totalHeight > 0) {
      const progress = (scrollPosition / totalHeight) * 100;
      setScrollProgress(progress);
    }

    if (scrollPosition > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate circle stroke for progress
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <div
      className={`hidden md:block fixed bottom-8 right-8 z-50 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <div
        onClick={scrollToTop}
        className="relative flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300 group"
      >
        {/* Progress Circle */}
        <svg
          className="absolute top-0 left-0 w-full h-full -rotate-90"
          viewBox="0 0 50 50"
        >
          {/* Background track */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          {/* Progress indicator */}
          <circle
            cx="25"
            cy="25"
            r={radius}
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-100 ease-out"
          />
        </svg>

        {/* Arrow Icon */}
        <span className="text-orange-500 text-xl font-bold group-hover:-translate-y-1 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 15.75l7.5-7.5 7.5 7.5"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default ScrollToTop;
