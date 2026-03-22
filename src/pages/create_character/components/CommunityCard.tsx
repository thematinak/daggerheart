import React from "react";
import GameCard from "../../../common/components/GameCard"; 
import { Badge } from "../../../common/components/Badge";
import { CommunityItem } from "../../../common/types/Community";


type CommunityCardProps = {
  item: CommunityItem;
  selected?: boolean;
  onClick?: () => void;
};

const CommunityCard: React.FC<CommunityCardProps> = ({
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
    <div className="p-2 rounded-lg bg-gray-100 my-2">
      <div className="font-semibold text-sm">{item.modifications.name}</div>
      <div className="text-xs text-gray-600">{item.modifications.description}</div>
    </div>

    {/* Traits as Badges */}
    {item.traits.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {item.traits.map((trait) => (
          <Badge key={trait} label={trait} color="gray" />
        ))}
      </div>
    )}
  </GameCard>
);

export default CommunityCard;