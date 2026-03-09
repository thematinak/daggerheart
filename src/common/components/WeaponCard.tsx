import React from "react";
import { Sword, Zap } from "lucide-react";
import { Badge } from "./Badge"; // rovnaký Badge ako pri ArmorCard
import GameCard from "./GameCard"; // nový jednotný wrapper

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
  <GameCard selected={selected} onClick={selected ? onDeselect : onSelect}>
    {/* Header */}
    <div className="flex justify-between items-start gap-2">
      <div>
        <h3 className="font-bold text-lg">{weapon.name}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {weapon.attribute} • {weapon.burden === "two-handed" ? "Two Handed" : "One Handed"} • {weapon.range}
        </p>
      </div>

      <div className="flex gap-2 items-center">
        <Badge
          label={`T${weapon.tier}`}
          color={
            weapon.tier === 1 ? "green" :
            weapon.tier === 2 ? "blue" :
            weapon.tier === 3 ? "purple" :
            "yellow"
          }
        />
        <Badge label={weapon.slot} color="gray" />
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
  </GameCard>
);

export default WeaponCard;