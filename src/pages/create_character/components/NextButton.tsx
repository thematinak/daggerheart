import React from "react";

export type NextButtonProps = {
  onNext?: () => void
};

export const NextButton: React.FC<NextButtonProps> = ({onNext}) => <button
                onClick={onNext}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-white hover:bg-yellow-500 font-semibold"
              >Next</button>

export type PreviousButtonProps = {
  onBack?: () => void
};

export const PreviousButton: React.FC<PreviousButtonProps> = ({onBack}) => <button
                onClick={onBack}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
              >Previous</button>

export type NextPreviousProps = {
  onNext?: () => void;
  onBack?: () => void;
  showBack?: boolean;
  showNext?: boolean;
};

export const NextPreviousButton: React.FC<NextPreviousProps> = ({onNext, showNext, onBack, showBack}) => 
          <div className="flex justify-between mt-4">
            {showBack ? <PreviousButton onBack={onBack} />: <div className="w-24" />}
            {showNext ? <NextButton onNext={onNext} /> : <div className="w-24" />}
        </div>