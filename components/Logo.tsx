import React from "react";

export default function Logo({ className = "w-8 h-8", inverted = false }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="45" fill={inverted ? "white" : "#22c55e"} />
      
      {/* House Outline (White) */}
      <path 
        d="M25 50L50 28L75 50V72H25V50Z" 
        fill={inverted ? "#22c55e" : "white"} 
      />
      <rect x="62" y="35" width="6" height="12" fill={inverted ? "#22c55e" : "white"} />
      
      {/* Location Pin inside House (Green) */}
      <path 
        d="M50 42C44 42 40 46 40 51.5C40 57 50 66 50 66C50 66 60 57 60 51.5C60 46 56 42 50 42Z" 
        fill={inverted ? "white" : "#22c55e"} 
      />
      
      {/* Checkmark inside Pin (White) */}
      <path 
        d="M45 52L48 55L55 48" 
        stroke={inverted ? "#22c55e" : "white"} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}
