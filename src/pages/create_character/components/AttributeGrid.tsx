import React from "react";
import GameCard from "../../../common/components/GameCard";
import { Badge } from "../../../common/components/Badge";
import { NextPreviousButton } from "./NextButton";
import styles from "../../../common/types/cssColor";

export type Attributes = {
  agility: { value: number; id: number } | null;
  strength: { value: number; id: number } | null;
  finesse: { value: number; id: number } | null;
  instinct: { value: number; id: number } | null;
  presence: { value: number; id: number } | null;
  knowledge: { value: number; id: number } | null;
};

export type AttributeItem = {
  id: string;
  name: keyof Attributes;
  skills: string[];
};

type AttributesGridProps = {
  attributes: AttributeItem[];
  selected: Attributes;
  onSelect: (selectedAttributes: Attributes) => void;
  showBack?: boolean;
  showNext?: boolean;
  onBack?: () => void;
  onNext?: () => void;
};

  const attributeOptions = [
    {value:  2, id: 0}, 
    {value:  1, id: 1},
    {value:  1, id: 2},
    {value:  0, id: 3},
    {value:  0, id: 4},
    {value: -1, id: 5}
  ];

export const AttributesGrid: React.FC<AttributesGridProps> = ({
  attributes,
  selected,
  onSelect,
  showBack = false,
  showNext = false,
  onBack,
  onNext,
}) => {
  // Zisti ktoré hodnoty sú už vybrané
  const attrsUsed = Object.values(selected)
    .filter((a): a is { value: number; id: number } => a !== null)
    .map((a) => a.id);

  const available = attributeOptions.filter((opt) => !attrsUsed.includes(opt.id));

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-center text-2xl font-bold">Assign Attributes</h2>

      <div className="flex flex-wrap gap-4 justify-center">
        {attributes.map((item) => (
          <AttributeCard
            key={item.id}
            item={item}
            available={available}
            choosen={selected[item.name]}
            onSelect={(val) => onSelect({ ...selected, [item.name]: val })}
            onDeselect={() => onSelect({ ...selected, [item.name]: null })}
          />
        ))}
      </div>

      {(showBack || showNext) && (<NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext} />

      )}
    </div>
  );
};

type AttributeCardProps = {
  item: AttributeItem;
  available: { value: number; id: number }[];
  choosen: { value: number; id: number } | null;
  onSelect: (selected: { value: number; id: number }) => void;
  onDeselect: () => void;
};

const AttributeCard: React.FC<AttributeCardProps> = ({
  item,
  available,
  choosen,
  onSelect,
  onDeselect,
}) => {
  return (
    <GameCard selected={!!choosen} onClick={choosen ? onDeselect : undefined} hover={false}>
      {/* Header */}
      <h3 className="text-lg font-bold">{item.name}</h3>

      {/* Skills */}
      <ul className={`text-sm ${styles.gray.text} mb-2 list-disc list-inside`}>
        {item.skills.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      {/* Available Modifiers */}
      <div className="flex flex-wrap gap-2 mt-2">
        {choosen ? (
          <Badge label={`${choosen.value} ✕`} color="green" onClick={onDeselect} />
        ) : (
          available.map((opt) => (
            <Badge
              key={item.id + "-" + opt.id}
              label={`${opt.value}`}
              color="yellow"
              onClick={() => onSelect(opt)}
            />
          ))
        )}
      </div>
    </GameCard>
  );
};