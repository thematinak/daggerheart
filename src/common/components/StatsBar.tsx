import React from "react";
import { Brain, Crosshair, Drama, Droplets, Eye, Footprints, HandFist, LucideIcon, Rabbit, Shield, Sparkles, Swords } from "lucide-react";
import { Character, CurrentStats, Stats } from "../types/Character";
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
    maxHope: 6,
    maxHp: 0,
    maxStress: 0,

    agility: 0,
    strength: 0,
    finesse: 0,
    instinct: 0,
    presence: 0,
    knowledge: 0,

    threshold1: 0,
    threshold2: 0,
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
    stats.threshold1 += character.level;
    stats.threshold2 += character.level;
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

type AdjustableStatKey = "hp" | "stress" | "armor" | "hope";

type StatCardProps = {
  label: string;
  value: number | string;
};

const statMeta: Record<string, { icon: LucideIcon; tone: string; iconColor: string }> = {
  Evasion: { icon: Rabbit, tone: "bg-sky-50 border-sky-200", iconColor: "text-sky-600" },
  Thresholds: { icon: Crosshair, tone: "bg-amber-50 border-amber-200", iconColor: "text-amber-600" },
  Agility: { icon: Footprints, tone: "bg-emerald-50 border-emerald-200", iconColor: "text-emerald-600" },
  Strength: { icon: HandFist, tone: "bg-rose-50 border-rose-200", iconColor: "text-rose-600" },
  Finesse: { icon: Crosshair, tone: "bg-violet-50 border-violet-200", iconColor: "text-violet-600" },
  Instinct: { icon: Eye, tone: "bg-cyan-50 border-cyan-200", iconColor: "text-cyan-600" },
  Presence: { icon: Drama, tone: "bg-yellow-50 border-yellow-200", iconColor: "text-yellow-600" },
  Knowledge: { icon: Brain, tone: "bg-indigo-50 border-indigo-200", iconColor: "text-indigo-600" },
  Armor: { icon: Shield, tone: "bg-amber-50 border-amber-200", iconColor: "text-amber-600" },
  HP: { icon: Droplets, tone: "bg-rose-50 border-rose-200", iconColor: "text-rose-600" },
  Stress: { icon: Brain, tone: "bg-violet-50 border-violet-200", iconColor: "text-violet-600" },
  Hope: { icon: Sparkles, tone: "bg-yellow-50 border-yellow-200", iconColor: "text-yellow-600" },
  Proficiency: { icon: Swords, tone: "bg-orange-50 border-orange-200", iconColor: "text-orange-600" },
};

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  const meta = statMeta[label];
  const Icon = meta?.icon;

  return (
  <div className="rounded-xl border border-slate-200 bg-white/88 px-1.5 py-2 shadow-[0_6px_14px_-12px_rgba(15,23,42,0.18)]">
    <div className="flex min-h-[48px] flex-col items-center justify-center gap-2">
      <div className="flex items-center gap-1.5">
        {Icon ? (
          <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${meta.tone}`}>
            <Icon size={11} className={meta.iconColor} />
          </span>
        ) : null}
        <span className={`text-[10px] ${styles.gray.lightText} uppercase tracking-[0.1em] text-center`}>
        {label}
        </span>
      </div>

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
};

type StatsBarProps = {
  stats: Stats;
  currentStats: CurrentStats;
  proficiency: number;
  adjustableStats?: Partial<Record<AdjustableStatKey, {
    onDecrease: () => void;
    onIncrease: () => void;
    disabled?: boolean;
  }>>;
};

const StatsBar: React.FC<StatsBarProps> = ({ stats, currentStats, proficiency, adjustableStats }) => {
  const normalizedCurrentStats: CurrentStats = {
    hp: currentStats.hp ?? 0,
    stress: currentStats.stress ?? 0,
    armor: currentStats.armor ?? 0,
    hope: currentStats.hope ?? 0,
  };

  const attributeItems = [
    { label: "Evasion", value: stats.evasion },
    { label: "Thresholds", value: `${stats.threshold1}/${stats.threshold2}` },
    { label: "Agility", value: stats.agility },
    { label: "Strength", value: stats.strength },
    { label: "Finesse", value: stats.finesse },
    { label: "Instinct", value: stats.instinct },
    { label: "Presence", value: stats.presence },
    { label: "Knowledge", value: stats.knowledge },
  ];

  const defenseItems = [
    { label: "Armor", value: normalizedCurrentStats.armor, controls: adjustableStats?.armor },
    { label: "HP", value: `${normalizedCurrentStats.hp}/${stats.maxHp}`, controls: adjustableStats?.hp },
    { label: "Stress", value: `${normalizedCurrentStats.stress}/${stats.maxStress}`, controls: adjustableStats?.stress },
    { label: "Hope", value: `${normalizedCurrentStats.hope}/${stats.maxHope}`, controls: adjustableStats?.hope },
    { label: "Proficiency", value: proficiency },
  ];

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="grid grid-cols-8 gap-1.5">
        {attributeItems.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <StatCard label={stat.label} value={stat.value} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-1.5">
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
