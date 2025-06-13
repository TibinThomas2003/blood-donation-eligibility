import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useMediaQuery,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const adviceMap = {
  "Are you between 18 and 65 years of age?":
    "Blood donation is allowed for individuals between 18 and 65. Please consider donating once you meet this age requirement.",

  "Have you donated blood in the past 3 months?":
    "You need to wait at least 3 months between blood donations to protect your health. Mark your calendar to know when you can donate again.",

  "Is your hemoglobin ≥12.5 g/dL (female) or ≥13 g/dL (male)?":
    "Maintain a healthy diet rich in iron and vitamins to keep your hemoglobin levels in a safe range for donation. Consider consulting a doctor for advice.",

  "Do you weigh 50 kg or more?":
    "A minimum weight of 50 kg ensures safe blood donation. Maintain a balanced diet and regular exercise to reach a healthy weight.",

  "Have you ever tested positive for HIV/AIDS?":
    "Individuals with HIV/AIDS are unfortunately not eligible to donate blood for safety reasons. Please take care of your health and seek support if needed.",

  "Have you ever had hepatitis B or hepatitis C?":
    "Hepatitis infections disqualify a person from donating to ensure safety. Prevent infections by practicing safe behaviors and vaccination where available.",

  "Have you ever been diagnosed with syphilis or any other sexually transmitted infection?":
    "Avoid risky sexual behaviors and seek timely treatment to prevent infections that affect donation eligibility.",

  "Have you ever had cancer (especially blood cancers like leukemia or lymphoma)?":
    "Certain cancers disqualify donors. Focus on your health and follow medical advice to maintain well-being.",

  "Do you have any chronic kidney or liver disease?":
    "Chronic conditions can complicate donation. Manage your health with regular medical care and lifestyle choices.",

  "Have you ever received hormone or steroid injections for long periods?":
    "Long-term steroid use may affect eligibility. Consult your doctor about when you might be eligible after treatment.",

  "Have you ever used injectable recreational drugs?":
    "Avoid injectable drug use to protect your health and donation eligibility.",

  "Are you currently feeling unwell or do you have a fever today?":
    "Rest and recover fully before donating blood to ensure your safety and that of recipients.",

  "Have you had any infection (such as flu, sore throat, or diarrhea) in the last 2 weeks?":
    "Wait at least 2 weeks after infection recovery before donating. Practice good hygiene to avoid infections.",

  "Have you had any major surgery or blood transfusion in the past 6 months?":
    "Allow at least 6 months for recovery after major surgery or transfusion before donating.",

  "Have you had any minor surgery (including tooth extraction) in the past 7 days?":
    "Wait at least 7 days after minor procedures to ensure safe donation.",

  "Have you taken any live vaccines (like MMR, chickenpox, or yellow fever) in the last 6 months?":
    "Live vaccines require a 6-month waiting period before donation. Keep your vaccinations up to date and plan accordingly.",

  "Have you traveled in the last 6 months to a malaria-endemic area (e.g., forest or hill station)?":
    "Travel to malaria-risk areas requires a waiting period. Use preventive measures like mosquito nets and prophylaxis when traveling.",

  "Have you ever had sex with a person with HIV/AIDS or multiple sexual partners in the last 12 months?":
    "Practice safe sex and limit partners to reduce risk and maintain donation eligibility.",

  "Have you had a tattoo, body piercing, or acupuncture in the last 6 to 12 months?":
    "Wait 6 to 12 months after such procedures to avoid risk of infections.",

  "Do you currently consume alcohol excessively or use tobacco products regularly?":
    "Adopt a healthy lifestyle by reducing alcohol and quitting smoking to improve eligibility and overall health.",

  "Are you currently pregnant or breastfeeding?":
    "Wait until after pregnancy and breastfeeding to donate to protect your health and your baby’s.",

  "Have you experienced heavy menstrual bleeding recently?":
    "Wait until your body has fully recovered from heavy menstrual bleeding before donating.",

  "Have you had childbirth within the past 12 months?":
    "Wait at least a year after childbirth before donating to ensure full recovery.",
};


export default function ResultModal({ open, onClose, eligibility }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleGoHome = () => {
    onClose();
    navigate("/");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          p: 2,
          borderRadius: 3,
          backdropFilter: "blur(8px)", // apply blur on the dialog content
          backgroundColor: "rgba(255,255,255,0.85)", // semi-transparent white for blur effect
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(5px)", // blur the background behind the modal
          backgroundColor: "rgba(0,0,0,0.4)", // slightly dark for contrast
        },
      }}
    >
      <DialogTitle
        sx={{ fontSize: "1.8rem", textAlign: "center", fontWeight: "bold" }}
      >
        {eligibility.eligible
          ? "🎉 You Are Eligible to Donate!"
          : "⚠️ Not Eligible to Donate"}
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 2, textAlign: "center" }}>
          {eligibility.eligible
            ? "Congratulations! You meet all the eligibility criteria for donating blood. Thank you for your willingness to help others!"
            : "Unfortunately, you are currently not eligible to donate blood for the following reasons:"}
        </Typography>

        {!eligibility.eligible && (
          <Box component="ul" sx={{ pl: 3 }}>
            {eligibility.reasons.map((reason, index) => (
              <li key={index} style={{ marginBottom: "0.8rem" }}>
                <Typography variant="body2" color="textSecondary">
                  {adviceMap[reason] || reason}
                </Typography>
              </li>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          onClick={handleGoHome}
          variant="contained"
          color="primary"
          size="large"
        >
          Check Again
        </Button>
      </DialogActions>
    </Dialog>
  );
}
