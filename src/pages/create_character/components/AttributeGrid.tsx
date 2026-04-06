import React from "react";
import GameCard from "../../../common/components/GameCard";
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
  showBack = false,
  showNext = false,
  onBack,
  onNext,
}) => {
  const usedIds = Object.values(selected)
    .filter((attribute): attribute is { value: number; id: number } => attribute !== null)
    .map((attribute) => attribute.id);

  return (
    <div className={`${styles.tokens.page.section} flex flex-col gap-6 p-5 sm:p-6 lg:p-8`}>
      <div className="text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
          Character Builder
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Assign Attributes
        </h2>
        <p className={`mx-auto mt-3 max-w-2xl ${styles.tokens.page.subtitle}`}>
          Every modifier can be used only once. Pick the spread that fits your build best.
        </p>
      </div>

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

      {(showBack || showNext) && (
        <NextPreviousButton
          showBack={showBack}
          showNext={showNext}
          onBack={onBack}
          onNext={onNext}
        />
      )}
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
      <div className="flex min-h-[240px] flex-col">
        <div className="mb-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Attribute
          </div>
          <h3 className="mt-1 text-xl font-black capitalize text-slate-950">{item.name}</h3>
        </div>

        <ul className={`mb-4 space-y-1 text-sm ${styles.gray.text}`}>
          {item.skills.map((skill) => (
            <li key={skill} className="rounded-xl bg-slate-50 px-3 py-2">
              {skill}
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Available Values
          </div>
          <div className="grid grid-cols-3 gap-2">
            {attributeOptions.map((option) => {
              const isSelected = chosen?.id === option.id;
              const isUsedElsewhere = usedIds.includes(option.id) && !isSelected;

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
                  className={[
                    "rounded-xl border px-3 py-2 text-sm font-bold transition-all duration-200",
                    isSelected
                      ? "border-emerald-400 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                      : isUsedElsewhere
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 opacity-60"
                        : "border-amber-300 bg-amber-50 text-amber-900 hover:-translate-y-0.5 hover:bg-amber-100",
                  ].join(" ")}
                >
                  {option.value > 0 ? `+${option.value}` : `${option.value}`}
                </button>
              );
            })}
          </div>

          {chosen && (
            <button
              type="button"
              onClick={onDeselect}
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear Selection
            </button>
          )}
        </div>
      </div>
    </GameCard>
  );
};
