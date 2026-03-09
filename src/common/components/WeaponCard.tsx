import React from "react";
import { Sword, Zap } from "lucide-react";

export type WeaponItem = {
  id: string;
  name: string;
  description?: string;

  attribute: string;
  range: string;
  damage: Record<number, number> & { flat?: number };
  burden: "one-handed" | "two-handed";

  tier: 1 | 2 | 3 | 4;
  slot: "primary" | "secondary";

  ability?: string;
  abilityDescription?: string;
};

type WeaponCardProps = {
  weapon: WeaponItem;
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

const slotColors = {
  primary: "bg-red-200 border-red-700 text-red-900 border",
  secondary: "bg-gray-200 border-gray-700 text-gray-900 border",
};

// render damage ako text
function renderDamage(damage: WeaponItem["damage"]) {
  const parts: string[] = [];
  Object.entries(damage).forEach(([key, value]) => {
    if (key === "flat") return;
    if (value > 0) parts.push(`${value}d${key}`);
  });
  if (damage.flat) parts.push(`${damage.flat}`);
  return parts.join(" + ");
}

export const WeaponCard: React.FC<WeaponCardProps> = ({
  weapon,
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
    {/* Header */}
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-bold text-lg">{weapon.name}</h3>

        {/* inline atribut + burden + range */}
        <p className="text-sm text-gray-600 mt-1">
          {weapon.attribute} • {weapon.burden === "two-handed" ? "Two Handed" : "One Handed"} • {weapon.range}
        </p>
      </div>

      <div className="flex gap-1">
        <span className={`text-xs px-2 py-1 rounded font-semibold ${tierColors[weapon.tier]}`}>
          T{weapon.tier}
        </span>
        <span className={`text-xs px-2 py-1 rounded font-semibold ${slotColors[weapon.slot]}`}>
          {weapon.slot}
        </span>
      </div>
    </div>

    {/* Damage */}
    <div className="flex items-center gap-1 text-sm mt-2">
      <Sword size={14} /> {renderDamage(weapon.damage)}
    </div>

    {/* Ability */}
    {weapon.ability && (
      <div className="text-sm border-t pt-2 text-gray-700 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" />
          <strong>{weapon.ability}</strong>
        </div>
        {weapon.abilityDescription && (
          <p className="text-xs text-gray-600 pl-6">{weapon.abilityDescription}</p>
        )}
      </div>
    )}

    {/* Description */}
    {weapon.description && (
      <p className="text-xs text-gray-500 mt-1">{weapon.description}</p>
    )}
  </div>
);

export default WeaponCard;