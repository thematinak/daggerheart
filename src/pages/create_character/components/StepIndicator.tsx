import React from "react";
import styles from "../../../common/types/cssColor";

type StepIndicatorProps = {
  steps: string[];       // Názvy krokov
  onStepSelect: (stepIndex: number) => void;
  currentStep: number;   // index aktuálneho kroku (0-based)
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep, onStepSelect }) => {
  const progressPercent = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="w-full flex flex-col items-center mb-6">
      {/* Progress bar */}
      <div className={`${styles.tokens.stepIndicator.bar} ${styles.semantic.muted.bg} mb-4`}>
        <div
          className="h-2 bg-green-700 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between w-full max-w-4xl">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          const stepClasses = isActive
            ? styles.tokens.stepIndicator.active
            : isCompleted
            ? `${styles.tokens.stepIndicator.completed} cursor-pointer`
            : styles.tokens.stepIndicator.upcoming;

          return (
            <div key={index} className="flex flex-col items-center text-center w-24" onClick={isCompleted ? () => onStepSelect(index) : undefined}>
              <div className={`${styles.tokens.stepIndicator.stepBase} ${stepClasses}`}>
                {index + 1}
              </div>
              <span className={`text-xs mt-1 ${styles.semantic.muted.text}`}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;