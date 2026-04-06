import React from "react";
import styles from "../../../common/types/cssColor";

export type NextButtonProps = {
  onNext?: () => void
};

export const NextButton: React.FC<NextButtonProps> = ({onNext}) => (
  <button onClick={onNext} className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}>
    Next
  </button>
)

export type PreviousButtonProps = {
  onBack?: () => void
};

export const PreviousButton: React.FC<PreviousButtonProps> = ({onBack}) => (
  <button onClick={onBack} className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}>
    Previous
  </button>
)

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