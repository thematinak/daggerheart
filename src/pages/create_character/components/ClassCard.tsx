import React from "react";
import GameCard from "../../../common/components/GameCard";
import { Badge } from "../../../common/components/Badge";
import { CharacterClass } from "../../../common/types/CharacterClass";
import styles from "../../../common/types/cssColor";


type ClassCardProps = {
  item: CharacterClass;
  selected: boolean;
  onClick?: () => void;
};

export const ClassCard: React.FC<ClassCardProps> = ({ item, selected, onClick }) => (
  <GameCard selected={selected} onClick={onClick}>
    <h3 className="text-lg font-bold">{item.name}</h3>
    <p className={`text-sm ${styles.gray.text}`}>{item.description}</p>

    <div className="flex gap-2">
      <Badge label={`❤️ HP: ${item.baseHp}`} color="red" />
      <Badge label={`🌀 Evasion: ${item.baseEvasion}`} color="blue" />
    </div>

    {item.domains.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {item.domains.map((d) => (
          <Badge key={d} label={d} color="gray" />
        ))}
      </div>
    )}
  </GameCard>
);

export default ClassCard;