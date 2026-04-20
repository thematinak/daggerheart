import { Tier } from "./Character";
import { StatModifiers } from "./StatModifiers";

export type SelectedWeapons = {
  primary: WeaponItem | null;
  secondary: WeaponItem | null;
};

export type WeaponItem = {
  id: string;
  name: string;
  description?: string;

  attribute: "agility" | "finesse" | "instinct" | "presence" | "strength" | "knowledge" | "spellcast" ;
  range: "melee" | "very_close" | "close" | "far" | "very_far";
  damage: Record<number, number> & { flat?: number };
  burden: "one-handed" | "two-handed";

  tier: Tier;
  slot: "primary" | "secondary";

  ability?: string;
  abilityDescription?: string;

  modifiers: StatModifiers;
};