"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, CreditCard, CalendarIcon, UserCircle, Check, Info, MapPin, Clock, Package } from 'lucide-react';
import {
  Card,
  Typography,
  Button,
  Box,
  Divider,
  Stack,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Drawer,
  Alert,
  AlertTitle,
  InputAdornment,
  Fade,
  Chip,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StepperDemo from "./Stepper-demo";

// --- Types ---
interface Skip {
  id: number;
  size: number;
  price_before_vat: number;
  vat: number;
  hire_period_days: number;
}

interface AddressDetails {
  postcode: string;
  admin_district: string;
}

interface PaymentsProps {
  onBack: () => void;
}

// Thème sombre moderne - Correspondant aux autres composants
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
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#6366f1",
            },
          },
        },
      },
    },
    MuiSelect: {
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

// Liste d'exemple de pays
const countries = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IE', name: 'Ireland' },
];

const Payments = ({ onBack }: PaymentsProps) => {
  // --- State Management ---
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [collectionDate, setCollectionDate] = useState<Date | null>(null);
  const [address, setAddress] = useState<AddressDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [country, setCountry] = useState('GB');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedSkip = localStorage.getItem("selectedSkip");
        const storedDeliveryDate = localStorage.getItem("deliveryDate");
        const storedCollectionDate = localStorage.getItem("collectionDate");
        const storedAddress = localStorage.getItem("addressDetails");

        if (storedSkip) setSelectedSkip(JSON.parse(storedSkip));
        if (storedDeliveryDate) setDeliveryDate(new Date(storedDeliveryDate));
        if (storedCollectionDate) setCollectionDate(new Date(storedCollectionDate));
        if (storedAddress) setAddress(JSON.parse(storedAddress));
        
      } catch (error) {
        console.error("Failed to load data from localStorage", error);
      } finally {
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // --- Helper Functions ---
  const formatFullDate = (date: Date | null): string => {
    if (!date) return "N/A";
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsDrawerOpen(true);
    }, 2000);
  };


  // --- Calculations ---
  const vatAmount = selectedSkip ? (selectedSkip.price_before_vat * selectedSkip.vat) / 100 : 0;
  const totalAmount = selectedSkip ? selectedSkip.price_before_vat + vatAmount : 0;

  // --- Render Logic ---
  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <StepperDemo currentStep="Payment">
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 8 }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
              <CircularProgress color="primary" size={60} thickness={4} />
            </Box>
          </Container>
        </StepperDemo>
      </ThemeProvider>
    );
  }

  if (!selectedSkip || !deliveryDate || !collectionDate) {
    return (
      <ThemeProvider theme={darkTheme}>
        <StepperDemo currentStep="Payment">
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
                <AlertTitle sx={{ fontWeight: 600 }}>Missing Information</AlertTitle>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Some order details are missing. Please go back and complete the previous steps.
                </Typography>
                <Button onClick={onBack} variant="outlined" sx={{ mt: 2 }}>
                  Go Back
                </Button>
              </Alert>
            </Card>
          </Container>
        </StepperDemo>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <StepperDemo currentStep="Payment">
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
                Complete Your Payment
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
                Review your order details and complete your secure payment to confirm your skip hire booking.
              </Typography>
            </Box>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 mb-6">
              {/* Left Side: Order Summary */}
              <div className="w-full lg:w-2/5">
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
                      <Package size={24} color="#6366f1" />
                      Order Summary
                    </Typography>

                    <Card sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
                      {/* Skip Details */}
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            color: "text.primary",
                          }}
                        >
                          {selectedSkip.size} Yard Skip
                        </Typography>
                        
                        <Chip
                          label={`${selectedSkip.hire_period_days} days hire period`}
                          color="primary"
                          size="small"
                          sx={{ mb: 2 }}
                        />
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Dates and Location */}
                      <Stack spacing={2} sx={{ mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <MapPin size={18} color="#6366f1" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Delivery
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {formatFullDate(deliveryDate)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Clock size={18} color="#ec4899" />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Collection
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {formatFullDate(collectionDate)}
                            </Typography>
                          </Box>
                        </Box>

                        {address && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Info size={18} color="#10b981" />
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Location
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                {address.admin_district}, {address.postcode}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Stack>

                      <Divider sx={{ my: 2 }} />

                      {/* Price Breakdown */}
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography color="text.secondary">Subtotal (excl. VAT)</Typography>
                          <Typography sx={{ fontWeight: 500 }}>£{selectedSkip.price_before_vat.toFixed(2)}</Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography color="text.secondary">VAT ({selectedSkip.vat}%)</Typography>
                          <Typography sx={{ fontWeight: 500 }}>£{vatAmount.toFixed(2)}</Typography>
                        </Box>
                        
                        <Divider />
                        
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 2,
                            borderRadius: 2,
                            background: "rgba(99, 102, 241, 0.1)",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                            Total
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                            £{totalAmount.toFixed(2)}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>

                    {/* Security Notice */}
                    <Alert 
                      severity="success" 
                      sx={{ 
                        borderRadius: 3,
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <ShieldCheck size={18} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Secure Payment
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Your payment information is encrypted and secure.
                      </Typography>
                    </Alert>
                  </Box>
                </Fade>
              </div>

              {/* Right Side: Payment Details */}
              <div className="w-full lg:w-3/5">
                <Fade in timeout={600}>
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
                      <CreditCard size={24} color="#ec4899" />
                      Payment Details
                    </Typography>

                    <Card sx={{ p: { xs: 3, md: 4 } }}>
                      <Stack spacing={3}>
                        <TextField
                          fullWidth
                          label="Card Number"
                          variant="outlined"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CreditCard size={20} color="#6366f1" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                          <TextField
                            fullWidth
                            label="Expiration Date"
                            variant="outlined"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/YY"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CalendarIcon size={20} color="#6366f1" />
                                </InputAdornment>
                              ),
                            }}
                          />
                          
                          <TextField
                            fullWidth
                            label="Security Code"
                            variant="outlined"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            placeholder="123"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <ShieldCheck size={20} color="#6366f1" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>

                        <FormControl fullWidth>
                          <InputLabel id="country-select-label">Country</InputLabel>
                          <Select
                            labelId="country-select-label"
                            value={country}
                            label="Country"
                            onChange={(e) => setCountry(e.target.value)}
                          >
                            {countries.map((c) => (
                              <MenuItem key={c.code} value={c.code}>
                                {c.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={saveCard}
                              onChange={(e) => setSaveCard(e.target.checked)}
                              sx={{
                                color: 'primary.main',
                                '&.Mui-checked': {
                                  color: 'primary.main'
                                }
                              }}
                            />
                          }
                          label="Save this card as default payment method"
                        />
                      </Stack>
                    </Card>
                  </Box>
                </Fade>
              </div>
            </div>

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
                disabled={isProcessingPayment}
                sx={{
                  px: 4,
                  py: 1.5,
                  order: { xs: 2, sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                Back to Dates
              </Button>

              <Button
                variant="contained"
                onClick={handleCompletePayment}
                disabled={isProcessingPayment}
                endIcon={isProcessingPayment ? <CircularProgress size={20} color="inherit" /> : <ArrowRight size={20} />}
                sx={{
                  px: 4,
                  py: 1.5,
                  order: { xs: 1, sm: 2 },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {isProcessingPayment ? "Processing..." : `Complete Payment - £${totalAmount.toFixed(2)}`}
              </Button>
            </Box>
          </Box>
        </Container>
      </StepperDemo>

      {/* Account Creation Drawer */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
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
            Create Your Account
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            To help you track your order and manage your skip hire, we'll create an account for you.
          </Typography>

          <Stack spacing={3} sx={{ flexGrow: 1 }}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UserCircle size={20} color="#6366f1" />
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
            />
            
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
            />
            
            <TextField
              label="Confirm Email Address"
              type="email"
              variant="outlined"
              fullWidth
            />
            
            <TextField
              label="Phone Number"
              type="tel"
              variant="outlined"
              fullWidth
            />

            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 3,
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
              }}
            >
              <Typography variant="body2">
                We'll send you order updates and important information about your skip hire.
              </Typography>
            </Alert>
          </Stack>

          <Stack spacing={2} sx={{ mt: 'auto', pt: 2 }}>
            <Button
              variant="contained"
              endIcon={<Check size={20} />}
              onClick={() => alert("Account Created! (Simulation)")}
            >
              Create Account & Complete Order
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setIsDrawerOpen(false)}
              startIcon={<ArrowLeft size={20} />}
            >
              Back to Payment
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Payments;