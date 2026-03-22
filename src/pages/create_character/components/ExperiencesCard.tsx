import React from "react";
import GameCard from "../../../common/components/GameCard";
import { Experience } from "../../../common/types/Experience";

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

        <label className="font-semibold text-gray-700">Name</label>
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

        <label className="font-semibold text-gray-700 mt-2">Description</label>
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

        <label className="font-semibold text-gray-700">Name</label>
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

        <label className="font-semibold text-gray-700 mt-2">Description</label>
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

        {/* Next / Back Buttons */}
        {(showBack || showNext) && (
          <div className="flex justify-between mt-4">
            {showBack ? (
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
              >
                Späť
              </button>
            ) : <div className="w-24" />}

            {showNext ? (
              <button
                onClick={onNext}
                className={`px-4 py-2 rounded-lg font-semibold
                  ${!item.primaryExperience.name || !item.secondaryExperience.name
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-yellow-400 text-white hover:bg-yellow-500"
                  }`}
              >
                Pokračovať
              </button>
            ) : <div className="w-24" />}
          </div>
        )}
      </GameCard>
    </div>
  );
};

export default ExperienceCard;