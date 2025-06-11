import type { JSX } from "react";
import { Construction, Home as HomeIcon, Flower2, Building2, Check } from "lucide-react"
import { motion } from "framer-motion"



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

interface HeavyWasteOption {
  id: string;
  name: string;
}

export const wasteOptions: WasteOptionType[] = [
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

export const heavyWasteOptions: HeavyWasteOption[] = [
  { id: "soil", name: "Soil" },
  { id: "concrete", name: "Concrete" },
  { id: "bricks", name: "Bricks" },
  { id: "tiles", name: "Tiles" },
  { id: "sand", name: "Sand" },
  { id: "gravel", name: "Gravel" },
  { id: "rubble", name: "Rubble" },
]

export const WasteOption = ({ option, isSelected, onSelect }: WasteOptionProps) => (
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