import { StatModifiers } from "./StatModifiers";

export type BackpackItem = {
  id: string;
  name: string;
  roll: number;
  description: string;
  modifiers: StatModifiers;
};