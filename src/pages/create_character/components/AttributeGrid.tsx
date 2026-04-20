import React from "react";
import GameCard from "../../../common/components/GameCard";
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
  { value: 2, id: 0 },
  { value: 1, id: 1 },
  { value: 1, id: 2 },
  { value: 0, id: 3 },
  { value: 0, id: 4 },
  { value: -1, id: 5 },
];

export const AttributesGrid: React.FC<AttributesGridProps> = ({
  attributes,
  selected,
  onSelect,
}) => {
  const usedIds = Object.values(selected)
    .filter((attribute): attribute is { value: number; id: number } => attribute !== null)
    .map((attribute) => attribute.id);

  return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {attributes.map((item) => (
          <AttributeCard
            key={item.id}
            item={item}
            usedIds={usedIds}
            chosen={selected[item.name]}
            onSelect={(value) => onSelect({ ...selected, [item.name]: value })}
            onDeselect={() => onSelect({ ...selected, [item.name]: null })}
          />
        ))}
      </div>
  );
};

type AttributeCardProps = {
  item: AttributeItem;
  usedIds: number[];
  chosen: { value: number; id: number } | null;
  onSelect: (selected: { value: number; id: number }) => void;
  onDeselect: () => void;
};

const AttributeCard: React.FC<AttributeCardProps> = ({
  item,
  usedIds,
  chosen,
  onSelect,
  onDeselect,
}) => {
  return (
    <GameCard selected={!!chosen} hover={false}>
      <div className="flex min-h-[240px] flex-col gap-4">
        <div className="mb-4">
          <div className={styles.tokens.text.label}>
            Attribute
          </div>
          <h3 className="mt-1 text-xl font-black capitalize text-[var(--text-primary)]">{item.name}</h3>
        </div>

        <ul className={`mb-4 space-y-2 text-sm ${styles.gray.text}`}>
          {item.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-xl border border-[color:var(--border-soft)] bg-[var(--surface-muted)] px-3 py-2"
            >
              {skill}
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <div className={`mb-2 ${styles.tokens.text.label}`}>
            Available Values
          </div>
          <div className="grid grid-cols-3 gap-2">
            {attributeOptions.map((option) => {
              const isSelected = chosen?.id === option.id;
              const isUsedElsewhere = usedIds.includes(option.id) && !isSelected;

              const cssStyles = [styles.tokens.badge]
              if (isSelected) {
                let style = styles.green;
                cssStyles.push(style.bg);
                cssStyles.push(style.bgHover);
                cssStyles.push(style.border);
                cssStyles.push(style.text);
              } else if (isUsedElsewhere) {
                let style = styles.gray;
                cssStyles.push(style.bg);
                cssStyles.push(style.bgHover);
                cssStyles.push(style.border);
                cssStyles.push(style.text);
                cssStyles.push("cursor-not-allowed "); 
              } else {
                let style = styles.yellow;
                cssStyles.push(style.bg);
                cssStyles.push(style.bgHover);
                cssStyles.push(style.border);
                cssStyles.push(style.text);
              }
              return (
                <button
                  key={`${item.id}-${option.id}`}
                  type="button"
                  disabled={isUsedElsewhere}
                  onClick={() => {
                    if (isSelected) {
                      onDeselect();
                      return;
                    }

                    if (!isUsedElsewhere) {
                      onSelect(option);
                    }
                  }}
                  className={cssStyles.join(" ")}
                >
                  {option.value > 0 ? `+${option.value}` : `${option.value}`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </GameCard>
  );
};
