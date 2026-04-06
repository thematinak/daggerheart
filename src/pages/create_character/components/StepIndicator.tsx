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
    <div className="mb-4 flex w-full flex-col items-center">
      {/* Progress bar */}
      <div className={`${styles.tokens.stepIndicator.bar} mb-3`}>
        <div
          className={styles.tokens.stepIndicator.progress}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps */}
      <div className="grid w-full grid-cols-11 gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          const stepClasses = isActive
            ? styles.tokens.stepIndicator.active
            : isCompleted
            ? `${styles.tokens.stepIndicator.completed} cursor-pointer`
            : styles.tokens.stepIndicator.upcoming;

          return (
            <div
              key={index}
              className="flex min-w-0 flex-col items-center text-center"
              onClick={isCompleted ? () => onStepSelect(index) : undefined}
            >
              <div className={`${styles.tokens.stepIndicator.stepBase} h-8 w-8 rounded-xl text-xs sm:h-9 sm:w-9 sm:text-sm ${stepClasses}`}>
                {index + 1}
              </div>
              <span className={`mt-1 break-words text-[10px] leading-3 sm:text-[11px] ${styles.semantic.muted.text}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
