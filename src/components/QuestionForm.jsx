import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  useMediaQuery,
  Alert,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { womenQuestions } from "./WomenQuestionsData";
import ResultModal from "./ResultModal";
import WomenQuestions from "./WomenQuestions";

const questions = {
  GENERAL: [
    { id: "q1", text: "Are you between 18 and 65 years of age?", mustBeTrue: true },
    { id: "q2", text: "Have you donated blood in the past 3 months?", mustBeFalse: true },
    { id: "q3", text: "Is your hemoglobin ≥12.5 g/dL (female) or ≥13 g/dL (male)?", mustBeTrue: true },
    { id: "q4", text: "Do you weigh 50 kg or more?", mustBeTrue: true },
  ],
  MEDICAL: [
    { id: "q5", text: "Have you ever tested positive for HIV/AIDS?", mustBeFalse: true },
    { id: "q6", text: "Have you ever had hepatitis B or hepatitis C?", mustBeFalse: true },
    { id: "q7", text: "Have you ever been diagnosed with syphilis or any other sexually transmitted infection?", mustBeFalse: true },
    { id: "q8", text: "Have you ever had cancer (especially blood cancers like leukemia or lymphoma)?", mustBeFalse: true },
    { id: "q9", text: "Do you have any chronic kidney or liver disease?", mustBeFalse: true },
    { id: "q10", text: "Have you ever received hormone or steroid injections for long periods?", mustBeFalse: true },
    { id: "q11", text: "Have you ever used injectable recreational drugs?", mustBeFalse: true },
  ],
  RECENT: [
    { id: "q12", text: "Are you currently feeling unwell or do you have a fever today?", mustBeFalse: true },
    { id: "q13", text: "Have you had any infection (such as flu, sore throat, or diarrhea) in the last 2 weeks?", mustBeFalse: true },
    { id: "q14", text: "Have you had any major surgery or blood transfusion in the past 6 months?", mustBeFalse: true },
    { id: "q15", text: "Have you had any minor surgery (including tooth extraction) in the past 7 days?", mustBeFalse: true },
  ],
  VACCINATION: [
    { id: "q16", text: "Have you taken any live vaccines (like MMR, chickenpox, or yellow fever) in the last 6 months?", mustBeFalse: true },
    { id: "q17", text: "Have you traveled in the last 6 months to a malaria-endemic area (e.g., forest or hill station)?", mustBeFalse: true },
  ],
  LIFESTYLE: [
    { id: "q18", text: "Have you ever had sex with a person with HIV/AIDS or multiple sexual partners in the last 12 months?", mustBeFalse: true },
    { id: "q19", text: "Have you had a tattoo, body piercing, or acupuncture in the last 6 to 12 months?", mustBeFalse: true },
    { id: "q20", text: "Do you currently consume alcohol excessively or use tobacco products regularly?", mustBeFalse: true },
  ],
};

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
        background: "radial-gradient(circle at 50% 30%, #ff6b6b 60%, #b22222 100%)",
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
        background: "radial-gradient(circle at center, #fff0f0 0%, #ffe6e6 70%)",
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

