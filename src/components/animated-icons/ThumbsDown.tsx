
"use client";

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";

const variants: Variants = {
  normal: {
    scale: 1,
    rotate: 0,
    y: 0,
  },
  animate: {
    scale: [1, 1.04, 1],
    rotate: [0, -8, 8, -8, 0],
    y: [0, -2, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      times: [0, 0.2, 0.5, 0.8, 1],
    },
  },
};

interface ThumbsDownProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  onClick?: () => void;
}

const ThumbsDown = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  onClick,
  className,
  style,
  ...svgProps
}: ThumbsDownProps) => {
  const controls = useAnimation();

  // Filter out event handlers that might conflict with motion
  const { 
    onAnimationStart, 
    onAnimationEnd, 
    onAnimationIteration,
    onDragStart,
    onDragEnd,
    onDrag,
    onDragEnter,
    onDragExit,
    onDragLeave,
    onDragOver,
    onDrop,
    ...cleanSvgProps 
  } = svgProps;

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
      onClick={onClick}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={variants}
        animate={controls}
        className={className}
        style={style}
        {...cleanSvgProps}
      >
        <path d="M17 14V2" />
        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
      </motion.svg>
    </div>
  );
};

export { ThumbsDown };
