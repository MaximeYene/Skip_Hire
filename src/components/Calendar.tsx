
import React, { useMemo } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Card,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";

type CalendarProps = {
  displayMonth: Date;
  selectedDate: Date | null;
  minDate?: Date;
  onMonthChange: (newMonth: Date) => void;
  onDateSelect: (date: Date) => void;
  title?: string;
};

export const Calendar: React.FC<CalendarProps> = ({
  displayMonth,
  selectedDate,
  minDate,
  onMonthChange,
  onDateSelect,
  title,
}) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const monthData = useMemo(() => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    const dates = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      dates.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    return dates;
  }, [displayMonth]);

  const handlePrevMonth = () => {
    onMonthChange(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    onMonthChange(
      new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1)
    );
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  return (
    <Card sx={{ p: { xs: 2, sm: 3 }, maxWidth: 400, mx: "auto" }}>
      {title && (
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CalendarIcon size={20} />
          {title}
        </Typography>
      )}

      {/* Calendar Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeft size={20} />
        </IconButton>
        
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            textTransform: "capitalize",
          }}
        >
          {displayMonth.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Typography>
        
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight size={20} />
        </IconButton>
      </Box>

      {/* Day Grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {/* Weekday Headers */}
        {daysOfWeek.map((day) => (
          <div key={day} className="flex justify-center">
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                textAlign: "center",
                py: 1,
                width: "100%",
              }}
            >
              {day}
            </Typography>
          </div>
        ))}
        
        {/* Month Dates */}
        {monthData.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }
          
          const isSelected = isSameDay(date, selectedDate);
          const isPast = minDate ? date < minDate && !isSameDay(date, minDate) : false;
          const todayDate = isToday(date);
          
          // --- MODIFICATION HERE ---
          // Check if the date is a Saturday (6) or a Sunday (0)
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isDisabled = isPast || isWeekend;

          return (
            <div key={date.toISOString()} className="flex justify-center">
              <Button
                disabled={isDisabled}
                onClick={() => !isDisabled && onDateSelect(date)}
                sx={{
                  minWidth: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                  borderRadius: "50%",
                  p: 0,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  fontWeight: isSelected ? 700 : todayDate ? 600 : 400,
                  // --- MODIFICATION HERE ---
                  // Apply the disabled style if it's in the past OR a weekend
                  color: isDisabled 
                    ? "text.disabled" 
                    : isSelected 
                    ? "primary.contrastText" 
                    : todayDate 
                    ? "primary.main" 
                    : "text.primary",
                  backgroundColor: isSelected 
                    ? "primary.main" 
                    : todayDate 
                    ? "rgba(99, 102, 241, 0.1)" 
                    : "transparent",
                  border: todayDate && !isSelected ? "1px solid" : "none",
                  borderColor: "primary.main",
                  "&:hover": {
                    // --- MODIFICATION HERE ---
                    // No hover effect if disabled.
                    backgroundColor: isSelected 
                      ? "primary.dark" 
                      : isDisabled 
                      ? "transparent" 
                      : "rgba(99, 102, 241, 0.1)",
                  },
                  "&:disabled": {
                    color: "text.disabled",
                  },
                }}
              >
                {date.getDate()}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};