"use client"

import { motion } from "framer-motion"
import { MapPin, Trash2, Truck, FileCheck, Calendar, CreditCard, Check } from "lucide-react"
import type { JSX } from "react";

// Icônes Lucide pour chaque étape
const StepIcon = ({ type, status }: { type: string; status: string }) => {
  const iconProps = {
    className: "h-5 w-5",
    strokeWidth: 2,
  }

  const icons: Record<string, JSX.Element> = {
    Postcode: <MapPin {...iconProps} />,
    "Waste Type": <Trash2 {...iconProps} />,
    "Select Skip": <Truck {...iconProps} />,
    "Permit Check": <FileCheck {...iconProps} />,
    "Choose Date": <Calendar {...iconProps} />,
    Payment: <CreditCard {...iconProps} />,
  }

  const getIconStyles = () => {
    switch (status) {
      case "completed":
        return "bg-emerald-600 text-emerald-50 border-emerald-500"
      case "active":
        return "bg-cyan-600 text-cyan-50 border-cyan-500"
      default:
        return "bg-slate-800 text-slate-400 border-slate-700"
    }
  }

  return (
    <div
      className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${getIconStyles()}`}
    >
      {status === "completed" ? <Check className="h-5 w-5" strokeWidth={3} /> : icons[type]}
    </div>
  )
}

const Stepper = ({ steps, currentStep }: { steps: string[]; currentStep: string }) => {
  const currentStepIndex = steps.indexOf(currentStep)

  return (
    <div className="w-full bg-slate-900 py-6 px-4 shadow-md border-b border-slate-800">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center justify-between relative">
          {/* Ligne de progression */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-700 -z-10">
            <motion.div
              className="h-full bg-cyan-600 transition-all duration-500 ease-out"
              initial={{ width: "0%" }}
              animate={{
                width: currentStepIndex > 0 ? `${(currentStepIndex / (steps.length - 1)) * 100}%` : "0%",
              }}
            />
          </div>

          {steps.map((step, index) => {
            let status = "inactive"
            if (index < currentStepIndex) {
              status = "completed"
            } else if (index === currentStepIndex) {
              status = "active"
            }

            return (
              <motion.div
                key={step}
                className="flex flex-col items-center relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mb-2">
                  <StepIcon type={step} status={status} />
                </motion.div>

                <span
                  className={`text-xs font-medium text-center max-w-20 leading-tight transition-colors duration-300 ${
                    status === "active"
                      ? "text-cyan-400"
                      : status === "completed"
                        ? "text-emerald-400"
                        : "text-slate-400"
                  }`}
                >
                  {step}
                </span>

                {/* Indicateur de statut */}
                {status === "active" && (
                  <motion.div
                    className="absolute -bottom-1 w-2 h-2 bg-cyan-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  />
                )}
              </motion.div>
            )
          })}
        </nav>

        {/* Informations sur l'étape actuelle */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <h2 className="text-lg font-semibold text-slate-200 mb-1">
            Step {currentStepIndex + 1} of {steps.length}
          </h2>
          <p className="text-sm text-slate-400">{getStepDescription(currentStep)}</p>
        </motion.div>
      </div>
    </div>
  )
}

// Fonction helper pour obtenir la description de chaque étape
const getStepDescription = (step: string): string => {
  const descriptions: Record<string, string> = {
    Postcode: "Enter your delivery location",
    "Waste Type": "",
    "Select Skip": "Choose the right skip size for your needs",
    "Permit Check": "We'll check if you need a permit for your location",
    "Choose Date": "Pick your preferred delivery and collection dates",
    Payment: "Complete your booking with secure payment",
  }
  return descriptions[step] || ""
}

export default Stepper
