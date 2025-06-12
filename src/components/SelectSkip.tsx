
import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Check, Info, Clock, MapPin, Weight } from 'lucide-react'
import StepperDemo from "./Stepper-demo"
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Tooltip,
  Skeleton,
  Fade,
  Zoom,
  Container,
  Stack,
  Divider,
  IconButton,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"

interface Skip {
  id: number
  size: number
  hire_period_days: number
  price_before_vat: number
  allowed_on_road: boolean
  allows_heavy_waste: boolean
}

interface SelectSkipProps {
  onBack: () => void
  onContinue?: () => void
}

// // Modern dark theme – Consistent with other components
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
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.1)",
            borderColor: "#475569",
          },
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
  },
})

const SelectSkip = ({ onBack, onContinue }: SelectSkipProps) => {
  const [skips, setSkips] = useState<Skip[]>([])
  const [selectedSkipId, setSelectedSkipId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        setSkips(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading skips:", error)
        setIsLoading(false)

        // Fallback datas
        setSkips([
          {
            id: 1,
            size: 4,
            hire_period_days: 7,
            price_before_vat: 150,
            allowed_on_road: true,
            allows_heavy_waste: false,
          },
          {
            id: 2,
            size: 6,
            hire_period_days: 7,
            price_before_vat: 180,
            allowed_on_road: true,
            allows_heavy_waste: false,
          },
          {
            id: 3,
            size: 8,
            hire_period_days: 14,
            price_before_vat: 220,
            allowed_on_road: true,
            allows_heavy_waste: true,
          },
          {
            id: 4,
            size: 12,
            hire_period_days: 14,
            price_before_vat: 280,
            allowed_on_road: false,
            allows_heavy_waste: true,
          },
          {
            id: 5,
            size: 16,
            hire_period_days: 14,
            price_before_vat: 350,
            allowed_on_road: false,
            allows_heavy_waste: true,
          },
          {
            id: 6,
            size: 20,
            hire_period_days: 21,
            price_before_vat: 420,
            allowed_on_road: false,
            allows_heavy_waste: true,
          },
        ])
      })
  }, [])


