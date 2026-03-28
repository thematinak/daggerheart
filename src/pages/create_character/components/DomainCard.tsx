import React from "react";
import { Domain } from "../../../common/types/Domain";
import GameCard from "../../../common/components/GameCard";

type DomainCardProps = {
  item: Domain;
  selected?: boolean;
  onSelect: () => void;
};

const DomainCard: React.FC<DomainCardProps> = ({ item, selected = false, onSelect }) => {
  return (
    <GameCard 
      selected={selected}
      onClick={onSelect}
    >
      <h3 className="font-bold text-lg">{item.name}</h3>
      {item.description && (
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      )}
    </GameCard>
  );
};

export default DomainCard;