import { StatModifiers } from "./StatModifiers";

export type Domain = {
  id: string;
  name: string;
  description: string;
  modifiers: StatModifiers;
};