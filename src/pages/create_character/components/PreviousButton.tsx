import React from "react";
import styles from "../../../common/types/cssColor";

export type PreviousButtonProps = {
  onBack?: () => void
};

const PreviousButton: React.FC<PreviousButtonProps> = ({onBack}) => <button
                onClick={onBack}
                className={`px-4 py-2 rounded-lg ${styles.gray.bg} ${styles.gray.text} ${styles.gray.bgHover} font-semibold border ${styles.gray.border}`}
              >Previous</button>


export default PreviousButton;