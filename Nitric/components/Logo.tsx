
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className, size = 100 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Speech Bubble */}
      <path 
        d="M50 15C30.67 15 15 30.67 15 50C15 63.82 23.01 75.78 34.69 81.39L23.5 95L44.5 84.5C46.28 84.83 48.12 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15Z" 
        fill="white" 
        stroke="#2E5C99" 
        strokeWidth="4" 
        strokeLinejoin="round"
      />
      
      {/* Robot Antenna */}
      <circle cx="50" cy="24" r="3" fill="#2E5C99" />
      <path d="M50 27V33" stroke="#2E5C99" strokeWidth="3" strokeLinecap="round" />

      {/* Robot Body/Face Outline */}
      <rect x="28" y="38" width="44" height="32" rx="16" fill="white" stroke="#2E5C99" strokeWidth="3" />
      
      {/* Side Ears/Sensors */}
      <circle cx="28" cy="54" r="5" fill="white" stroke="#2E5C99" strokeWidth="3" />
      <circle cx="72" cy="54" r="5" fill="white" stroke="#2E5C99" strokeWidth="3" />

      {/* Screen Area */}
      <rect x="34" y="44" width="32" height="18" rx="9" fill="#1A2B3D" />
      
      {/* Eyes */}
      <circle cx="41" cy="53" r="3.5" fill="#60E6FF" />
      <circle cx="59" cy="53" r="3.5" fill="#60E6FF" />
      
      {/* Smile */}
      <path 
        d="M46 56C46 58.21 47.79 60 50 60C52.21 60 54 58.21 54 56" 
        stroke="white" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
    </svg>
  );
};

export default Logo;
