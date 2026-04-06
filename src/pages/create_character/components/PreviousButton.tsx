import React from "react";
import styles from "../../../common/types/cssColor";

export type PreviousButtonProps = {
  onBack?: () => void
};

const PreviousButton: React.FC<PreviousButtonProps> = ({onBack}) => (
  <button onClick={onBack} className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}>
    Previous
  </button>
)


export default PreviousButton;