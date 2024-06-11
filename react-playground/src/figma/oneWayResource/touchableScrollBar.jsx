import React, { useEffect, useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";

const TouchableScrollBar = () => {
  const controls = useDragControls();
  const carouselRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
      setWidth(
        carouselRef.current.scrollWidth - carouselRef.current.offsetWidth
      );

  }, []);

  return (
    <motion.div
      ref={carouselRef}
      whileTap={{ cursor: "grabbing" }}
      className="cursor-grab overflow-hidden mt-10"
    >
      <motion.div
        drag="x"
        dragControls={controls}
        dragConstraints={{ right: 0, left: -width }}
        className="cursor-grab  flex gap-10 items-center"
      >
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div key={i} className="flex flex-col items-center">
            <motion.div className="text-[white] h-[100px] w-[100px] rounded-full bg-[skyBlue] flex items-center justify-center">
              {i + 1}
            </motion.div>
            <motion.p>Lorem ipsum</motion.p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TouchableScrollBar;
