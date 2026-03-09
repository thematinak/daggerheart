import React from "react";
import GameCard from "../../../common/components/GameCard";
import { NextPreviousButton } from "./NextButton";

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
    <div className="flex justify-center items-start min-h-screen pt-10 p-4">
      <GameCard hover={false}>
        {/* Header */}
        <h2 className="text-xl font-bold mb-4 text-center">Basic Character Details</h2>

        {/* Name Input */}
        <label className="font-semibold text-gray-700">Enter character name</label>
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Name"
          value={item.name}
          onChange={(e) => onSelect({ ...item, name: e.target.value })}
        />

        {/* Description Textarea */}
        <label className="font-semibold text-gray-700 mt-2">Physical Description</label>
        <textarea
          className="border rounded px-3 py-2 w-full resize-none"
          placeholder="Description"
          value={item.description}
          onChange={(e) => onSelect({ ...item, description: e.target.value })}
        />

        {/* Next / Back Buttons */}
        {(showBack || showNext) && (<NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext} />
        )}
      </GameCard>
    </div>
  );
};

export default InfoCard;