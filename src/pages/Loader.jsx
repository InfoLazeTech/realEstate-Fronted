// src/components/Loader.jsx
import React from "react";

export default function Loader({ size = 80, thickness = 8, color = "#399fac", message }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full absolute inset-0 bg-white/60 z-10">
      <div
        style={{
          width: size,
          height: size,
          border: `${thickness}px solid ${color}44`, // lighter ring background
          borderTop: `${thickness}px solid ${color}`, // spinning part
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      {message && <p className="mt-4 text-indigo-500 font-semibold text-lg">{message}</p>}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
