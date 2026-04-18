import { Level } from "./Character";
import { StatModifiers } from "./StatModifiers";

export type Domain = {
  id: string;
  level: Level;
  name: string;
  description: string;
  domainId: string;
  modifiers: StatModifiers;
};