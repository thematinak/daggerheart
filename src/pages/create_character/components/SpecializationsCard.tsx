import React from "react";
import GameCard from "../../../common/components/GameCard";

export type SpecialModifications = {
  id: string;
  name: string;
  description: string;
};

export type SpecializationsItem = {
  id: string;
  name: string;
  description: string;
  modifications: SpecialModifications[];
};

type SpecializationsCardProps = {
  item: SpecializationsItem;
  selected?: boolean;
  onClick?: () => void;
};

const SpecializationsCard: React.FC<SpecializationsCardProps> = ({
  item,
  selected,
  onClick,
}) => (
  <GameCard selected={!!selected} onClick={onClick}>
    {/* Header */}
    <h3 className="text-lg font-bold">{item.name}</h3>

    {/* Description */}
    <p className="text-sm text-gray-600">{item.description}</p>

    {/* Modifications */}
    {item.modifications.length > 0 && (
      <div className="space-y-2 mt-2">
        {item.modifications.map((mod) => (
          <div
            key={mod.id}
            className="p-2 rounded-lg bg-gray-100"
          >
            <div className="font-semibold text-sm">{mod.name}</div>
            <div className="text-xs text-gray-600">{mod.description}</div>
          </div>
        ))}
      </div>
    )}
  </GameCard>
);

export default SpecializationsCard;