import React from "react";
import { Box } from "@mui/material";

const dropCount = 10; // Increased number of drops for better effect

const AnimatedBackground = () => {
  const drops = Array.from({ length: dropCount }).map((_, i) => (
    <Box
      key={i}
      className="drop"
      sx={{
        position: "absolute",
        bottom: "-50px",
        width: 20,
        height: 30,
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        background:
          "radial-gradient(circle at 50% 30%, #ff4d4d 50%, #8b0000 100%)",
        opacity: 0.4,
        animation: `floatUp 10s ease-in-out infinite`,
        animationDelay: `${i * 1.5}s`,
        left: `${i * 10 + 5}%`,
        filter: "drop-shadow(0 0 10px rgba(255,0,0,0.5))",
      }}
    />
  ));

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: -1,
        background: "linear-gradient(160deg, #1a0000, #330000, #000000)",
      }}
    >
      {drops}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0.4;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120vh) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
};

export default AnimatedBackground;
