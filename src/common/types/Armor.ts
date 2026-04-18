import { Tier } from "./Character";
import { StatModifiers } from "./StatModifiers";

export type ArmorItem = {
  id: string;
  name: string;
  tier: Tier;
  threshold1: number;
  threshold2: number;
  baseScore: number; // 0-2 light, 3-4 medium, 5+ heavy
  modifiers: StatModifiers;
  ability?: string;
  abilityDescription?: string;
};