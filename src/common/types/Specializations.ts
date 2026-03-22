import { StatModifiers } from "./StatModifiers";

export type SpecializationsItem = {
  id: string;
  name: string;
  description: string;
  modifications: SpecialModifications[];
};

export type SpecialModifications = {
  id: string;
  name: string;
  description: string;
  modifiers: StatModifiers;
};