"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Info, Check, X, AlertTriangle, Percent, Package } from "lucide-react"
import { Drawer } from "@mui/material"
import StepperDemo from "./Stepper-demo"
import { heavyWasteOptions, WasteOption, wasteOptions } from "./WasteOption"

// --- Helper Data for Plasterboard Percentage Options ---
const plasterboardPercentageOptions = [
  {
    id: "plasterboard_under_5",
    title: "Under 5%",
    icon: <Percent className="h-4 w-4 text-emerald-400" />,
    infoTitle: "No Tonne Bag Required",
    infoText:
      "For small amounts of plasterboard (under 5%). You need to have your own bag to separate plasterboard from other waste in the skip.",
    importantInfo:
      "Plasterboard has to be disposed of separately and cannot be mixed with the other waste. Failing to do this could result in additional charges.",
  },
  {
    id: "plasterboard_5_10",
    title: "5-10%",
    icon: <Percent className="h-4 w-4 text-amber-400" />,
    infoTitle: "1 Tonne Bag Required",
    infoText: "For moderate amounts of plasterboard (5% to 10%). 1x Tonne Bags included for proper waste segregation.",
    importantInfo:
      "Plasterboard has to be disposed of separately and cannot be mixed with the other waste. Failing to do this could result in additional charges.",
  },
  {
    id: "plasterboard_over_10",
    title: "Over 10%",
    icon: <Percent className="h-4 w-4 text-rose-400" />,
    infoTitle: "Plasterboard-Only Skip Required",
    infoText: "For large amounts of plasterboard (over 10%).",
    importantInfo:
      "You are only allowed to put plasterboard in this skip. If you have other waste, please contact us so we can provide the best solution.",
  },
]

interface WasteTypeSelectorProps {
  onBack: () => void
  // onContinue now can receive heavy wastes OR plasterboard details
  onContinue: (wastes: string[]) => void
}

