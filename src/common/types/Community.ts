import { StatModifiers } from "./StatModifiers";

export type CommunityModifications = {
  id: string;
  name: string;
  description: string;
};

export type CommunityItem = {
  id: string;
  name: string;
  description: string;
  modifications: CommunityModifications;
  traits: string[];
  modifiers: StatModifiers;
};