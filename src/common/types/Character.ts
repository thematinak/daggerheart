import { Attributes } from "../../pages/create_character/components/AttributeGrid";
import { Ancestries } from "./Ancestries";
import { ArmorItem } from "./Armor";
import { BackpackItem } from "./BackpackItem";
import { CharacterClass } from "./CharacterClass";
import { CommunityItem } from "./Community";
import { Domain } from "./Domain";
import { Experience } from "./Experience";
import { SpecializationsItem } from "./Specializations";
import { StatModifiers } from "./StatModifiers";
import { SelectedWeapons, WeaponItem } from "./Weapon";

export type Character = {
  user_id: number;
  level: number;
  bank: number;
  name: string;
  description: string;
  class: CharacterClass | null;
  backpack: BackpackItem[];
  specialization: SpecializationsItem | null;
  ancestry: Ancestries | null;
  community: CommunityItem | null;
  attributes: Attributes;
  customAttributes: StatModifiers;
  weapons: SelectedWeapons;
  weaponInventory: WeaponItem[];
  armor: ArmorItem | null;
  armorInventory: ArmorItem[];
  primaryExperience: Experience;
  secondaryExperience: Experience;
  domainCards: Domain[];
  countedStats: Stats;
};

export type Stats = {
  evasion: number;
  maxArmor: number;
  armor: number;

  agility: number;
  strength: number;
  finesse: number;
  instinct: number;
  presence: number;
  knowledge: number;

  threshold1: number;
  threshold2: number;

  maxHp: number;
  hp: number;
  maxStress: number;
  stress: number;
};
