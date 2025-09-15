export default function LoaderWave({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-8">
      <div className="flex items-end space-x-2">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className="bg-indigo-600 rounded animate-wave"
            style={{
              width: 12,       // wider bars
              height: 80,     // taller bars
              animationDelay: `${i * 0.25}s`, // slightly slower stagger
            }}
          />
        ))}
      </div>
      <p className="text-indigo-600 font-semibold text-lg">{message}</p>
      <style>{`
        @keyframes wave {
          0%, 60%, 100% { transform: scaleY(0.4); }
          30% { transform: scaleY(1); }
        }
        .animate-wave { animation: wave 1s infinite ease-in-out; transform-origin: bottom; display: inline-block; }
      `}</style>
    </div>
  );
}


// // src/components/Loader.jsx
// import React from "react";
// import { Loader2 } from "lucide-react";

// export default function Loader({ message = "Loading...", size = "12", className = "" }) {
//   // size prop controls icon size
//   return (
//     <div
//       className={`flex flex-col items-center justify-center gap-3 p-6 bg-white/90 rounded-lg shadow-md ${className}`}
//     >
//       <Loader2 className={`h-${size} w-${size} animate-spin text-indigo-600`} />
//       <p className="text-indigo-400 font-semibold text-lg">{message}</p>
//     </div>
//   );
// }
