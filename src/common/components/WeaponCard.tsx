import React from "react";
import { Sword, Zap } from "lucide-react";
import { Badge } from "./Badge";
import GameCard from "./GameCard";
import { WeaponItem } from "../types/Weapon";
import styles from "../types/cssColor";

type WeaponCardProps = {
  weapon: WeaponItem;
  proficiency: number;
  selected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
};

function normalizeProficiency(proficiency?: number) {
  const parsed = typeof proficiency === "number" ? proficiency : 1;
  return Math.max(1, Math.min(15, parsed));
}

// render damage ako text
function renderDamage(damage: WeaponItem["damage"], proficiency: number) {
  const parts: string[] = [];
  Object.entries(damage).forEach(([key, value]) => {
    if (key === "flat") return;
    if (value > 0) parts.push(`${value * proficiency}d${key}`);
  });
  if (damage.flat) parts.push(`${damage.flat}`);
  return parts.join(" + ");
}

export const WeaponCard: React.FC<WeaponCardProps> = ({
  weapon,
  proficiency = 1,
  selected,
  onSelect,
  onDeselect,
}) => {
  const effectiveProficiency = normalizeProficiency(proficiency);

  return (
  <GameCard selected={selected} onClick={selected ? onDeselect : onSelect}>
    {/* Header */}
    <div className="flex justify-between items-start gap-2">
      <div>
        <h3 className="font-bold text-lg">{weapon.name}</h3>
        <p className={`text-sm ${styles.gray.text} mt-1`}>
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
      <Sword size={14} /> {renderDamage(weapon.damage, effectiveProficiency)}
    </div>

    {/* Ability */}
    {weapon.ability && (
      <div className={`text-sm border-t pt-2 ${styles.gray.text} flex flex-col gap-1`}>
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" />
          <strong>{weapon.ability}</strong>
        </div>
        {weapon.abilityDescription && (
          <p className={`text-xs ${styles.gray.text} pl-6`}>{weapon.abilityDescription}</p>
        )}
      </div>
    )}

    {/* Description */}
    {weapon.description && (
      <p className={`text-xs ${styles.gray.text} mt-1`}>{weapon.description}</p>
    )}
  </GameCard>
  );
};

export default WeaponCard;
