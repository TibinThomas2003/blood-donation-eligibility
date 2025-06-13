import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Divider,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { womenQuestions } from "./WomenQuestionsData";

const LOCAL_STORAGE_KEY = "womenAnswers";

const AnimatedBackground = () => {
  const dropCount = 8;
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
          "radial-gradient(circle at 50% 30%, #ff6b6b 60%, #b22222 100%)",
        opacity: 0.3,
        animation: `floatUp 8s ease-in-out infinite`,
        animationDelay: `${i * 2}s`,
        left: `${i * 12 + 10}%`,
        filter: "drop-shadow(0 0 5px #b22222)",
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
        background:
          "radial-gradient(circle at center, #fff0f0 0%, #ffe6e6 70%)",
      }}
    >
      {drops}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-110vh) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </Box>
  );
};

export default function WomenQuestions({ name, onSubmit, onBack }) {
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    try {
      const storedAnswers = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers));
      }
    } catch (error) {
      console.error("Failed to load answers from localStorage", error);
    }
  }, []);

  const handleAnswerChange = (id, value) => {
    const newAnswers = { ...answers, [id]: value === "yes" };
    setAnswers(newAnswers);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newAnswers));
    } catch (error) {
      console.error("Failed to save answers to localStorage", error);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove answers from localStorage", error);
    }
    setAnswers({});
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove answers from localStorage", error);
    }
    setAnswers({});
  };

  const allAnswered = womenQuestions.every((q) => q.id in answers);

  return (
    <>
      <AnimatedBackground />
      <Box
        sx={{
          padding: { xs: "1rem", sm: "2rem" },
          maxWidth: "700px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Additional Questions for {name}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {womenQuestions.map((q) => (
          <Box key={q.id} sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              {q.text} *
            </Typography>

            <RadioGroup
              row
              value={
                answers[q.id] === true
                  ? "yes"
                  : answers[q.id] === false
                  ? "no"
                  : ""
              }
              onChange={(e) => handleAnswerChange(q.id, e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              handleReset();
              onBack();
            }}
            startIcon={<RestartAltIcon />}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!allAnswered}
            sx={{
              boxShadow: "0 3px 8px rgba(255, 0, 0, 0.3)",
              fontWeight: "bold",
            }}
          >
            Submit
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Created by Maria Thomas.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
