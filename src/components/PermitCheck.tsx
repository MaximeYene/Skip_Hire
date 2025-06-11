"use client";

import { useState, useEffect } from "react";
// CORRECTION 1: Remplacement de "Road" par "Route"
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Home as HomeIcon,
  Route,
} from "lucide-react";
import {
  Card,
  Typography,
  Button,
  Box,
  Radio,
  FormControlLabel,
  Alert,
  AlertTitle,
  Divider,
  Stack,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StepperDemo from "./Stepper-demo";

interface Skip {
  id: number;
  size: number;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
}

interface PermitCheckProps {
  onBack: () => void;
  onContinue?: () => void;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
  },
});

const PermitCheck = ({ onBack }: PermitCheckProps) => {
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [placement, setPlacement] = useState<"private" | "public">("private");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSkip = localStorage.getItem("selectedSkip");
    if (storedSkip) {
      setSelectedSkip(JSON.parse(storedSkip));
    }
    setLoading(false);
  }, []);

  const handleContinue = () => {
    console.log("Placement selected:", placement);
    // Navigation vers l'étape suivante
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6">Loading...</Typography>
          </Card>
        </Container>
      </ThemeProvider>
    );
  }

  if (!selectedSkip) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card sx={{ p: 3 }}>
            <Alert severity="error">
              <AlertTitle>No skip selected</AlertTitle>
              Please go back and select a skip first.
            </Alert>
            <Button
              variant="contained"
              onClick={onBack}
              startIcon={<ArrowLeft size={20} />}
              sx={{ mt: 3 }}
            >
              Back to Skip Selection
            </Button>
          </Card>
        </Container>
      </ThemeProvider>
    );
  }

  const privateOnly = !selectedSkip.allowed_on_road;

  return (
    <ThemeProvider theme={darkTheme}>
      <StepperDemo currentStep="Permit Check">
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Card sx={{ p: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Skip Placement
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Where will the skip be placed? This helps determine if you need a
              permit.
            </Typography>

            {privateOnly && (
              <Alert severity="warning" sx={{ mb: 4 }}>
                <AlertTitle>Road Placement Not Available</AlertTitle>
                The skip size you've selected cannot be placed on public roads
                due to road safety regulations. Please ensure you have adequate
                private space or choose a different skip size.
              </Alert>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                {" "}
                {/* flex: 1 permet aux boîtes de prendre une taille égale */}
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderColor:
                      placement === "private" ? "primary.main" : "divider",
                    backgroundColor:
                      placement === "private"
                        ? "rgba(99, 102, 241, 0.1)"
                        : "background.paper",
                    cursor: "pointer",
                  }}
                  onClick={() => setPlacement("private")}
                >
                  <FormControlLabel
                    value="private"
                    control={<Radio checked={placement === "private"} />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                        <HomeIcon size={24} style={{ marginRight: 16 }} />
                        <Box>
                          <Typography variant="h6">Private Property</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Driveway or private land
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            No permit required when placed on your private
                            property
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ width: "100%", m: 0 }}
                  />
                </Card>
              </Box>

              <Box sx={{ flex: 1 }}>
                {" "}
                {/* flex: 1 permet aux boîtes de prendre une taille égale */}
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    borderColor:
                      placement === "public" ? "primary.main" : "divider",
                    backgroundColor:
                      placement === "public"
                        ? "rgba(99, 102, 241, 0.1)"
                        : "background.paper",
                    opacity: privateOnly ? 0.6 : 1,
                    cursor: privateOnly ? "not-allowed" : "pointer",
                  }}
                  onClick={
                    privateOnly ? undefined : () => setPlacement("public")
                  }
                >
                  <FormControlLabel
                    value="public"
                    control={
                      <Radio
                        checked={placement === "public"}
                        disabled={privateOnly}
                      />
                    }
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                        {/* CORRECTION 1: Utilisation de <Route /> */}
                        <Route size={24} style={{ marginRight: 16 }} />
                        <Box>
                          <Typography variant="h6">Public Road</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Council or public property
                          </Typography>
                          {privateOnly ? (
                            <Typography variant="body2" color="error">
                              Road placement not available for this skip size
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Permit required for placement on public roads
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    }
                    sx={{ width: "100%", m: 0 }}
                  />
                </Card>
              </Box>
            </Box>

            {placement === "public" && !privateOnly && (
              <Alert severity="info" sx={{ mt: 4 }}>
                <AlertTitle>Permit Required</AlertTitle>
                A permit is required to place a skip on public roads. We will
                handle the permit application for you.
                <Divider sx={{ my: 2 }} />
                <strong>Processing Time:</strong> The council requires 5 working
                days notice to process permit applications. Please plan your
                delivery date accordingly.
              </Alert>
            )}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                variant="outlined"
                onClick={onBack}
                startIcon={<ArrowLeft size={20} />}
                // CORRECTION 2: Remplacement de fullWidth par la prop sx
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Back
              </Button>

              {privateOnly && placement === "public" ? (
                <Button
                  variant="contained"
                  onClick={onBack}
                  startIcon={<AlertCircle size={20} />}
                  color="warning"
                  // CORRECTION 2: Remplacement de fullWidth par la prop sx
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Choose Different Skip
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleContinue}
                  endIcon={<ArrowRight size={20} />}
                  // CORRECTION 2: Remplacement de fullWidth par la prop sx
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Continue
                </Button>
              )}
            </Stack>
          </Card>
        </Container>
      </StepperDemo>
    </ThemeProvider>
  );
};

export default PermitCheck;