const WasteTypeSelector = ({ onBack, onContinue }: WasteTypeSelectorProps) => {
  const [selectedWastes, setSelectedWastes] = useState<string[]>(["garden"])
  const [showHeavyWasteDialog, setShowHeavyWasteDialog] = useState(false)

  // --- Drawer State Management ---
  type DrawerStep = "heavyWaste" | "plasterboardQuestion" | "plasterboardPercentage"
  const [drawerStep, setDrawerStep] = useState<DrawerStep>("heavyWaste")
  const [selectedHeavyWastes, setSelectedHeavyWastes] = useState<string[]>([])
  const [plasterboardSelection, setPlasterboardSelection] = useState<"yes" | "no" | null>(null)
  const [plasterboardPercentage, setPlasterboardPercentage] = useState<string | null>(null)

  const handleSelect = (wasteId: string) => {
    setSelectedWastes((prev) => (prev.includes(wasteId) ? prev.filter((id) => id !== wasteId) : [...prev, wasteId]))
  }

  const handleHeavyWasteSelect = (wasteId: string) => {
    setSelectedHeavyWastes((prev) =>
      prev.includes(wasteId) ? prev.filter((id) => id !== wasteId) : [...prev, wasteId],
    )
  }

  const handleContinueClick = () => {
    // Reset drawer state every time it opens
    setDrawerStep("heavyWaste")
    setSelectedHeavyWastes([])
    setPlasterboardSelection(null)
    setPlasterboardPercentage(null)
    setShowHeavyWasteDialog(true)
  }

  const closeDrawer = () => {
    setShowHeavyWasteDialog(false)
  }

  const handleSubmitHeavyWaste = () => {
    onContinue(selectedHeavyWastes)
    closeDrawer()
  }

  const handleNoHeavyWaste = () => {
    setDrawerStep("plasterboardQuestion")
    setPlasterboardSelection(null) // Reset selection when moving to this step
  }

  const handleContinueFromPlasterboardQuestion = () => {
    if (plasterboardSelection === "yes") {
      setDrawerStep("plasterboardPercentage")
    } else {
      // "no" is selected
      onContinue([]) // No heavy waste, no plasterboard
      closeDrawer()
    }
  }

  const handleFinalContinue = () => {
    if (plasterboardPercentage) {
      onContinue([plasterboardPercentage]) // Pass the specific plasterboard ID
      closeDrawer()
    }
  }

  const getSelectedWasteTitles = () => {
    if (selectedWastes.length === 0) return "None"
    return selectedWastes.map((id) => wasteOptions.find((opt) => opt.id === id)?.title).join(", ")
  }

  const selectedPercentageDetails = plasterboardPercentageOptions.find((opt) => opt.id === plasterboardPercentage)

  // --- Reusable Component for Selectable Options in Drawer ---
  const DrawerOption = ({
    id,
    title,
    isSelected,
    onSelect,
    icon,
  }: { id: string; title: string; isSelected: boolean; onSelect: (id: string) => void; icon?: React.ReactNode }) => (
    <div
      onClick={() => onSelect(id)}
      className={`flex items-center p-3 rounded-lg cursor-pointer border transition-colors ${
        isSelected ? "bg-emerald-900/30 border-emerald-500" : "bg-slate-700/50 border-slate-600 hover:bg-slate-700"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-md mr-3 flex items-center justify-center transition-colors ${
          isSelected ? "bg-emerald-500" : "bg-slate-600 border border-slate-500"
        }`}
      >
        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
      </div>
      <span className="text-slate-200">{title}</span>
      {icon && <span className="ml-auto">{icon}</span>}
    </div>
  )

  return (
    <>
      <StepperDemo currentStep="Waste Type">
        {/* ... Main page content remains the same ... */}
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
                <WasteOption option={option} isSelected={selectedWastes.includes(option.id)} onSelect={handleSelect} />
              </motion.div>
            ))}
          </div>

          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-slate-900 border-t border-slate-800 py-4 px-4 md:px-8 shadow-lg fixed bottom-0 left-0 right-0"
          >
            <div className="container mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0 text-center md:text-left">
                <div className="text-sm font-medium text-slate-400 mb-1">Selected Waste Types</div>
                <div className="font-semibold text-slate-200">{getSelectedWasteTitles()}</div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={onBack}
                  className="flex items-center px-5 py-2 border border-slate-600 rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleContinueClick}
                  className="flex items-center px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200 shadow-md"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </motion.footer>
        </>
      </StepperDemo>

      {/* --- Refactored Drawer with multiple steps --- */}
      <Drawer
        anchor="left"
        open={showHeavyWasteDialog}
        onClose={closeDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: "450px", // Slightly wider for better content display
            maxWidth: "95vw",
            backgroundColor: "#1e293b", // slate-800
            color: "#e2e8f0", // slate-200
            borderRight: "1px solid #334155", // slate-700
          },
        }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Close button common to all steps */}
          <div className="absolute top-4 right-4">
            <button
              onClick={closeDrawer}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-full hover:bg-slate-700/50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Step 1: Heavy Waste Selection */}
          {drawerStep === "heavyWaste" && (
            <>
              <h3 className="text-xl font-bold text-slate-100 mb-2 pr-8">Do You Have Any Heavy Waste Types?</h3>
              <p className="text-slate-300 mb-6">Select All That Apply</p>

              <div className="space-y-3 mb-6 flex-1 overflow-y-auto pr-2">
                {heavyWasteOptions.map((option) => (
                  <DrawerOption
                    key={option.id}
                    id={option.id}
                    title={option.name}
                    isSelected={selectedHeavyWastes.includes(option.id)}
                    onSelect={handleHeavyWasteSelect}
                  />
                ))}
              </div>

              <div className="flex flex-col space-y-3 pt-4 border-t border-slate-700">
                <button
                  onClick={handleSubmitHeavyWaste}
                  disabled={selectedHeavyWastes.length === 0}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-lg transition-colors duration-200 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Selection
                </button>
                <button
                  onClick={handleNoHeavyWaste}
                  className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />I Don't Have Any
                </button>
              </div>
            </>
          )}

          {/* Step 2: Plasterboard Yes/No Question */}
          {drawerStep === "plasterboardQuestion" && (
            <>
              <h3 className="text-xl font-bold text-slate-100 mb-2 pr-8">Do You Have Any Plasterboard?</h3>
              <p className="text-slate-300 mb-6">Please select one option.</p>

              <div className="space-y-3 mb-6 flex-1">
                <DrawerOption
                  id="yes"
                  title="Yes"
                  isSelected={plasterboardSelection === "yes"}
                  onSelect={() => setPlasterboardSelection("yes")}
                  icon={<Package className="h-4 w-4 text-emerald-400" />}
                />
                <DrawerOption
                  id="no"
                  title="No"
                  isSelected={plasterboardSelection === "no"}
                  onSelect={() => setPlasterboardSelection("no")}
                  icon={<X className="h-4 w-4 text-slate-400" />}
                />
              </div>

              <div className="flex space-x-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setDrawerStep("heavyWaste")}
                  className="flex-1 py-2.5 border border-slate-600 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <span className="flex items-center justify-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </span>
                </button>
                <button
                  onClick={handleContinueFromPlasterboardQuestion}
                  disabled={!plasterboardSelection}
                  className="flex-1 py-2.5 rounded-lg transition-colors text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </span>
                </button>
              </div>
            </>
          )}

          {/* Step 3: Plasterboard Percentage Selection */}
          {drawerStep === "plasterboardPercentage" && (
            <>
              <h3 className="text-xl font-bold text-slate-100 mb-2 pr-8">
                What percentage of plasterboard would fill your skip?
              </h3>
              <p className="text-slate-300 mb-6">Select one option.</p>

              <div className="space-y-3 mb-6 flex-1 overflow-y-auto pr-2">
                {plasterboardPercentageOptions.map((option) => (
                  <DrawerOption
                    key={option.id}
                    id={option.id}
                    title={option.title}
                    isSelected={plasterboardPercentage === option.id}
                    onSelect={(id) => setPlasterboardPercentage(id)}
                    icon={option.icon}
                  />
                ))}

                {/* --- Dynamic Information Box --- */}
                <motion.div
                  key={plasterboardPercentage}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: selectedPercentageDetails ? 1 : 0,
                    height: selectedPercentageDetails ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mt-6 overflow-hidden"
                >
                  {selectedPercentageDetails && (
                    <div className="bg-slate-800/70 p-4 rounded-lg border border-slate-700">
                      <h4 className="font-semibold text-emerald-400 mb-2 flex items-center">
                        {selectedPercentageDetails.icon}
                        <span className="ml-2">{selectedPercentageDetails.infoTitle}</span>
                      </h4>
                      <p className="text-slate-300 text-sm mb-3">{selectedPercentageDetails.infoText}</p>
                      <div className="border-t border-slate-600 pt-3">
                        <h5 className="font-semibold text-amber-400 text-sm mb-1 flex items-center">
                          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
                          Important information
                        </h5>
                        <p className="text-amber-200/80 text-xs">{selectedPercentageDetails.importantInfo}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-slate-700">
                <button
                  onClick={() => setDrawerStep("plasterboardQuestion")}
                  className="flex-1 py-2.5 border border-slate-600 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <span className="flex items-center justify-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </span>
                </button>
                <button
                  onClick={handleFinalContinue}
                  disabled={!plasterboardPercentage}
                  className="flex-1 py-2.5 rounded-lg transition-colors text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </Drawer>
    </>
  )
}

export default WasteTypeSelector
