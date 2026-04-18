import React from "react";
import { Crosshair, Grip, Sword, Zap } from "lucide-react";
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

function renderDamage(damage: WeaponItem["damage"], proficiency: number) {
  const parts: string[] = [];

  Object.entries(damage).forEach(([key, value]) => {
    if (key === "flat") {
      return;
    }

    if (value > 0) {
      parts.push(`${value}d${Number(key) * proficiency}`);
    }
  });

  if (damage.flat) {
    parts.push(`${damage.flat}`);
  }

  return parts.join(" + ");
}

function getTierColor(tier: WeaponItem["tier"]) {
  if (tier === 1) return "green";
  if (tier === 2) return "blue";
  if (tier === 3) return "purple";
  return "yellow";
}

function formatModifierLabel(key: string) {
  if (key === "maxHp") return "Max HP";
  if (key === "maxStress") return "Max Stress";
  if (key === "maxArmor") return "Max Armor";
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export const WeaponCard: React.FC<WeaponCardProps> = ({
  weapon,
  proficiency = 1,
  selected,
  onSelect,
  onDeselect,
}) => {
  const effectiveProficiency = normalizeProficiency(proficiency);
  const damageText = renderDamage(weapon.damage, effectiveProficiency);
  const modifiers = Object.entries(weapon.modifiers ?? {}).filter(([, value]) => typeof value === "number");

  return (
    <GameCard selected={selected} onClick={selected ? onDeselect : onSelect}>
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{weapon.name} </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{weapon.attribute}</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge label={`T${weapon.tier}`} color={getTierColor(weapon.tier)} />
            <Badge label={weapon.slot} color="gray" />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3">
            <div className={styles.tokens.text.label}>Damage</div>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Sword size={15} className="text-[var(--text-accent)]" />
              <span>{damageText || "No damage set"}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3">
            <div className={styles.tokens.text.label}>Handling</div>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--text-primary)]">
              <span className="inline-flex items-center gap-2 font-semibold">
                <Grip size={15} className="text-[var(--text-accent)]" />
                {weapon.burden === "two-handed" ? "Two Handed" : "One Handed"}
              </span>
              <span className="inline-flex items-center gap-2 font-semibold">
                <Crosshair size={15} className="text-[var(--text-accent)]" />
                {weapon.range}
              </span>
            </div>
          </div>
        </div>

        {modifiers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {modifiers.map(([key, value]) => (
              <span
                key={key}
                className={`${styles.tokens.pill.base} ${styles.tokens.pill.info}`}
              >
                {(value as number) >= 0 ? "+" : ""}
                {value} {formatModifierLabel(key)}
              </span>
            ))}
          </div>
        ) : null}

        {weapon.ability ? (
          <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[image:var(--surface-modal)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface-accent)] text-[var(--text-accent)]">
                <Zap size={16} />
              </span>
              <span>{weapon.ability}</span>
            </div>
            {weapon.abilityDescription ? (
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                {weapon.abilityDescription}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </GameCard>
  );
};

export default WeaponCard;
