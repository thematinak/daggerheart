import React, { useEffect, useState } from "react";
import { BackpackItem } from "../../../common/types/BackpackItem";
import GameCard from "../../../common/components/GameCard";
import { NextPreviousButton } from "./NextPreviousButtons";
import styles from "../../../common/types/cssColor";
import Section from "../../../common/components/Section";


type Props = {
  character: any;
  onBack: () => void;
  onNext?: () => void;
  showNext?: boolean;
  onSelect: (items: BackpackItem[], bank: number) => void;
};

const FIXED_ITEMS: BackpackItem[] = [
  {
    id: "torch",
    name: "Torch",
    modifiers: {},
    description: "Useful for illuminating a dark room.",
    roll: 0
  },
  {
    id: "rope",
    name: "50 feet of rope",
    modifiers: {},
    description: "Useful for climbing a wall or rappelling down a cliff.",
    roll: 0
  },
  {
    id: "basic_supplies",
    name: "Basic supplies",
    modifiers: {},
    description: "Tent, bedroll, tinderbox, rations, etc.",
    roll: 0
  }
];

const POTION_OPTIONS: BackpackItem[] = [
  {
    id: "minor_health_potion",
    name: "Minor Health Potion",
    modifiers: {},
    description: "Clear 1d4 Hit Points.",
    roll: 0
  },
  {
    id: "minor_stamina_potion",
    name: "Minor Stamina Potion",
    modifiers: {},
    description: "Clear 1d4 Stress.",
    roll: 0
  }
];

export const BackpackSelectorCard: React.FC<Props> = ({
  character,
  onBack,
  onNext,
  showNext = true,
  onSelect
}) => {
  const classItem: BackpackItem | null =
    character?.characterClass?.class_item || null;

  const [selectedPotion, setSelectedPotion] =
    useState<BackpackItem | null>(null);

  const finalItems: BackpackItem[] = [
    ...FIXED_ITEMS,
    ...(classItem ? [classItem] : []),
    ...(selectedPotion ? [selectedPotion] : [])
  ];

  // auto update parent
  useEffect(() => {
    onSelect(finalItems, 10);
  }, [selectedPotion, classItem]);

  return (
    <Section title="Backpack" subtitle="Select the essential items your character will carry on their adventures. Your backpack defines your preparedness for the challenges ahead.">
      {/* FIXED ITEMS */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {FIXED_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`p-3 border rounded-lg ${styles.gray.bg}`}
          >
            <h3 className="font-semibold">{item.name}</h3>
            <p className={`text-sm ${styles.gray.text}`}>
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* CLASS ITEM */}
      {classItem && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Class Item</h3>
          <div className={`p-3 border rounded-lg ${styles.yellow.bg}`}>
            <h4 className="font-semibold">{classItem.name}</h4>
            <p className={`text-sm ${styles.gray.text}`}>
              {classItem.description}
            </p>
          </div>
        </div>
      )}

      {/* POTION CHOICE */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">
          Choose your potion
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {POTION_OPTIONS.map((potion) => {
            return (
              <GameCard
                key={potion.id}
                onClick={() => setSelectedPotion(potion)}
                selected={selectedPotion?.id === potion.id}
              >
                <h4 className="font-semibold">{potion.name}</h4>
                <p className={`text-sm ${styles.gray.text}`}>
                  {potion.description}
                </p>
              </GameCard>
            );
          })}
        </div>
      </div>

      {/* NAVIGATION */}
      {(showNext) && (
          <NextPreviousButton showBack={true} showNext={showNext} onBack={onBack} onNext={onNext} />
      )}
    </Section>
  );
};