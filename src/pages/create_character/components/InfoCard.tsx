import React from "react";
import { NextPreviousButton } from "./NextButton";
import styles from "../../../common/types/cssColor";
import Eyebrow from "../../../common/components/Eyebrow";
import H2 from "../../../common/components/H2";

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
    <div className={`${styles.tokens.page.section} flex flex-col gap-6 p-5 sm:p-6 lg:p-8`}>
      <div className="text-center">
        <Eyebrow eyebrow="Character Builder" />
        <H2>Basic Character Details</H2>
        <p className={styles.tokens.page.subtitle}>
          Give your character a name and a short visual description to anchor the build.
        </p>
      </div>

      <div className="grid gap-5">
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm">
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

        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm">
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
    </div>
  );
};

export default InfoCard;
