import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import QuestionForm from "./components/QuestionForm";
import WomenPage from "./pages/WomenPage";
import {
  AppBar,
  Toolbar,
  Stack,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
} from "@mui/material";
import { FaTint } from "react-icons/fa"; // Blood drop icon
import { styled, keyframes } from "@mui/system";

// Animation for hover
const grow = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.03); }
`;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#e0f7fa", // Light cyan
  color: "#003f5c",           // Dark blue text
  transition: "all 0.3s ease",
  "&:hover": {
    animation: `${grow} 0.3s forwards`,
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  },
}));

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Router>
      {/* Navigation Bar */}
      <StyledAppBar position="static" elevation={3}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              component={NavLink}
              to="/https://tibinthomas2003.github.io/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <FaTint size={26} style={{ color: "#d32f2f" }} />
              <span style={{ color: "#d32f2f" }}>Blood</span> Donation
            </Typography>

            <Stack direction="row" spacing={isMobile ? 1 : 3}>
              {/* Future navigation */}
            </Stack>
          </Toolbar>
        </Container>
      </StyledAppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/tibinthomas2003.github.io" element={<QuestionForm />} />
          <Route path="/women" element={<WomenPage />} />
          <Route
            path="*"
            element={
              <Box textAlign="center" mt={8}>
                <Typography variant="h3" color="error" gutterBottom>
                  404
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  The page you are looking for does not exist.
                </Typography>
              </Box>
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
