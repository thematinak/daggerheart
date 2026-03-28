import { BackpackItem } from "./BackpackItem";
import { StatModifiers } from "./StatModifiers";

export type CharacterClass = {
  id: string;
  name: string;
  description: string;
  baseHp: number;
  baseEvasion: number;
  domains: string[];
  modifiers: StatModifiers;
  classItem: BackpackItem;
  hopeFeature: string;
  hopeFeatureDescription: string;
};



