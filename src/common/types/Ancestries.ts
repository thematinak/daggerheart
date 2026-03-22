import { StatModifiers } from "./StatModifiers";

export type AncestrieModifications = {
  id: string;
  name: string;
  description: string;
};

export type Ancestries = {
  id: string;
  name: string;
  description: string;
  modifications: AncestrieModifications[];
  modifiers: StatModifiers;
};