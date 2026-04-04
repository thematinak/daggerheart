import { StatModifiers } from "./StatModifiers";

export type Domain = {
  id: string;
  level: number;
  name: string;
  description: string;
  domainId: string;
  modifiers: StatModifiers;
};