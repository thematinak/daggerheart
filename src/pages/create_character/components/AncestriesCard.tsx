import React from "react";
import GameCard from "../../../common/components/GameCard";
import { Ancestries } from "../../../common/types/Ancestries";
import styles from "../../../common/types/cssColor";



type AncestriesCardProps = {
  item: Ancestries;
  selected?: boolean;
  onClick?: () => void;
};

const AncestriesCard: React.FC<AncestriesCardProps> = ({
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
    {item.modifications.length > 0 && (
      <div className="space-y-2 mt-2">
        {item.modifications.map((mod) => (
          <div
            key={mod.id}
            className={`p-2 rounded-lg ${styles.gray.bg}`}
          >
            <div className="font-semibold text-sm">{mod.name}</div>
            <div className={`text-xs ${styles.gray.text}`}>{mod.description}</div>
          </div>
        ))}
      </div>
    )}
  </GameCard>
);

export default AncestriesCard;