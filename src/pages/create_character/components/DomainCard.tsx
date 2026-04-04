import React from "react";
import { Domain } from "../../../common/types/Domain";
import GameCard from "../../../common/components/GameCard";
import styles from "../../../common/types/cssColor";

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
        <p className={`text-sm ${styles.gray.text} mt-1`}>{item.description}</p>
      )}
    </GameCard>
  );
};

export default DomainCard;