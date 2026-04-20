import React from "react";
import { NextPreviousButton } from "./NextPreviousButtons";
import styles from "../../../common/types/cssColor";
import Eyebrow from "../../../common/components/Eyebrow";
import Section from "../../../common/components/Section";

export type InfoItem = {
  name: string;
  description: string;
};

type InfoCardProps = {
  item: InfoItem;
  onSelect: (info: InfoItem) => void;
  showNext?: boolean;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
};

const InfoCard: React.FC<InfoCardProps> = ({
  item,
  onSelect,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
}) => {
  return (
    <Section
      eyebrow="Character Builder"
      title="Basic Character Details"
      subtitle="Give your character a name and a short visual description to anchor the build."
    >
      <div className="grid gap-5">
        <div className={styles.tokens.panel.base}>
          <div className="mb-3">
            <Eyebrow eyebrow="Identity" />
            <label className={`mt-1 block text-sm font-semibold ${styles.gray.text}`}>
              Character Name
            </label>
          </div>
          <input
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
            placeholder="Name"
            value={item.name}
            onChange={(e) => onSelect({ ...item, name: e.target.value })}
          />
        </div>

        <div className={styles.tokens.panel.base}>
          <div className="mb-3">
            <Eyebrow eyebrow="Presence" />
            <label className={`mt-1 block text-sm font-semibold ${styles.gray.text}`}>
              Physical Description
            </label>
          </div>
          <textarea
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[140px] resize-none`}
            placeholder="Describe appearance, vibe, clothing, scars, posture..."
            value={item.description}
            onChange={(e) => onSelect({ ...item, description: e.target.value })}
          />
        </div>
      </div>

      {(showBack || showNext) && (
        <NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext} />
      )}
    </Section>
  );
};

export default InfoCard;
