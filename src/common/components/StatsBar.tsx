import React from "react";
import { Shield } from "lucide-react";
import { Character, Stats } from "../types/Character";
import { StatModifiers } from "../types/StatModifiers";
import styles from "../types/cssColor";

function applyModifiers(stats: Stats, modifiers?: StatModifiers) {
  if (!modifiers) return;

  Object.entries(modifiers).forEach(([key, value]) => {
    if (value && key in stats) {
      (stats as any)[key] += value;
    }
  });
}



export function buildStatsFromCharacter(character: Character): Stats {
  const stats: Stats = {
    evasion: 0,
    maxArmor: 0,
    armor: 0,

    agility: 0,
    strength: 0,
    finesse: 0,
    instinct: 0,
    presence: 0,
    knowledge: 0,

    threshold1: 0,
    threshold2: 0,

    maxHp: 0,
    hp: 0,
    maxStress: 0,
    stress: 0,
  };

  const safeApply = (mod?: StatModifiers) => {
    if (!mod) return;
    applyModifiers(stats, mod);
  };

  // -------- CLASS BASE --------
  if (character.class) {
    stats.evasion += character.class.baseEvasion ?? 0;
    stats.maxHp += character.class.baseHp ?? 0;

    safeApply(character.class.modifiers);
  }

  // -------- LEVEL --------
  if (character.level) {
    const levelBonus = character.level - 1;

    stats.maxHp += levelBonus;
    stats.maxStress += levelBonus;
  }

  // -------- ATTRIBUTES --------
  if (character.attributes) {
    stats.agility += character.attributes.agility?.value || 0;
    stats.strength += character.attributes.strength?.value || 0;
    stats.finesse += character.attributes.finesse?.value || 0;
    stats.instinct += character.attributes.instinct?.value || 0;
    stats.presence += character.attributes.presence?.value || 0;
    stats.knowledge += character.attributes.knowledge?.value || 0;
  }

  // -------- ANCESTRY --------
  if (character.ancestry) {
    safeApply(character.ancestry.modifiers);
  }

  // -------- COMMUNITY --------
  if (character.community) {
    safeApply(character.community.modifiers);
  }

  // -------- SPECIALIZATION --------
  if (character.specialization) {
    character.specialization.modifications?.forEach((mod) => {
      safeApply(mod.modifiers);
    });
  }

  // -------- ARMOR --------
  if (character.armor) {
    stats.threshold1 += character.armor.threshold1 ?? 0;
    stats.threshold2 += character.armor.threshold2 ?? 0;

    safeApply(character.armor.modifiers);
    
  }

  // -------- WEAPONS --------
  [character.weapons?.primary, character.weapons?.secondary].forEach(
    (weapon) => {
      if (!weapon) return;
      safeApply(weapon.modifiers);
    }
  );

  // -------- DOMAIN CARDS --------
  character.domainCards?.forEach((card) => {
    safeApply(card.modifiers);
  });

  // -------- CUSTOM ATTRIBUTES --------
  safeApply(character.customAttributes);

  const clamp = (value: number, min = 0, max = Infinity) =>
    Math.max(min, Math.min(max, value));

  stats.hp = clamp(stats.hp, 0, stats.maxHp);
  stats.stress = clamp(stats.stress, 0, stats.maxStress);
  stats.armor = clamp(stats.armor, 0, stats.maxArmor);

  // optional caps (ak chceš balans)
  stats.evasion = clamp(stats.evasion, 0, 50);
  stats.threshold1 = clamp(stats.threshold1, 0);
  stats.threshold2 = clamp(stats.threshold2, stats.threshold1);

  return stats;
}

const ArmorDisplay: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="flex justify-center gap-0.5">
      {Array.from({ length: value }).map((_, i) => (
        <Shield key={i} size={14} className={`${styles.yellow.lightText} ${styles.yellow.fill}`} />
      ))}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-white/88 px-1.5 py-2 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.18)]">
    <div className="flex min-h-[48px] flex-col items-center justify-center">
      <span className={`text-[10px] ${styles.gray.lightText} uppercase tracking-[0.1em] text-center`}>
        {label}
      </span>

      {label === "Armor" && typeof value === "number" ? (
        <ArmorDisplay value={value} />
      ) : (
        <span className={`text-sm font-bold ${styles.gray.text}`}>
          {value}
        </span>
      )}
    </div>
  </div>
);

type StatsBarProps = {
  stats: Stats;
};

const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const attributeItems = [
    { label: "Agility", value: stats.agility },
    { label: "Strength", value: stats.strength },
    { label: "Finesse", value: stats.finesse },
    { label: "Instinct", value: stats.instinct },
    { label: "Presence", value: stats.presence },
    { label: "Knowledge", value: stats.knowledge },
  ];

  const defenseItems = [
    { label: "Evasion", value: stats.evasion },
    { label: "Thresholds", value: `${stats.threshold1}/${stats.threshold2}` },
    { label: "Armor", value: stats.maxArmor },
    { label: "HP", value: `${stats.hp}/${stats.maxHp}` },
    { label: "Stress", value: `${stats.stress}/${stats.maxStress}` },
  ];

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="grid grid-cols-6 gap-1.5">
        {attributeItems.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <StatCard label={stat.label} value={stat.value} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {defenseItems.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <StatCard label={stat.label} value={stat.value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