export default function QuestionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [gender, setGender] = useState("");
  const [page, setPage] = useState("form");
  const [answers, setAnswers] = useState({});
  const [open, setOpen] = useState(false);
  const [eligibility, setEligibility] = useState({ eligible: true, reasons: [] });
  const [alertOpen, setAlertOpen] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const LOCAL_STORAGE_KEY = "bloodDonationEligibilityData";

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setName(parsed.name || "");
        setEmail(parsed.email || "");
        setGender(parsed.gender || "");
        setAnswers(parsed.answers || {});
      } catch (e) {
        console.error("Failed to parse saved form data:", e);
      }
    }
  }, []);

  useEffect(() => {
    const data = { name, email, gender, answers };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [name, email, gender, answers]);

  useEffect(() => {
    checkFormCompletion();
  }, [name, email, gender, answers]);

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    if (!/^[\w.+-]+@gmail.com$/i.test(email)) return "Only valid @gmail.com emails are accepted";
    return "";
  };

  const validateName = (value) => {
    if (!value.trim()) return "Name is required";
    if (!/^[A-Za-z\s]+$/.test(value)) return "Only alphabets and spaces are allowed";
    return "";
  };

  const checkFormCompletion = () => {
    const emailValidationError = validateEmail(email);
    const nameValidationError = validateName(name);
    const totalQuestions = Object.values(questions).flat();
    const unanswered = totalQuestions.filter((q) => !(q.id in answers));
    setIsFormComplete(
      name.trim() !== "" && gender !== "" && !emailValidationError && !nameValidationError && unanswered.length === 0
    );
  };

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value === "yes" }));
  };

  const handleNext = () => {
    const emailValidationError = validateEmail(email);
    const nameValidationError = validateName(name);
    setEmailError(emailValidationError);
    setNameError(nameValidationError);

    if (emailValidationError || nameValidationError || !isFormComplete) {
      setAlertOpen(true);
      return;
    }

    if (gender === "female") {
      setPage("women");
    } else {
      handleFinalSubmit({});
    }
  };

  const handleFinalSubmit = (womenAnswers = {}) => {
    const allAnswers = { ...answers, ...womenAnswers };
    let reasons = [];

    Object.values(questions).flat().forEach((q) => {
      if (q.mustBeTrue && allAnswers[q.id] !== true) reasons.push(q.text);
      if (q.mustBeFalse && allAnswers[q.id] !== false) reasons.push(q.text);
    });

    if (gender === "female") {
      womenQuestions.forEach((q) => {
        if (q.mustBeTrue && allAnswers[q.id] !== true) reasons.push(q.text);
        if (q.mustBeFalse && allAnswers[q.id] !== false) reasons.push(q.text);
      });
    }

    setEligibility({ eligible: reasons.length === 0, reasons });
    setPage("result");
    setOpen(true);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setName("");
    setEmail("");
    setEmailError("");
    setNameError("");
    setGender("");
    setAnswers({});
  };

  if (page === "women") {
    return (
      <>
        <AnimatedBackground />
        <WomenQuestions name={name} onSubmit={handleFinalSubmit} onBack={() => setPage("form")} />
      </>
    );
  }

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
          Check Your Blood Donation Eligibility
        </Typography>

        <TextField
          label="Name *"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => {
            const newValue = e.target.value;
            setName(newValue);
            setNameError(validateName(newValue));
          }}
          error={Boolean(nameError)}
          helperText={nameError || "We won’t store your personal details."}
          sx={{ mb: 1 }}
        />

        <TextField
          label="Email ID *"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => {
            const newValue = e.target.value;
            setEmail(newValue);
            setEmailError(validateEmail(newValue));
          }}
          error={Boolean(emailError)}
          helperText={emailError || "Your email will be kept confidential."}
          sx={{ mb: 2 }}
        />

        <Typography variant="body1" sx={{ mb: 1 }}>
          Gender *
        </Typography>

        <RadioGroup
          row={!isMobile}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          sx={{ mb: 3 }}
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>

        <Divider sx={{ my: 2 }} />

        {Object.entries(questions).map(([category, qs]) => (
          <Box key={category} sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ textTransform: "capitalize" }}>
              {category}
            </Typography>
            {qs.map((q) => (
              <Box key={q.id} sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {q.text} *
                </Typography>
                <RadioGroup
                  row={!isMobile}
                  value={answers[q.id] === true ? "yes" : answers[q.id] === false ? "no" : ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleNext}
          disabled={!isFormComplete}
          sx={{
            boxShadow: "0 3px 8px rgba(255, 0, 0, 0.3)",
            fontWeight: "bold",
            opacity: isFormComplete ? 1 : 0.5,
          }}
        >
          Next
        </Button>

        <Snackbar
          open={alertOpen}
          autoHideDuration={1500}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="warning" sx={{ width: "100%" }}>
            Please complete all fields to continue.
          </Alert>
        </Snackbar>

        <ResultModal open={open} onClose={() => setOpen(false)} eligibility={eligibility} />

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Created by Maria Thomas.
          </Typography>
        </Box>
      </Box>
    </>
  );
}
