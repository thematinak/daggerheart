import React from "react";
import { Shield, Zap } from "lucide-react";

export type ArmorItem = {
  id: string;
  name: string;
  tier: 1 | 2 | 3 | 4;
  threshold1: number;
  threshold2: number;
  baseScore: number; // 0-2 light, 3-4 medium, 5+ heavy
  modifiers: Partial<{
    agility: number;
    strength: number;
    finesse: number;
    instinct: number;
    presence: number;
    knowledge: number;
    evasion: number;
    armor: number;
    hp: number;
    stress: number;
  }>;
  ability?: string;
  abilityDescription?: string;
};

type ArmorCardProps = {
  armor: ArmorItem;
  selected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
};

const tierColors: Record<number, string> = {
  1: "bg-green-200 border-green-700 text-green-900 border",
  2: "bg-blue-200 border-blue-700 text-blue-900 border",
  3: "bg-purple-200 border-purple-700 text-purple-900 border",
  4: "bg-yellow-200 border-yellow-700 text-yellow-900 border",
};

function getBaseScoreLabel(score: number) {
  if (score <= 2) return "Light";
  if (score <= 4) return "Medium";
  return "Heavy";
}

const MODIFIER_KEYS = [
  "agility",
  "strength",
  "finesse",
  "instinct",
  "presence",
  "knowledge",
  "evasion",
  "armor",
  "hp",
  "stress",
] as const;

export const ArmorCard: React.FC<ArmorCardProps> = ({
  armor,
  selected,
  onSelect,
  onDeselect,
}) => (
  <div
    onClick={selected ? onDeselect : onSelect}
    className={`
      relative cursor-pointer rounded-xl border p-4 flex flex-col gap-3
      bg-white shadow-sm transition-all
      hover:shadow-lg hover:scale-[1.02]
      ${selected ? "border-yellow-400 ring-2 ring-yellow-300" : "border-gray-200"}
    `}
  >
    {/* Header: name, tier, base score */}
    <div className="flex justify-between items-start gap-2">
      <h3 className="font-bold text-lg">{armor.name}</h3>
      <div className="flex gap-2 items-center">
        <span className={`text-xs px-2 py-1 rounded font-semibold ${tierColors[armor.tier]}`}>
          T{armor.tier}
        </span>
        <span className="text-xs px-2 py-1 rounded bg-gray-200 font-semibold">
          {getBaseScoreLabel(armor.baseScore)}
        </span>
      </div>
    </div>

    {/* Thresholds */}
    <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded text-sm">
      <Shield size={14} /> {armor.threshold1}/{armor.threshold2}
    </div>

    {/* Modifiers as text */}
    <div className="flex flex-col gap-1">
      {MODIFIER_KEYS.map((key) => {
        const value = armor.modifiers[key];
        return value !== undefined ? (
          <p key={key} className="text-sm text-gray-700">
            {value >= 0 ? `+${value}` : value} to {key.charAt(0).toUpperCase() + key.slice(1)}
          </p>
        ) : null;
      })}
    </div>

    {/* Ability */}
    {armor.ability && (
      <div className="text-sm border-t pt-2 text-gray-700 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" />
          <strong>{armor.ability}</strong>
        </div>
        {armor.abilityDescription && (
          <p className="text-xs text-gray-600 pl-6">{armor.abilityDescription}</p>
        )}
      </div>
    )}
  </div>
);

export default ArmorCard;