const handleSelectSkip = (id: number) => {
  const newSelectedId = id === selectedSkipId ? null : id
  setSelectedSkipId(newSelectedId)
  
  if (newSelectedId) {
    const selected = skips.find(skip => skip.id === newSelectedId)
    if (selected) {
      localStorage.setItem("selectedSkip", JSON.stringify(selected))
    }
  }
}

  const handleContinue = () => {
    if (selectedSkipId && onContinue) {
      onContinue()
    }
  }

  const getPopularSkip = () => {
    return skips.find((skip) => skip.size === 8)?.id || null
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <StepperDemo currentStep="Select Skip">
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 16, sm: 12 } }}>
          <Box sx={{ color: "text.primary" }}>
            {/* Header Section */}
            <Box sx={{ mb: 6, textAlign: "center" }}>
              <Typography
                variant="h3"
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
                Choose Your Perfect Skip Size
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
                Select the ideal skip size for your project. All prices exclude VAT and include delivery and collection.
              </Typography>
            </Box>

            {/* Loading State */}
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  justifyContent: "center",
                }}
              >
                {[1, 2, 3].map((i) => (
                  <Box key={i} sx={{ width: { xs: "100%", sm: "calc(50% - 12px)", lg: "calc(33.333% - 16px)" } }}>
                    <Card sx={{ height: 480 }}>
                      <Skeleton variant="rectangular" height={220} />
                      <CardContent sx={{ p: 3 }}>
                        <Skeleton variant="text" height={32} width="60%" />
                        <Skeleton variant="text" height={24} width="40%" sx={{ mt: 2 }} />
                        <Box sx={{ mt: 3 }}>
                          <Skeleton variant="text" height={20} width="80%" />
                          <Skeleton variant="text" height={20} width="70%" sx={{ mt: 1 }} />
                          <Skeleton variant="text" height={20} width="60%" sx={{ mt: 1 }} />
                        </Box>
                        <Skeleton variant="rectangular" height={48} sx={{ mt: 3, borderRadius: 2 }} />
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            ) : (
              /* Skip Cards */
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  justifyContent: "center",
                  mb: 6,
                }}
              >
                {skips.map((skip, index) => (
                  <Fade in timeout={400 + index * 100} key={skip.id}>
                    <Box
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "calc(50% - 12px)",
                          lg: "calc(33.333% - 16px)",
                          xl: "calc(25% - 18px)",
                        },
                        maxWidth: { xs: "320px", sm: "380px" },
                      }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          cursor: "pointer",
                          border: selectedSkipId === skip.id ? "2px solid" : "1px solid",
                          borderColor: selectedSkipId === skip.id ? "primary.main" : "divider",
                          background:
                            selectedSkipId === skip.id
                              ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(30, 41, 59, 1) 100%)"
                              : "background.paper",
                        }}
                        onClick={() => handleSelectSkip(skip.id)}
                      >
                        {/* Popular Badge */}
                        {skip.id === getPopularSkip() && (
                          <Chip
                            label="Most Popular"
                            color="secondary"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 12,
                              left: 12,
                              zIndex: 2,
                              fontWeight: 600,
                            }}
                          />
                        )}

                        {/* Selected Badge */}
                        {selectedSkipId === skip.id && (
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

                        {/* Image Section */}
                        <Box
                          sx={{
                            height: { xs: 160, sm: 220 },
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={skip.size <= 12 ? "/benne-a-boue.jpg" : "/1200_900-Vue 3_4 avant Benne étanche 20 m3.webp"}
                            alt={`${skip.size} yard skip`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                            onError={(e) => {
                              // Fallback in case of image loading error.
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              target.parentElement!.innerHTML = `
                                <div style="
                                  width: 100%;
                                  height: 100%;
                                  background: linear-gradient(135deg, #334155 0%, #475569 100%);
                                  display: flex;
                                  align-items: center;
                                  justify-content: center;
                                  position: relative;
                                  overflow: hidden;
                                ">
                                  <div style="
                                    position: absolute;
                                    top: -20px;
                                    right: -20px;
                                    width: 100px;
                                    height: 100px;
                                    border-radius: 50%;
                                    background: rgba(99, 102, 241, 0.1);
                                  "></div>
                                  <div style="
                                    position: absolute;
                                    bottom: -30px;
                                    left: -30px;
                                    width: 80px;
                                    height: 80px;
                                    border-radius: 50%;
                                    background: rgba(236, 72, 153, 0.1);
                                  "></div>
                                  <div style="text-align: center; z-index: 1;">
                                    <div style="
                                      font-weight: 800;
                                      font-size: 2.5rem;
                                      background: linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%);
                                      background-clip: text;
                                      -webkit-background-clip: text;
                                      -webkit-text-fill-color: transparent;
                                      margin-bottom: 8px;
                                    ">${skip.size}</div>
                                    <div style="
                                      color: #94a3b8;
                                      font-weight: 600;
                                      letter-spacing: 0.1em;
                                    ">YARD SKIP</div>
                                  </div>
                                </div>
                              `;
                            }}
                          />
                          

                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                              p: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 800,
                                color: "white",
                                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                              }}
                            >
                              {skip.size} YARD
                            </Typography>
                          </Box>
                        </Box>

                        {/* Content Section */}
                        <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                          <Typography
                            variant="h5"
                            component="h3"
                            sx={{
                              fontWeight: 600,
                              mb: 3,
                              color: "text.primary",
                            }}
                          >
                            {skip.size} Yard Skip
                          </Typography>

                          {/* Price Section */}
                          <Box
                            sx={{
                              mb: 3,
                              p: 2,
                              borderRadius: 2,
                              background: "rgba(99, 102, 241, 0.1)",
                              border: "1px solid rgba(99, 102, 241, 0.2)",
                            }}
                          >
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 700,
                                color: "primary.main",
                                mb: 0.5,
                              }}
                            >
                              £{skip.price_before_vat}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Excluding VAT
                            </Typography>
                          </Box>

                          {/* Features */}
                          <Stack spacing={2}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              <Clock size={18} color="#6366f1" />
                              <Typography variant="body2" color="text.secondary">
                                {skip.hire_period_days} days hire period
                              </Typography>
                            </Box>

                            <Tooltip
                              title={
                                skip.allowed_on_road
                                  ? "This skip can be placed on public roads with proper permits"
                                  : "This skip must be placed on private property only"
                              }
                              arrow
                              placement="top"
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <MapPin size={18} color={skip.allowed_on_road ? "#10b981" : "#ef4444"} />
                                <Typography variant="body2" color="text.secondary">
                                  {skip.allowed_on_road ? "Road placement allowed" : "Private property only"}
                                </Typography>
                                <IconButton size="small" sx={{ ml: "auto", p: 0.5 }}>
                                  <Info size={16} style={{ color: "#94a3b8" }} />
                                </IconButton>
                              </Box>
                            </Tooltip>

                            <Tooltip
                              title={
                                skip.allows_heavy_waste
                                  ? "Suitable for heavy materials like soil, concrete, and bricks"
                                  : "Only suitable for lighter waste materials"
                              }
                              arrow
                              placement="top"
                            >
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                <Weight size={18} color={skip.allows_heavy_waste ? "#10b981" : "#f59e0b"} />
                                <Typography variant="body2" color="text.secondary">
                                  {skip.allows_heavy_waste ? "Heavy waste accepted" : "Light waste only"}
                                </Typography>
                                <IconButton size="small" sx={{ ml: "auto", p: 0.5 }}>
                                  <Info size={16} style={{ color: "#94a3b8" }} />
                                </IconButton>
                              </Box>
                            </Tooltip>
                          </Stack>
                        </CardContent>

                        <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.1)" }} />

                        {/* Action Button */}
                        <Box sx={{ p: { xs: 2, sm: 3 } }}>
                          <Button
                            fullWidth
                            variant={selectedSkipId === skip.id ? "contained" : "outlined"}
                            color="primary"
                            size="large"
                            sx={{
                              py: 1.5,
                              fontSize: "1rem",
                              fontWeight: 600,
                            }}
                          >
                            {selectedSkipId === skip.id ? "✓ Selected" : "Select This Skip"}
                          </Button>
                        </Box>
                      </Card>
                    </Box>
                  </Fade>
                ))}
              </Box>
            )}

            {/* Floating Navigation */}
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
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  order: { xs: 2, sm: 1 },
                }}
              >
                Back to Waste Type
              </Button>

              <Button
                variant="contained"
                onClick={handleContinue}
                disabled={!selectedSkipId}
                endIcon={<ArrowRight size={20} />}
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  order: { xs: 1, sm: 2 },
                }}
              >
                Continue to Details
              </Button>
            </Box>
          </Box>
        </Container>
      </StepperDemo>
    </ThemeProvider>
  )
}

export default SelectSkip