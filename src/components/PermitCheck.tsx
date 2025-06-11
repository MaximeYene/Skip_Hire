"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, AlertCircle, HomeIcon, Route, Upload, Check, Info } from 'lucide-react';
import {
  Card,
  Typography,
  Button,
  Box,
  Radio,
  Alert,
  AlertTitle,
  Divider,
  Stack,
  Container,
  Drawer,
  Fade,
  Zoom,
  Chip,
  CircularProgress
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

// Thème sombre moderne - Correspondant au thème de SelectSkip
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#ec4899",
    },
    success: {
      main: "#10b981",
    },
    warning: {
      main: "#f59e0b",
    },
    error: {
      main: "#ef4444",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "16px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 24px",
        },
        outlined: {
          borderColor: "#475569",
          color: "#cbd5e1",
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            borderColor: "#6366f1",
          },
        },
        contained: {
          boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.3)",
          "&:hover": {
            boxShadow: "0 6px 20px 0 rgba(99, 102, 241, 0.4)",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1e293b",
          borderRight: "1px solid #334155",
        },
      },
    },
  },
});

const PermitCheck = ({ onBack, onContinue }: PermitCheckProps) => {
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [placement, setPlacement] = useState<"private" | "public">("private");
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const storedSkip = localStorage.getItem("selectedSkip");
    if (storedSkip) {
      setSelectedSkip(JSON.parse(storedSkip));
    }
    
    // Simulation d'un chargement pour montrer l'animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    console.log("Placement selected:", placement);
    setIsDrawerOpen(true);
  };

  const handleFinalContinue = () => {
    console.log("Étape de la photo terminée. Passage à l'étape suivante.");
    setIsDrawerOpen(false);
    if (onContinue) {
      onContinue();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Simuler un délai de chargement
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <StepperDemo currentStep="Permit Check">
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 8 }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
              <CircularProgress color="primary" size={60} thickness={4} />
            </Box>
          </Container>
        </StepperDemo>
      </ThemeProvider>
    );
  }

  if (!selectedSkip) {
    return (
      <ThemeProvider theme={darkTheme}>
        <StepperDemo currentStep="Permit Check">
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 8 }}>
            <Card sx={{ p: { xs: 3, md: 4 }, maxWidth: "md", mx: "auto" }}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 4,
                  borderRadius: 3,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>No skip selected</AlertTitle>
                <Typography variant="body2">
                  Please go back and select a skip first before proceeding with the permit check.
                </Typography>
              </Alert>
              <Button
                variant="contained"
                onClick={onBack}
                startIcon={<ArrowLeft size={20} />}
                sx={{ mt: 2 }}
              >
                Back to Skip Selection
              </Button>
            </Card>
          </Container>
        </StepperDemo>
      </ThemeProvider>
    );
  }

  const privateOnly = !selectedSkip.allowed_on_road;

  return (
    <ThemeProvider theme={darkTheme}>
      <StepperDemo currentStep="Permit Check">
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 4, md: 8 }, pb: { xs: 16, sm: 12 } }}>
          <Box sx={{ color: "text.primary", maxWidth: "lg", mx: "auto" }}>
            {/* Header Section */}
            <Box sx={{ mb: 6, textAlign: "center" }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Skip Placement Location
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "text.secondary",
                  maxWidth: "600px",
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Where will the skip be placed? This helps determine if you need a permit.
              </Typography>
            </Box>

            {privateOnly && (
              <Fade in timeout={500}>
                <Alert 
                  severity="warning" 
                  sx={{ 
                    mb: 4,
                    borderRadius: 3,
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  <AlertTitle sx={{ fontWeight: 600 }}>Road Placement Not Available</AlertTitle>
                  <Typography variant="body2">
                    The {selectedSkip.size} yard skip you've selected cannot be placed on public roads
                    due to road safety regulations. Please ensure you have adequate
                    private space or choose a different skip size.
                  </Typography>
                </Alert>
              </Fade>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                mb: 4,
              }}
            >
              <Fade in timeout={400}>
                <Box sx={{ flex: 1 }}>
                  <Card
                    sx={{
                      height: "100%",
                      border: placement === "private" ? "2px solid" : "1px solid",
                      borderColor: placement === "private" ? "primary.main" : "divider",
                      background: placement === "private"
                        ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(30, 41, 59, 1) 100%)"
                        : "background.paper",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.1)",
                        borderColor: placement === "private" ? "primary.main" : "#475569",
                      },
                      position: "relative",
                      overflow: "visible",
                    }}
                    onClick={() => setPlacement("private")}
                  >
                    {placement === "private" && (
                      <Zoom in>
                        <Chip
                          icon={<Check size={16} />}
                          label="Selected"
                          color="primary"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            zIndex: 2,
                            fontWeight: 600,
                          }}
                        />
                      </Zoom>
                    )}
                    
                    <Box sx={{ p: { xs: 3, md: 4 } }}>
                      <Box 
                        sx={{ 
                          height: { xs: 120, md: 160 },
                          background: "linear-gradient(135deg, #334155 0%, #475569 100%)",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Decorative elements */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: -20,
                            right: -20,
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background: "rgba(99, 102, 241, 0.1)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -30,
                            left: -30,
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "rgba(236, 72, 153, 0.1)",
                          }}
                        />
                        
                        <HomeIcon size={64} color="#f8fafc" />
                      </Box>
                      
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: "text.primary",
                        }}
                      >
                        Private Property
                      </Typography>
                      
                      <Box
                        sx={{
                          mb: 3,
                          p: 2,
                          borderRadius: 2,
                          background: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: "#10b981",
                            mb: 0.5,
                          }}
                        >
                          No Permit Required
                        </Typography>
                      </Box>
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Info size={18} color="#6366f1" />
                          <Typography variant="body2" color="text.secondary">
                            Driveway or private land
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Info size={18} color="#6366f1" />
                          <Typography variant="body2" color="text.secondary">
                            No council permission needed
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Info size={18} color="#6366f1" />
                          <Typography variant="body2" color="text.secondary">
                            Immediate delivery available
                          </Typography>
                        </Box>
                      </Stack>
                      
                      <Radio 
                        checked={placement === "private"} 
                        sx={{ 
                          position: "absolute", 
                          top: 16, 
                          left: 16,
                          '& .MuiSvgIcon-root': {
                            fontSize: 28,
                          },
                        }} 
                      />
                    </Box>
                  </Card>
                </Box>
              </Fade>

              <Fade in timeout={600}>
                <Box sx={{ flex: 1 }}>
                  <Card
                    sx={{
                      height: "100%",
                      border: placement === "public" ? "2px solid" : "1px solid",
                      borderColor: placement === "public" ? "primary.main" : "divider",
                      background: placement === "public"
                        ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(30, 41, 59, 1) 100%)"
                        : "background.paper",
                      cursor: privateOnly ? "not-allowed" : "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": !privateOnly ? {
                        transform: "translateY(-8px)",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.1)",
                        borderColor: placement === "public" ? "primary.main" : "#475569",
                      } : {},
                      opacity: privateOnly ? 0.6 : 1,
                      position: "relative",
                      overflow: "visible",
                    }}
                    onClick={privateOnly ? undefined : () => setPlacement("public")}
                  >
                    {placement === "public" && !privateOnly && (
                      <Zoom in>
                        <Chip
                          icon={<Check size={16} />}
                          label="Selected"
                          color="primary"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            zIndex: 2,
                            fontWeight: 600,
                          }}
                        />
                      </Zoom>
                    )}
                    
                    <Box sx={{ p: { xs: 3, md: 4 } }}>
                      <Box 
                        sx={{ 
                          height: { xs: 120, md: 160 },
                          background: "linear-gradient(135deg, #334155 0%, #475569 100%)",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 3,
                          position: "relative",
                          overflow: "hidden",
                          filter: privateOnly ? "grayscale(0.5)" : "none",
                        }}
                      >
                        {/* Decorative elements */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: -20,
                            right: -20,
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            background: "rgba(99, 102, 241, 0.1)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: -30,
                            left: -30,
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "rgba(236, 72, 153, 0.1)",
                          }}
                        />
                        
                        <Route size={64} color="#f8fafc" />
                      </Box>
                      
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: "text.primary",
                        }}
                      >
                        Public Road
                      </Typography>
                      
                      <Box
                        sx={{
                          mb: 3,
                          p: 2,
                          borderRadius: 2,
                          background: privateOnly ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)",
                          border: privateOnly ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid rgba(245, 158, 11, 0.2)",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            color: privateOnly ? "#ef4444" : "#f59e0b",
                            mb: 0.5,
                          }}
                        >
                          {privateOnly ? "Not Available" : "Permit Required"}
                        </Typography>
                      </Box>
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Info size={18} color={privateOnly ? "#94a3b8" : "#6366f1"} />
                          <Typography variant="body2" color="text.secondary">
                            Council or public property
                          </Typography>
                        </Box>
                        {privateOnly ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <AlertCircle size={18} color="#ef4444" />
                            <Typography variant="body2" color="error">
                              Not available for {selectedSkip.size} yard skip
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Info size={18} color="#6366f1" />
                              <Typography variant="body2" color="text.secondary">
                                Council permit handled by us
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Info size={18} color="#6366f1" />
                              <Typography variant="body2" color="text.secondary">
                                5 working days processing
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Stack>
                      
                      <Radio 
                        checked={placement === "public"} 
                        disabled={privateOnly}
                        sx={{ 
                          position: "absolute", 
                          top: 16, 
                          left: 16,
                          '& .MuiSvgIcon-root': {
                            fontSize: 28,
                          },
                        }} 
                      />
                    </Box>
                  </Card>
                </Box>
              </Fade>
            </Box>

            {placement === "public" && !privateOnly && (
              <Fade in timeout={700}>
                <Alert 
                  severity="info" 
                  sx={{ 
                    mt: 4,
                    mb: 4,
                    borderRadius: 3,
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                >
                  <AlertTitle sx={{ fontWeight: 600 }}>Permit Required</AlertTitle>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    A permit is required to place a skip on public roads. We will
                    handle the permit application for you.
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2">
                    <strong>Processing Time:</strong> The council requires 5 working
                    days notice to process permit applications. Please plan your
                    delivery date accordingly.
                  </Typography>
                </Alert>
              </Fade>
            )}

            {/* Navigation - Flottante */}
            <Box
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
                boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.3)",
                p: { xs: 2, sm: 3 },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={onBack}
                startIcon={<ArrowLeft size={20} />}
                sx={{
                  px: 4,
                  py: 1.5,
                  order: { xs: 2, sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Back to Skip Selection
              </Button>

              {privateOnly && placement === "public" ? (
                <Button
                  variant="contained"
                  onClick={onBack}
                  startIcon={<AlertCircle size={20} />}
                  color="warning"
                  sx={{
                    px: 4,
                    py: 1.5,
                    order: { xs: 1, sm: 2 },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Choose Different Skip
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleContinue}
                  endIcon={<ArrowRight size={20} />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    order: { xs: 1, sm: 2 },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Continue to Details
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </StepperDemo>

      {/* Drawer amélioré */}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box
          sx={{ 
            width: { xs: '100vw', sm: 450 }, 
            p: { xs: 3, sm: 4 }, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            backgroundColor: 'background.paper'
          }}
          role="presentation"
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Skip Placement Photo
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please provide a photo of where you plan to place the skip. This
            helps us ensure proper placement and identify any potential access
            issues.
          </Typography>
          
          {uploadedImage ? (
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                }}
              >
                <img 
                  src={uploadedImage || "/placeholder.svg"} 
                  alt="Uploaded placement location" 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block',
                    maxHeight: '300px',
                    objectFit: 'cover'
                  }} 
                />
                <Chip
                  label="Uploaded"
                  color="success"
                  size="small"
                  icon={<Check size={16} />}
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    fontWeight: 600,
                  }}
                />
              </Box>
              
              <Button
                component="label"
                variant="outlined"
                startIcon={<Upload />}
                sx={{ mr: 2 }}
              >
                Change Photo
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 3,
                p: 4,
                mb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                minHeight: '200px',
              }}
            >
              {isUploading ? (
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress size={40} sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Uploading your image...
                  </Typography>
                </Box>
              ) : (
                <>
                  <Upload size={48} color="#6366f1" style={{ marginBottom: '16px', opacity: 0.8 }} />
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Upload Placement Photo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                    Drag and drop an image here or click to browse
                  </Typography>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<Upload />}
                  >
                    Select Image
                    <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                  </Button>
                </>
              )}
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Alert 
            severity="info" 
            sx={{ 
              mb: 4,
              borderRadius: 3,
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            <Typography variant="body2">
              Providing a photo helps us ensure the skip can be delivered safely and efficiently to your chosen location.
            </Typography>
          </Alert>
          
          <Button
            variant="text"
            size="small"
            onClick={handleFinalContinue}
            sx={{ alignSelf: 'flex-start', mb: 2 }}
          >
            Skip this step
          </Button>
          
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
              onClick={handleFinalContinue}
              endIcon={<ArrowRight size={20} />}
              disabled={isUploading}
            >
              Continue to Details
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default PermitCheck;