import { StatModifiers } from "./StatModifiers";

export type Condition = {
  id: string;
  name: string;
  description: string;
  modifiers: StatModifiers;
};
