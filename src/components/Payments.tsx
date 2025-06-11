
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Calendar as CalendarIcon,
  UserCircle,
} from "lucide-react";
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
  Skeleton,
  Alert,
  AlertTitle,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import StepperDemo from "./Stepper-demo";

// --- Types (à placer dans un fichier partagé si nécessaire) ---
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

// Thème sombre cohérent avec les autres composants
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366f1" },
    background: { default: "#0f172a", paper: "#1e293b" },
    text: { primary: "#f8fafc", secondary: "#cbd5e1" },
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

const Payments = ({ onBack }: { onBack: () => void }) => {
  // --- State Management ---
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [collectionDate, setCollectionDate] = useState<Date | null>(null);
  const [address, setAddress] = useState<AddressDetails | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [country, setCountry] = useState('GB');

  // --- Data Fetching Effect ---
  useEffect(() => {
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
    setIsDrawerOpen(true);
  };

  // --- Calculations ---
  const vatAmount = selectedSkip ? (selectedSkip.price_before_vat * selectedSkip.vat) / 100 : 0;
  const totalAmount = selectedSkip ? selectedSkip.price_before_vat + vatAmount : 0;

  // --- Render Logic ---
  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Container maxWidth="lg" sx={{ py: 4 }}><Skeleton variant="rectangular" height={500} /></Container>
      </ThemeProvider>
    );
  }

  if (!selectedSkip || !deliveryDate || !collectionDate) {
    return (
        <ThemeProvider theme={darkTheme}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    <AlertTitle>Missing Information</AlertTitle>
                    Some order details are missing. Please go back and complete the previous steps.
                    <Button onClick={onBack} variant="outlined" sx={{mt: 2}}>Go Back</Button>
                </Alert>
            </Container>
        </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <StepperDemo currentStep="Payment">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            
            {/* Left Side: Order Summary */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
                Order Summary
              </Typography>
              <Card sx={{ p: 3, background: 'background.paper' }}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{selectedSkip.size} Yard Skip</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedSkip.hire_period_days} day hire period</Typography>
                  <Divider />
                  <Box>
                    <Typography variant="body1"><strong>Delivery:</strong> {formatFullDate(deliveryDate)}</Typography>
                    <Typography variant="body1"><strong>Collection:</strong> {formatFullDate(collectionDate)}</Typography>
                    {address && <Typography variant="body2" color="text.secondary">Location: {address.admin_district}, {address.postcode}</Typography>}
                  </Box>
                  <Divider />
                  <Stack spacing={1} sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Subtotal (excl. VAT)</Typography>
                        <Typography>£{selectedSkip.price_before_vat.toFixed(2)}</Typography>
                    </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">VAT ({selectedSkip.vat}%)</Typography>
                        <Typography>£{vatAmount.toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>£{totalAmount.toFixed(2)}</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </Box>

            {/* Right Side: Payment Details */}
            <Box sx={{ flex: 1.2 }}>
               <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
                Payment Details
              </Typography>
              <Card sx={{ p: 3, background: 'background.paper' }}>
                <Stack spacing={3}>
                    <TextField fullWidth label="Card Number" variant="outlined" InputProps={{
                        startAdornment: <InputAdornment position="start"><CreditCard size={20} /></InputAdornment>,
                    }}/>
                    <Stack direction="row" spacing={2}>
                        <TextField fullWidth label="Expiration Date (MM/YY)" variant="outlined" InputProps={{
                            startAdornment: <InputAdornment position="start"><CalendarIcon size={20} /></InputAdornment>,
                        }}/>
                        <TextField fullWidth label="Security Code (CVC)" variant="outlined" InputProps={{
                            startAdornment: <InputAdornment position="start"><ShieldCheck size={20} /></InputAdornment>,
                        }}/>
                    </Stack>
                    <FormControl fullWidth>
                        <InputLabel id="country-select-label">Country</InputLabel>
                        <Select
                            labelId="country-select-label"
                            id="country-select"
                            value={country}
                            label="Country"
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            {countries.map((c) => (
                                <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel control={<Checkbox defaultChecked sx={{color: 'primary.main', '&.Mui-checked': {color: 'primary.main'}}}/>} label="Save this card as default payment method" />
                </Stack>
              </Card>
            </Box>
          </Stack>

          {/* Navigation Buttons */}
           <Stack direction="row" justifyContent="space-between" sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="outlined" onClick={onBack} startIcon={<ArrowLeft size={20} />}>
              Back
            </Button>
            <Button variant="contained" onClick={handleCompletePayment} endIcon={<ArrowRight size={20} />} size="large">
              Complete Payment
            </Button>
          </Stack>
        </Container>
      </StepperDemo>

      {/* --- Account Creation Drawer --- */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box
          sx={{ width: { xs: '90vw', sm: 400 }, p: 3, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: 'background.paper', color: 'text.primary' }}
          role="presentation"
        >
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                    Create Account
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    To help you track your order and manage your skip hire, we'll create an account for you.
                </Typography>
            </Box>
            <TextField label="First Name" variant="outlined" fullWidth InputProps={{
                startAdornment: <InputAdornment position="start"><UserCircle size={20} /></InputAdornment>
            }} />
            <TextField label="Last Name" variant="outlined" fullWidth />
            <TextField label="Email Address" type="email" variant="outlined" fullWidth />
            <TextField label="Confirm Email Address" type="email" variant="outlined" fullWidth />
            <TextField label="Phone Number" type="tel" variant="outlined" fullWidth />
          </Stack>

          <Stack spacing={2} sx={{ mt: 'auto', pt: 2 }}>
            <Button variant="contained" endIcon={<ArrowRight size={20} />} onClick={() => alert("Account Created! (Simulation)")}>
                Continue
            </Button>
            <Button variant="text" onClick={() => setIsDrawerOpen(false)}>
                Go Back To Payment
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Payments;