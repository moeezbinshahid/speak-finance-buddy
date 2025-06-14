
"use client";

import { motion, useAnimation } from "framer-motion";
import type { Variants } from "framer-motion";

interface ChevronsDownProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const chevronVariants: Variants = {
  normal: {
    y: 0,
    opacity: 1,
  },
  animate: {
    y: [4, 0],
    opacity: [0.3, 1],
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const ChevronsDown = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}: ChevronsDownProps) => {
  const controls = useAnimation();

  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <motion.path
          d="m7 6 5 5 5-5"
          variants={chevronVariants}
          animate={controls}
          initial="normal"
        />
        <motion.path
          d="m7 13 5 5 5-5"
          variants={chevronVariants}
          animate={controls}
          initial="normal"
        />
      </svg>
    </div>
  );
};

export { ChevronsDown };
