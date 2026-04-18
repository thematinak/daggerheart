import { CurrentStats, Level, Stats } from "../types/Character";
import { getTierFromLevel } from "./funks";

export type CharacterStatCommandTarget = "health" | "stress" | "armor" | "hope";

export type CharacterStatCommand = {
  action: "add" | "remove";
  target: CharacterStatCommandTarget;
  value: number;
};

export type ShortRestMove = "tendWounds" | "clearStress" | "repairArmor" | "prepare";
export type LongRestMove = "tendAllWounds" | "clearAllStress" | "repairAllArmor" | "prepare" | "workOnProject";

export type ShortRestSelection = {
  move: ShortRestMove;
  prepareWithParty?: boolean;
};

export type LongRestSelection = {
  move: LongRestMove;
  prepareWithParty?: boolean;
};

export type ShortRestResolution = {
  commands: CharacterStatCommand[];
  results: Array<{
    move: ShortRestMove;
    label: string;
    rolled: number | null;
    tier: number;
    requested: number;
    applied: number;
    action: "add" | "remove";
    target: CharacterStatCommandTarget;
    prepareWithParty: boolean;
  }>;
  tier: number;
};

export type LongRestResolution = {
  commands: CharacterStatCommand[];
  results: Array<{
    move: LongRestMove;
    label: string;
    applied: number;
    action: "add" | "remove" | "none";
    target: CharacterStatCommandTarget | "project";
    prepareWithParty: boolean;
  }>;
  tier: number;
};

type ResolveShortRestOptions = {
  level: Level;
  currentStats: CurrentStats;
  stats: Stats;
  selections: ShortRestSelection[];
  rollD4?: () => number;
};

type ResolveLongRestOptions = {
  level: Level;
  currentStats: CurrentStats;
  stats: Stats;
  selections: LongRestSelection[];
};

const SHORT_REST_MOVE_LABELS: Record<ShortRestMove, string> = {
  tendWounds: "Tend to Wounds",
  clearStress: "Clear Stress",
  repairArmor: "Repair Armor",
  prepare: "Prepare",
};

const LONG_REST_MOVE_LABELS: Record<LongRestMove, string> = {
  tendAllWounds: "Tend to All Wounds",
  clearAllStress: "Clear All Stress",
  repairAllArmor: "Repair All Armor",
  prepare: "Prepare",
  workOnProject: "Work on a Project",
};

const defaultRollD4 = () => Math.floor(Math.random() * 4) + 1;

const clampD4Roll = (value: number) => Math.min(4, Math.max(1, Math.floor(value)));

const applyPrepare = ({
  prepareWithParty,
  nextHope,
  maxHope,
}: {
  prepareWithParty: boolean;
  nextHope: number;
  maxHope: number;
}) => {
  const requested = prepareWithParty ? 2 : 1;
  const applied = Math.max(0, Math.min(requested, maxHope - nextHope));

  return { requested, applied };
};

export const resolveShortRest = ({
  level,
  currentStats,
  stats,
  selections,
  rollD4 = defaultRollD4,
}: ResolveShortRestOptions): ShortRestResolution => {
  const tier = getTierFromLevel(level);
  const nextStats = {
    hp: currentStats.hp ?? 0,
    stress: currentStats.stress ?? 0,
    armor: currentStats.armor ?? 0,
    hope: currentStats.hope ?? 0,
  };

  const results: ShortRestResolution["results"] = [];
  const commands: CharacterStatCommand[] = [];

  selections.forEach((selection) => {
    const prepareWithParty = selection.prepareWithParty ?? false;

    if (selection.move === "prepare") {
      const { requested, applied } = applyPrepare({
        prepareWithParty,
        nextHope: nextStats.hope,
        maxHope: stats.maxHope,
      });

      if (applied > 0) {
        commands.push({ action: "add", target: "hope", value: applied });
        nextStats.hope += applied;
      }

      results.push({
        move: selection.move,
        label: SHORT_REST_MOVE_LABELS[selection.move],
        rolled: null,
        tier,
        requested,
        applied,
        action: "add",
        target: "hope",
        prepareWithParty,
      });
      return;
    }

    const rolled = clampD4Roll(rollD4());
    const requested = rolled + tier;

    if (selection.move === "tendWounds") {
      const applied = Math.max(0, Math.min(requested, stats.maxHp - nextStats.hp));

      if (applied > 0) {
        commands.push({ action: "add", target: "health", value: applied });
        nextStats.hp += applied;
      }

      results.push({
        move: selection.move,
        label: SHORT_REST_MOVE_LABELS[selection.move],
        rolled,
        tier,
        requested,
        applied,
        action: "add",
        target: "health",
        prepareWithParty: false,
      });
      return;
    }

    if (selection.move === "clearStress") {
      const applied = Math.max(0, Math.min(requested, nextStats.stress));

      if (applied > 0) {
        commands.push({ action: "remove", target: "stress", value: applied });
        nextStats.stress -= applied;
      }

      results.push({
        move: selection.move,
        label: SHORT_REST_MOVE_LABELS[selection.move],
        rolled,
        tier,
        requested,
        applied,
        action: "remove",
        target: "stress",
        prepareWithParty: false,
      });
      return;
    }

    const applied = Math.max(0, Math.min(requested, stats.maxArmor - nextStats.armor));

    if (applied > 0) {
      commands.push({ action: "add", target: "armor", value: applied });
      nextStats.armor += applied;
    }

    results.push({
      move: selection.move,
      label: SHORT_REST_MOVE_LABELS[selection.move],
      rolled,
      tier,
      requested,
      applied,
      action: "add",
      target: "armor",
      prepareWithParty: false,
    });
  });

  return { commands, results, tier };
};

