import React from "react";

const ComingSoon = ({ pageName }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-md">
        <svg className="w-full h-auto" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#87CEEB" />
              <stop offset="100%" stopColor="#1E90FF" />
            </linearGradient>
          </defs>

          {/* Sky background */}
          <rect width="400" height="300" fill="url(#skyGradient)" />

          {/* Stars */}
          {[...Array(20)].map((_, i) => (
            <circle key={i} cx={Math.random() * 400} cy={Math.random() * 150} r="1" fill="white" className="animate-pulse" style={{ animationDelay: `${Math.random() * 2}s` }} />
          ))}

          {/* Rocket */}
          <g className="animate-bounce" style={{ transformOrigin: "200px 150px", animation: "bounce 2s infinite" }}>
            <path d="M185 150 L200 100 L215 150 Z" fill="#FF6B6B" />
            <rect x="190" y="150" width="20" height="30" fill="#4ECDC4" />
            <path d="M185 180 L200 200 L215 180 Z" fill="#FF6B6B" />
          </g>

          {/* Smoke */}
          <g className="animate-pulse" style={{ transformOrigin: "200px 200px", animation: "pulse 1s infinite" }}>
            <circle cx="195" cy="200" r="5" fill="#E0E0E0" opacity="0.7" />
            <circle cx="200" cy="205" r="7" fill="#E0E0E0" opacity="0.5" />
            <circle cx="205" cy="200" r="5" fill="#E0E0E0" opacity="0.7" />
          </g>

          {/* Text */}
          <text x="200" y="250" fontFamily="Arial, sans-serif" fontSize="24" fill="white" textAnchor="middle" className="animate-pulse">
            Coming Soon
          </text>
        </svg>
        <h1 className="text-3xl font-bold text-center mt-8 text-gray-800">{pageName} Page</h1>
        <p className="text-xl text-center mt-4 text-gray-600">We're launching amazing features. Stay tuned!</p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <a
              href="/"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-150 ease-in-out"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
