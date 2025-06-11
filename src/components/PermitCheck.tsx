"use client";

import { useState, useEffect } from "react";
// CORRECTION 1: Remplacement de "Road" par "Route"
// NOUVEL IMPORT: Ajout de UploadFile pour le Drawer
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Home as HomeIcon,
  Route,
  Upload, // <-- NOUVEL IMPORT
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
  Drawer,
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

const PermitCheck = ({ onBack, onContinue }: PermitCheckProps) => {
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [placement, setPlacement] = useState<"private" | "public">("private");
  const [loading, setLoading] = useState(true);
  // --- DÉBUT DES NOUVEAUX AJOUTS ---
  // État pour contrôler l'ouverture du Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // --- FIN DES NOUVEAUX AJOUTS ---

  useEffect(() => {
    const storedSkip = localStorage.getItem("selectedSkip");
    if (storedSkip) {
      setSelectedSkip(JSON.parse(storedSkip));
    }
    setLoading(false);
  }, []);

  // --- MODIFICATION DE LA FONCTION handleContinue ---
  // Ouvre le Drawer au lieu de simplement logger un message
  const handleContinue = () => {
    console.log("Placement selected:", placement);
    setIsDrawerOpen(true); // Ouvre le Drawer
  };

  // Nouvelle fonction pour la continuation finale depuis le Drawer
  const handleFinalContinue = () => {
    console.log("Étape de la photo terminée. Passage à l'étape suivante.");
    setIsDrawerOpen(false);
    // Ici, vous appelleriez la vraie fonction de continuation si elle existe
    if (onContinue) {
      onContinue();
    }
  };
  // --- FIN DES MODIFICATIONS ---


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
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Choose Different Skip
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleContinue}
                  endIcon={<ArrowRight size={20} />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Continue
                </Button>
              )}
            </Stack>
          </Card>
        </Container>
      </StepperDemo>

      {/* --- DÉBUT DU NOUVEAU BLOC : LE DRAWER --- */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box
          sx={{ 
            width: { xs: '90vw', sm: 400 }, 
            p: 3, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: 'background.paper'
          }}
          role="presentation"
        >
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
              Skip Placement Photo
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Please provide a photo of where you plan to place the skip. This
              helps us ensure proper placement and identify any potential access
              issues.
            </Typography>
            
            {/* Le bouton agit comme un label pour l'input de fichier caché */}
            <Button
              component="label"
              role="button"
              variant="contained"
              fullWidth
              startIcon={<Upload />}
              sx={{ mb: 2 }}
            >
              Upload Photo
              <input type="file" accept="image/*" hidden />
            </Button>
            
            <Button
              variant="text"
              size="small"
              onClick={handleFinalContinue} // Permet de sauter l'étape
            >
              Skip this step
            </Button>
          </Box>
          
          {/* Les boutons d'action sont poussés en bas du Drawer */}
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 'auto', pt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={() => setIsDrawerOpen(false)}
              startIcon={<ArrowLeft size={20} />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={onContinue}
              endIcon={<ArrowRight size={20} />}
            >
              Continue
            </Button>
          </Stack>
        </Box>
      </Drawer>
      {/* --- FIN DU NOUVEAU BLOC : LE DRAWER --- */}
    </ThemeProvider>
  );
};

export default PermitCheck;