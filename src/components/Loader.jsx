import React from "react";

export default function Loader({ size = "medium", color = "#1D4ED8" }) {
  const sizeMap = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  return (
    <div className={`${sizeMap[size]} relative`} aria-label="Loading">
      <svg className="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.76121C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-20"
        />
        <path
          d="M22 12C22 13.3132 21.7413 14.6136 21.2388 15.8268C20.7362 17.0401 19.9997 18.1425 19.0711 19.0711C18.1425 19.9997 17.0401 20.7362 15.8268 21.2388C14.6136 21.7413 13.3132 22 12 22"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-40"
        />
        <path
          d="M12 22C10.6868 22 9.38642 21.7413 8.17317 21.2388C6.95991 20.7362 5.85752 19.9997 4.92893 19.0711C4.00035 18.1425 3.26375 17.0401 2.76121 15.8268C2.25866 14.6136 2 13.3132 2 12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-60"
        />
        <path
          d="M2 12C2 10.6868 2.25866 9.38642 2.76121 8.17317C3.26375 6.95991 4.00035 5.85752 4.92893 4.92893C5.85752 4.00035 6.95991 3.26375 8.17317 2.76121C9.38642 2.25866 10.6868 2 12 2"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-80"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`w-1/2 h-1/2 bg-${color} rounded-full animate-pulse`}></div>
      </div>
    </div>
  );
}
