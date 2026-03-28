import React from "react";

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
      <div className="relative w-full h-2 bg-gray-300 rounded-full mb-4">
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

          return (
            <div key={index} className="flex flex-col items-center text-center w-24" onClick={isCompleted ? () => onStepSelect(index) : undefined}>
              {/* Štvorcový krok */}
              <div
                className={`w-10 h-10 flex items-center justify-center font-semibold rounded-md border-2
                  ${isActive ? 'bg-yellow-400 border-yellow-400 text-white' : ''}
                  ${isCompleted && !isActive ? 'border-green-700 bg-green-100 text-green-700 cursor-pointer' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-100 border-gray-300 text-gray-500' : ''}
                `}
              >
                {index + 1}
              </div>
              {/* Názov kroku */}
              <span className="text-xs mt-1">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;