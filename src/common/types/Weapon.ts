import { StatModifiers } from "./StatModifiers";

export type SelectedWeapons = {
  primary: WeaponItem | null;
  secondary: WeaponItem | null;
};

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

  modifiers: StatModifiers;
};