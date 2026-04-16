import React from "react";
import GameCard from "../../../common/components/GameCard";
import { Badge } from "../../../common/components/Badge";
import { CharacterClass } from "../../../common/types/CharacterClass";
import styles from "../../../common/types/cssColor";

const CLASS_IMAGE_MAP: Record<string, string> = {
  bard: `${process.env.PUBLIC_URL}/class_logo/bard.png`,
  druid: `${process.env.PUBLIC_URL}/class_logo/druid.png`,
  guardian: `${process.env.PUBLIC_URL}/class_logo/guardian.png`,
  ranger: `${process.env.PUBLIC_URL}/class_logo/ranger.png`,
  rogue: `${process.env.PUBLIC_URL}/class_logo/rogue.png`,
  seraph: `${process.env.PUBLIC_URL}/class_logo/seraph.png`,
  sorcerer: `${process.env.PUBLIC_URL}/class_logo/sorcerer.png`,
  warrior: `${process.env.PUBLIC_URL}/class_logo/warior.png`,
  wizard: `${process.env.PUBLIC_URL}/class_logo/wizard.png`,
};

const getClassImageSrc = (item: CharacterClass) => {
  const normalizedId = item.id.trim().toLowerCase();
  if (CLASS_IMAGE_MAP[normalizedId]) {
    return CLASS_IMAGE_MAP[normalizedId];
  }

  const normalizedName = item.name.trim().toLowerCase();
  return CLASS_IMAGE_MAP[normalizedName] || null;
};

type ClassCardProps = {
  item: CharacterClass;
  selected: boolean;
  onClick?: () => void;
};

export const ClassCard: React.FC<ClassCardProps> = ({ item, selected, onClick }) => {
  const imageSrc = getClassImageSrc(item);

  return (
    <GameCard selected={selected} onClick={onClick}>
      <div className="flex flex-col gap-4">
        {imageSrc ? (
          <div className="flex items-center justify-center overflow-hidden rounded-[1.25rem] border border-[color:var(--border-soft)] bg-[var(--surface-muted)] px-3 py-2">
            <img
              src={imageSrc}
              alt={`${item.name} class emblem`}
              className="w-full object-contain object-center"
              loading="lazy"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{item.name}</h3>
          <p className={`text-sm ${styles.gray.text}`}>{item.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge label={`HP: ${item.baseHp}`} color="red" />
          <Badge label={`Evasion: ${item.baseEvasion}`} color="blue" />
        </div>

        {item.domains.length > 0 ? (
          <div className="mt-1 flex flex-wrap gap-2">
            {item.domains.map((domain) => (
              <Badge key={domain} label={domain} color="gray" />
            ))}
          </div>
        ) : null}
      </div>
    </GameCard>
  );
};

export default ClassCard;
