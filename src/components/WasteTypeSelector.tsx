"use client"

import { useState, type JSX } from "react"
import { motion } from "framer-motion"
import { Construction, Home as HomeIcon, Flower2, Building2, ArrowLeft, ArrowRight, Info, Check } from "lucide-react"
import StepperDemo from "./Stepper-demo"

interface WasteOptionType {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  lightColor: string;
  borderColor: string;
}

interface WasteOptionProps {
  option: WasteOptionType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const wasteOptions: WasteOptionType[] = [
  {
    id: "construction",
    title: "Construction Waste",
    description: "Building materials and renovation debris.",
    icon: <Construction className="h-8 w-8" />,
    color: "bg-amber-500",
    lightColor: "bg-amber-900/30",
    borderColor: "border-amber-500",
  },
  {
    id: "household",
    title: "Household Waste",
    description: "General household items and furniture.",
    icon: <HomeIcon className="h-8 w-8" />,
    color: "bg-sky-500",
    lightColor: "bg-sky-900/30",
    borderColor: "border-sky-500",
  },
  {
    id: "garden",
    title: "Garden Waste",
    description: "Green waste and landscaping materials",
    icon: <Flower2 className="h-8 w-8" />,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-900/30",
    borderColor: "border-emerald-500",
  },
  {
    id: "commercial",
    title: "Commercial Waste",
    description: "Business and office clearance",
    icon: <Building2 className="h-8 w-8" />,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-900/30",
    borderColor: "border-indigo-500",
  },
]

const WasteOption = ({ option, isSelected, onSelect }: WasteOptionProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl bg-slate-800 border ${
      isSelected ? `${option.borderColor} border-2 shadow-lg` : "border-slate-700 hover:border-slate-600"
    }`}
    onClick={() => onSelect(option.id)}
  >
    <div className="flex p-5">
      <div className={`flex-shrink-0 p-3 rounded-full ${option.lightColor} mr-4 border border-slate-600`}>
        <div className={`p-2 rounded-full ${option.color} text-white`}>{option.icon}</div>
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold mb-1 text-slate-100">{option.title}</h3>
        <p className="text-slate-400 text-sm">{option.description}</p>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full shadow-md"
        >
          <Check className="h-4 w-4" />
        </motion.div>
      )}
    </div>
  </motion.div>
)

interface WasteTypeSelectorProps {
  onBack: () => void;
  onContinue: () => void;
}

const WasteTypeSelector = ({ onBack, onContinue }: WasteTypeSelectorProps) => {
  const [selectedWastes, setSelectedWastes] = useState<string[]>(["garden"])

  const handleSelect = (wasteId: string) => {
    setSelectedWastes((prev) => (prev.includes(wasteId) ? prev.filter((id) => id !== wasteId) : [...prev, wasteId])
  )}

  const getSelectedWasteTitles = () => {
    if (selectedWastes.length === 0) return "None"
    return selectedWastes.map((id) => wasteOptions.find((opt) => opt.id === id)?.title).join(", ")
  }

  return (
    <StepperDemo currentStep="Waste Type">
      <>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-slate-100"
        >
          What type of waste are you disposing of?
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cyan-900/20 border-l-4 border-cyan-500 p-4 rounded-md mb-8 flex items-center backdrop-blur-sm"
        >
          <Info className="h-5 w-5 text-cyan-400 mr-3 flex-shrink-0" />
          <span className="text-cyan-300">Select all that apply</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {wasteOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <WasteOption 
                option={option} 
                isSelected={selectedWastes.includes(option.id)} 
                onSelect={handleSelect} 
              />
            </motion.div>
          ))}
        </div>
        
        <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-900 border-t border-slate-800 py-4 px-4 md:px-8 shadow-lg"
      >
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <div className="text-sm font-medium text-slate-400 mb-1">Selected Waste Types</div>
            <div className="font-semibold text-slate-200">{getSelectedWasteTitles()}</div>
          </div>
          <div className="flex space-x-4">
            <button
            onClick={onBack}
            className="flex items-center px-5 py-2 border border-slate-600 rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors duration-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <button
            onClick={onContinue} 
            className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 shadow-md">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </motion.footer>
      </>
    </StepperDemo>
  )
}

export default WasteTypeSelector