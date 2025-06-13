
import React from 'react';

interface AnimatedBackgroundProps {
  isDarkMode: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ isDarkMode }) => {
  return (
    <>
      <style>
        {`
          @keyframes upflow {
            0% {
              transform: translateY(100vh) scale(0);
              opacity: 0;
            }
            10% {
              opacity: 0.6;
            }
            90% {
              opacity: 0.6;
            }
            100% {
              transform: translateY(-100px) scale(1);
              opacity: 0;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Static floating dots */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-3 h-3 rounded-full opacity-40
              ${isDarkMode ? 'bg-blue-400' : 'bg-blue-500'}
            `}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        
        {/* Upflowing animation dots */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`upflow-${i}`}
            className={`absolute w-2 h-2 rounded-full opacity-50
              ${isDarkMode ? 'bg-white' : 'bg-blue-400'}
            `}
            style={{
              left: `${5 + i * 8}%`,
              animation: `upflow ${8 + Math.random() * 6}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};
