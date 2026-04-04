import React from "react";
import GameCard from "../../../common/components/GameCard";
import { Experience } from "../../../common/types/Experience";
import { NextPreviousButton } from "./NextButton";
import styles from "../../../common/types/cssColor";

export type ExperienceItem = {
  primaryExperience: Experience;
  secondaryExperience: Experience;
};

type ExperienceCardProps = {
  item: ExperienceItem;
  onSelect: (info: ExperienceItem) => void;
  showNext?: boolean;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  item,
  onSelect,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
}) => {
  return (
    <div className="flex justify-center items-start min-h-screen pt-10 p-4">
      <GameCard hover={false}>
        {/* Primary Experience */}
        <h2 className="text-xl font-bold mb-4 text-center">Primary Experience</h2>

        <label className={`font-semibold ${styles.gray.text}`}>Name</label>
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Name"
          value={item.primaryExperience.name}
          onChange={(e) =>
            onSelect({
              ...item,
              primaryExperience: { ...item.primaryExperience, name: e.target.value },
            })
          }
        />

        <label className={`font-semibold ${styles.gray.text} mt-2`}>Description</label>
        <textarea
          className="border rounded px-3 py-2 w-full resize-none"
          placeholder="Description"
          value={item.primaryExperience.description}
          onChange={(e) =>
            onSelect({
              ...item,
              primaryExperience: { ...item.primaryExperience, description: e.target.value },
            })
          }
        />

        {/* Secondary Experience */}
        <h2 className="text-xl font-bold mt-4 mb-2 text-center">Secondary Experience</h2>

        <label className={`font-semibold ${styles.gray.text}`}>Name</label>
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Name"
          value={item.secondaryExperience.name}
          onChange={(e) =>
            onSelect({
              ...item,
              secondaryExperience: { ...item.secondaryExperience, name: e.target.value },
            })
          }
        />

        <label className={`font-semibold ${styles.gray.text} mt-2`}>Description</label>
        <textarea
          className="border rounded px-3 py-2 w-full resize-none"
          placeholder="Description"
          value={item.secondaryExperience.description}
          onChange={(e) =>
            onSelect({
              ...item,
              secondaryExperience: { ...item.secondaryExperience, description: e.target.value },
            })
          }
        />

        {/* NAVIGATION */}
        {(showBack || showNext) && (
          <NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext} />
        )}
      </GameCard>
    </div>
  );
};

export default ExperienceCard;