import React from "react";
import ModalCard from "../../../common/components/ModalCard";
import styles from "../../../common/types/cssColor";

type LevelUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose }) => (
  <ModalCard
    isOpen={isOpen}
    onClose={onClose}
    eyebrow="Character Progression"
    title="Level Up"
  >
    <div className={styles.tokens.panel.base}>
      <div className={styles.tokens.text.label}>Placeholder</div>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        This modal is ready for level-up choices, stat upgrades, and progression steps.
      </p>
    </div>

    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClose}
        className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
      >
        Close
      </button>
    </div>
  </ModalCard>
);

export default LevelUpModal;
