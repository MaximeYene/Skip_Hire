import React, { useState, useMemo } from 'react';
import StepperDemo from './Stepper-demo';

// --- Helper Components & Types ---

type CalendarProps = {
  // Le mois actuellement affiché dans le calendrier (ex: new Date('2025-06-01'))
  displayMonth: Date;
  // La date actuellement sélectionnée, pour la surligner
  selectedDate: Date | null;
  // La date minimale sélectionnable (pour empêcher de choisir dans le passé)
  minDate?: Date;
  // Callback pour changer le mois affiché
  onMonthChange: (newMonth: Date) => void;
  // Callback quand une date est choisie
  onDateSelect: (date: Date) => void;
};

interface chooseDateProps {
  onBack: () => void;
  onContinue?: () => void;
}

// Un composant réutilisable pour le calendrier
const Calendar: React.FC<CalendarProps> = ({ displayMonth, selectedDate, minDate, onMonthChange, onDateSelect }) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthData = useMemo(() => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 pour Dimanche, 1 pour Lundi, etc.

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
    onMonthChange(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
  };

  const isSameDay = (date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  return (
    // MODIFICATION: Fond de la carte, bordure et ombre adaptés au thème sombre
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 w-full max-w-sm mx-auto">
      {/* Header du calendrier */}
      <div className="flex justify-between items-center mb-4">
         {/* MODIFICATION: Style des boutons de navigation du mois */}
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          ← {/* Left Arrow */}
        </button>
        {/* MODIFICATION: Couleur du texte */}
        <span className="text-lg font-semibold text-slate-200">
          {displayMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          → {/* Right Arrow */}
        </button>
      </div>

      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* MODIFICATION: Couleur du texte des jours de la semaine */}
        {daysOfWeek.map(day => (
          <div key={day} className="font-medium text-xs text-slate-400">{day}</div>
        ))}
        {monthData.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }
          const isSelected = isSameDay(date, selectedDate);
          const isPast = minDate ? date < minDate && !isSameDay(date, minDate) : false;
          
          // MODIFICATION: Classes des boutons de date pour le thème sombre
          const buttonClasses = `
            w-10 h-10 flex items-center justify-center rounded-full transition-colors
            ${isPast ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-slate-700'}
            ${isSelected ? 'bg-indigo-500 text-white font-bold' : 'text-slate-300'}
          `;

          return (
            <button
              key={date.toISOString()}
              disabled={isPast}
              onClick={() => !isPast && onDateSelect(date)}
              className={buttonClasses}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};


// --- Composant Principal ---

const ChooseDate = ({ onBack }: chooseDateProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalise à minuit pour les comparaisons

  const [deliveryDate, setDeliveryDate] = useState<Date>(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  });
  
  const [collectionDate, setCollectionDate] = useState<Date>(() => {
    const initialCollection = new Date(deliveryDate);
    initialCollection.setDate(deliveryDate.getDate() + 7);
    return initialCollection;
  });

  const [displayDeliveryMonth, setDisplayDeliveryMonth] = useState(deliveryDate);
  const [displayCollectionMonth, setDisplayCollectionMonth] = useState(collectionDate);
  const [isCollectionCalendarVisible, setCollectionCalendarVisible] = useState(false);

  const handleSelectDeliveryDate = (date: Date) => {
    setDeliveryDate(date);
    const newCollectionDate = new Date(date);
    newCollectionDate.setDate(date.getDate() + 7);
    setCollectionDate(newCollectionDate);
    setDisplayCollectionMonth(newCollectionDate);
  };
  
  const handleSelectCollectionDate = (date: Date) => {
    setCollectionDate(date);
  };
  
  const formatFullDate = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    // MODIFICATION: Fond général et couleur de texte par défaut pour le thème sombre
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <StepperDemo currentStep="Choose Date">
        {/* MODIFICATION: Fond de la carte principale et ombre adaptée */}
        <div className="max-w-2xl mx-auto bg-slate-800 rounded-xl shadow-lg p-6 sm:p-8 space-y-8">
        
        <div>
          {/* MODIFICATION: Couleurs du titre et du paragraphe */}
          <h1 className="text-3xl font-bold text-slate-100">Choose Your Delivery Date</h1>
          <p className="mt-2 text-slate-400">
            Select your preferred skip delivery date. We'll aim to deliver between 7am and 6pm on your chosen day.
          </p>
        </div>

        <div className="space-y-4">
          {/* MODIFICATION: Couleur du sous-titre */}
          <h2 className="text-xl font-semibold text-slate-200">Delivery Date</h2>
          <Calendar
            displayMonth={displayDeliveryMonth}
            onMonthChange={setDisplayDeliveryMonth}
            selectedDate={deliveryDate}
            onDateSelect={handleSelectDeliveryDate}
            minDate={today}
          />
        </div>

        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-200">Collection Date</h2>
            {/* MODIFICATION: Bordure et fond de la zone de date de collecte */}
            <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg bg-slate-900/50">
                <div>
                    {/* MODIFICATION: Couleur du texte pour la date et le bouton "Change" */}
                    <p className="font-semibold text-indigo-400">{formatFullDate(collectionDate)}</p>
                    <p className="text-sm text-slate-400 mt-1">We'll collect your skip on this date. Please ensure it's accessible.</p>
                </div>
                <button
                    onClick={() => setCollectionCalendarVisible(!isCollectionCalendarVisible)}
                    className="text-indigo-400 font-semibold hover:underline focus:outline-none"
                >
                    {isCollectionCalendarVisible ? 'Hide' : 'Change'}
                </button>
            </div>
          
            {isCollectionCalendarVisible && (
              <Calendar
                displayMonth={displayCollectionMonth}
                onMonthChange={setDisplayCollectionMonth}
                selectedDate={collectionDate}
                onDateSelect={handleSelectCollectionDate}
                minDate={deliveryDate}
              />
            )}
        </div>

        {/* MODIFICATION: Style des boutons de navigation et de la bordure */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-700">
          <button
           onClick={onBack}
           className="text-slate-300 font-semibold px-4 py-2 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500">
            Back
          </button>
          {/* MODIFICATION: Bouton principal utilise la couleur primaire 'indigo' */}
          <button className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500">
            Continue to Payment
          </button>
        </div>
      </div>
      </StepperDemo>
    </div>
  );
};

export default ChooseDate;