import Stepper from "./Stepper"
import { motion } from "framer-motion"

interface StepperDemoProps {
  currentStep: string;
  children?: React.ReactNode;
}

const StepperDemo = ({ currentStep, children }: StepperDemoProps) => {
  const steps = ["Postcode", "Waste Type", "Select Skip", "Permit Check", "Choose Date", "Payment"]

  return (
    <div className="min-h-screen bg-slate-950">
      <Stepper steps={steps} currentStep={currentStep} />

      <div className="max-w-6xl mx-auto p-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-4 mb-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}

export default StepperDemo