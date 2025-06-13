
import React from 'react';

interface AnimatedBackgroundProps {
  isDarkMode: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isDarkMode }) => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated dots */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-2 h-2 rounded-full opacity-20 animate-pulse
            ${isDarkMode ? 'bg-white' : 'bg-blue-400'}
          `}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }}
        />
      ))}
      
      {/* Upflowing animation */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`upflow-${i}`}
          className={`absolute w-1 h-1 rounded-full opacity-30
            ${isDarkMode ? 'bg-gray-400' : 'bg-blue-300'}
          `}
          style={{
            left: `${10 + i * 12}%`,
            animation: `upflow ${8 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}
      
      <style>
        {`
          @keyframes upflow {
            0% {
              transform: translateY(100vh) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 0.3;
            }
            90% {
              opacity: 0.3;
            }
            100% {
              transform: translateY(-100px) scale(1);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};
