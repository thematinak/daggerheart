import React from "react";
import styles from "../../../common/types/cssColor";

export type NextButtonProps = {
  onNext?: () => void
};

export const NextButton: React.FC<NextButtonProps> = ({onNext}) => <button
                onClick={onNext}
                className={`px-4 py-2 rounded-lg ${styles.green.bg} ${styles.green.text} ${styles.green.bgHover} font-semibold border ${styles.green.border}`}
              >Next</button>

export type PreviousButtonProps = {
  onBack?: () => void
};

export const PreviousButton: React.FC<PreviousButtonProps> = ({onBack}) => <button
                onClick={onBack}
                className={`px-4 py-2 rounded-lg ${styles.gray.bg} ${styles.gray.text} ${styles.gray.bgHover} font-semibold border ${styles.gray.border}`}
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