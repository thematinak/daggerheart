import React from "react";
import GameCard from "../../../common/components/GameCard"; 
import { Badge } from "../../../common/components/Badge";
import { CommunityItem } from "../../../common/types/Community";
import styles from "../../../common/types/cssColor";


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
    <p className={`text-sm ${styles.gray.text}`}>{item.description}</p>

    {/* Modifications */}
    <div className={`p-2 rounded-lg ${styles.gray.bg} my-2`}>
      <div className="font-semibold text-sm">{item.modifications.name}</div>
      <div className={`text-xs ${styles.gray.text}`}>{item.modifications.description}</div>
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