export const resolveLongRest = ({
  level,
  currentStats,
  stats,
  selections,
}: ResolveLongRestOptions): LongRestResolution => {
  const tier = getTierFromLevel(level);
  const nextStats = {
    hp: currentStats.hp ?? 0,
    stress: currentStats.stress ?? 0,
    armor: currentStats.armor ?? 0,
    hope: currentStats.hope ?? 0,
  };

  const results: LongRestResolution["results"] = [];
  const commands: CharacterStatCommand[] = [];

  selections.forEach((selection) => {
    const prepareWithParty = selection.prepareWithParty ?? false;

    if (selection.move === "prepare") {
      const { applied } = applyPrepare({
        prepareWithParty,
        nextHope: nextStats.hope,
        maxHope: stats.maxHope,
      });

      if (applied > 0) {
        commands.push({ action: "add", target: "hope", value: applied });
        nextStats.hope += applied;
      }

      results.push({
        move: selection.move,
        label: LONG_REST_MOVE_LABELS[selection.move],
        applied,
        action: "add",
        target: "hope",
        prepareWithParty,
      });
      return;
    }

    if (selection.move === "workOnProject") {
      results.push({
        move: selection.move,
        label: LONG_REST_MOVE_LABELS[selection.move],
        applied: 0,
        action: "none",
        target: "project",
        prepareWithParty: false,
      });
      return;
    }

    if (selection.move === "tendAllWounds") {
      const applied = Math.max(0, stats.maxHp - nextStats.hp);

      if (applied > 0) {
        commands.push({ action: "add", target: "health", value: applied });
        nextStats.hp += applied;
      }

      results.push({
        move: selection.move,
        label: LONG_REST_MOVE_LABELS[selection.move],
        applied,
        action: "add",
        target: "health",
        prepareWithParty: false,
      });
      return;
    }

    if (selection.move === "clearAllStress") {
      const applied = Math.max(0, nextStats.stress);

      if (applied > 0) {
        commands.push({ action: "remove", target: "stress", value: applied });
        nextStats.stress = 0;
      }

      results.push({
        move: selection.move,
        label: LONG_REST_MOVE_LABELS[selection.move],
        applied,
        action: "remove",
        target: "stress",
        prepareWithParty: false,
      });
      return;
    }

    const applied = Math.max(0, stats.maxArmor - nextStats.armor);

    if (applied > 0) {
      commands.push({ action: "add", target: "armor", value: applied });
      nextStats.armor += applied;
    }

    results.push({
      move: selection.move,
      label: LONG_REST_MOVE_LABELS[selection.move],
      applied,
      action: "add",
      target: "armor",
      prepareWithParty: false,
    });
  });

  return { commands, results, tier };
};

export const SHORT_REST_MOVE_OPTIONS: Array<{
  value: ShortRestMove;
  label: string;
  description: string;
}> = [
  {
    value: "tendWounds",
    label: "Tend to Wounds",
    description: "Recover HP equal to 1d4 + your tier.",
  },
  {
    value: "clearStress",
    label: "Clear Stress",
    description: "Clear Stress equal to 1d4 + your tier.",
  },
  {
    value: "repairArmor",
    label: "Repair Armor",
    description: "Recover Armor Slots equal to 1d4 + your tier.",
  },
  {
    value: "prepare",
    label: "Prepare",
    description: "Gain 1 Hope, or 2 Hope if you prepare with party members.",
  },
];

export const LONG_REST_MOVE_OPTIONS: Array<{
  value: LongRestMove;
  label: string;
  description: string;
}> = [
  {
    value: "tendAllWounds",
    label: "Tend to All Wounds",
    description: "Recover all missing HP.",
  },
  {
    value: "clearAllStress",
    label: "Clear All Stress",
    description: "Remove all current Stress.",
  },
  {
    value: "repairAllArmor",
    label: "Repair All Armor",
    description: "Recover all missing Armor Slots.",
  },
  {
    value: "prepare",
    label: "Prepare",
    description: "Gain 1 Hope, or 2 Hope if you prepare with party members.",
  },
  {
    value: "workOnProject",
    label: "Work on a Project",
    description: "Reserve this downtime action for project progress logic.",
  },
];
