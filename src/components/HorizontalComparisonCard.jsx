import { useState, useRef, useEffect } from "react";

const HorizontalComparisonCard = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const startDragging = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMove = (clientX) => {
      if (!isDragging.current) return;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = Math.min(Math.max(0, clientX - rect.left), rect.width);
      const position = (x / rect.width) * 100;

      setSliderPosition(position);
    };

    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

    const stopDragging = () => {
      isDragging.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", stopDragging);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", stopDragging);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none bg-gray-100 rounded-3xl overflow-hidden shadow-md h-[400px] sm:h-[300px] md:h-[450px]"
    >
      {/* Before Image */}
      <img
        src="https://ik.imagekit.io/rakibdev/Raw_meal.jpg"
        alt="Before"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* After Image */}
      <img
        src="https://ik.imagekit.io/rakibdev/After_Raw_meal.jpg"
        alt="After"
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      />

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={startDragging}
        onTouchStart={startDragging}
      >
        <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2">
          <div className="w-full h-full rounded-full border-[3px] border-white bg-[#0FABCA] shadow-lg flex items-center justify-center">
            <div className="flex gap-[5px] justify-evenly">
              <div className="w-0.5 h-4 bg-white"></div>
              <div className="w-0.5 h-4 bg-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalComparisonCard;
