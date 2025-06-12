
import { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, MapPin } from 'lucide-react';
import {
  Card,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  Fade,
  Divider,
  Alert,
  AlertTitle,
  Collapse,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StepperDemo from "./Stepper-demo";
import { Calendar } from "./Calendar";

// --- Helper Components & Types ---

interface ChooseDateProps {
  onBack: () => void;
  onContinue?: () => void;
}

// Modern dark theme – Consistent with other components
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
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          "&:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.1)",
          },
        },
      },
    },
  },
});

/**
 * Find the next available weekday (not a Saturday or Sunday).
 * Starting from the provided date (inclusive).
 * @param date - The start date.
 * @returns The first available date that is not a weekend.
 */
const getNextAvailableWeekday = (date: Date): Date => {
  const newDate = new Date(date);
  // getDay() returns 0 for Sunday and 6 for Saturday.
  while (newDate.getDay() === 0 || newDate.getDay() === 6) {
    newDate.setDate(newDate.getDate() + 1);
  }
  return newDate;
};


const ChooseDate = ({ onBack, onContinue }: ChooseDateProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);


  const [deliveryDate, setDeliveryDate] = useState<Date>(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return getNextAvailableWeekday(tomorrow);
  });

  const [collectionDate, setCollectionDate] = useState<Date>(() => {
    const initialCollection = new Date(deliveryDate);
    initialCollection.setDate(deliveryDate.getDate() + 7);
    return getNextAvailableWeekday(initialCollection);
  });

  const [displayDeliveryMonth, setDisplayDeliveryMonth] = useState(deliveryDate);
  const [displayCollectionMonth, setDisplayCollectionMonth] = useState(collectionDate);
  const [isCollectionCalendarVisible, setCollectionCalendarVisible] = useState(false);

  const handleSelectDeliveryDate = (date: Date) => {
    setDeliveryDate(date);
    const newCollectionDate = new Date(date);
    newCollectionDate.setDate(date.getDate() + 7);

    const availableCollectionDate = getNextAvailableWeekday(newCollectionDate);
    
    setCollectionDate(availableCollectionDate);
    setDisplayCollectionMonth(availableCollectionDate);
  };

  const handleSelectCollectionDate = (date: Date) => {
    setCollectionDate(date);
  };

  const formatFullDate = (date: Date): string => {
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleContinue = () => {
    localStorage.setItem("deliveryDate", deliveryDate.toISOString());
    localStorage.setItem("collectionDate", collectionDate.toISOString());
    if (onContinue) {
      onContinue();
    }
  };

  const getDaysDifference = (date1: Date, date2: Date) => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <StepperDemo currentStep="Choose Date">
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 4, md: 8 }, pb: { xs: 16, sm: 12 } }}>
          <Box sx={{ color: "text.primary", maxWidth: "lg", mx: "auto" }}>
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
                Choose Your Delivery & Collection Dates
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
                Select your preferred skip delivery date. We'll aim to deliver between 7am and 6pm on your chosen day.
              </Typography>
            </Box>

            {/* Calendars Section */}
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              {/* Delivery Date Section */}
              <div className="w-full lg:w-1/2">
                <Fade in timeout={400}>
                  <Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: "text.primary",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <MapPin size={24} color="#6366f1" />
                      Delivery Date
                    </Typography>
                    
                    <Calendar
                      displayMonth={displayDeliveryMonth}
                      onMonthChange={setDisplayDeliveryMonth}
                      selectedDate={deliveryDate}
                      onDateSelect={handleSelectDeliveryDate}
                      minDate={today}
                    />
                    
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mt: 3,
                        borderRadius: 3,
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        border: "1px solid rgba(99, 102, 241, 0.2)",
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Selected:</strong> {formatFullDate(deliveryDate)}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Delivery window: 7:00 AM - 6:00 PM
                      </Typography>
                    </Alert>
                  </Box>
                </Fade>
              </div>

              {/* Collection Date Section */}
              <div className="w-full lg:w-1/2">
                <Fade in timeout={600}>
                  <Box>
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: "text.primary",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Clock size={24} color="#ec4899" />
                      Collection Date
                    </Typography>

                    <Card sx={{ p: 3, mb: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "secondary.main",
                              mb: 1,
                            }}
                          >
                            {formatFullDate(collectionDate)}
                          </Typography>
                          
                          <Chip
                            label={`${getDaysDifference(deliveryDate, collectionDate)} days hire period`}
                            color="secondary"
                            size="small"
                            sx={{ mb: 2 }}
                          />
                          
                          <Typography variant="body2" color="text.secondary">
                            We'll collect your skip on this date. Please ensure it's accessible and ready for collection.
                          </Typography>
                        </Box>
                        
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setCollectionCalendarVisible(!isCollectionCalendarVisible)}
                          sx={{ ml: 2 }}
                        >
                          {isCollectionCalendarVisible ? "Hide" : "Change"}
                        </Button>
                      </Box>
                    </Card>

                    <Collapse in={isCollectionCalendarVisible}>
                      <Calendar
                        displayMonth={displayCollectionMonth}
                        onMonthChange={setDisplayCollectionMonth}
                        selectedDate={collectionDate}
                        onDateSelect={handleSelectCollectionDate}
                        minDate={deliveryDate}
                        title="Select Collection Date"
                      />
                    </Collapse>

                    {!isCollectionCalendarVisible && (
                      <Alert 
                        severity="success" 
                        sx={{ 
                          borderRadius: 3,
                          backgroundColor: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.2)",
                        }}
                      >
                        <AlertTitle sx={{ fontWeight: 600 }}>Collection Scheduled</AlertTitle>
                        <Typography variant="body2">
                          Your skip will be collected automatically on the selected date. 
                          You can change this date if needed.
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                </Fade>
              </div>
            </div>

            {/* Summary Section */}
            <Fade in timeout={800}>
              <Card sx={{ p: 3, mb: 4, background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(30, 41, 59, 1) 100%)" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: "text.primary",
                  }}
                >
                  Booking Summary
                </Typography>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="w-full sm:w-1/2">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                      <MapPin size={18} color="#6366f1" />
                      <Typography variant="body2" color="text.secondary">
                        Delivery: {deliveryDate.toLocaleDateString("en-GB")}
                      </Typography>
                    </Box>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                      <Clock size={18} color="#ec4899" />
                      <Typography variant="body2" color="text.secondary">
                        Collection: {collectionDate.toLocaleDateString("en-GB")}
                      </Typography>
                    </Box>
                  </div>
                </div>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="body2" color="text.secondary">
                  <strong>Hire Period:</strong> {getDaysDifference(deliveryDate, collectionDate)} days
                </Typography>
              </Card>
            </Fade>

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
                sx={{
                  px: 4,
                  py: 1.5,
                  order: { xs: 2, sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Back to Permit Check
              </Button>

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
                Continue to Payment
              </Button>
            </Box>
          </Box>
        </Container>
      </StepperDemo>
    </ThemeProvider>
  );
};

export default ChooseDate;