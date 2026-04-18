import { Attributes } from "../../pages/create_character/components/AttributeGrid";
import { Ancestries } from "./Ancestries";
import { ArmorItem } from "./Armor";
import { BackpackItem } from "./BackpackItem";
import { CharacterClass } from "./CharacterClass";
import { Condition } from "./Condition";
import { CommunityItem } from "./Community";
import { Domain } from "./Domain";
import { Experience } from "./Experience";
import { LevelingData } from "./Leveling";
import { SpecializationsItem } from "./Specializations";
import { StatModifiers } from "./StatModifiers";
import { SelectedWeapons, WeaponItem } from "./Weapon";

export type Character = {
  id: string;
  user_id: number;
  level: Level;
  proficiency: number;
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
  experiences: Experience[];
  conditions: Condition[];
  domainCards: Domain[];
  levelingData: LevelingData;
  countedStats: Stats;
  currentStats: CurrentStats;
};

export type Stats = {
  evasion: number;
  maxArmor: number;
  maxHope: number;

  agility: number;
  strength: number;
  finesse: number;
  instinct: number;
  presence: number;
  knowledge: number;

  threshold1: number;
  threshold2: number;

  maxHp: number;
  maxStress: number;
};

export type CurrentStats = {
  hp: number;
  stress: number;
  armor: number;
  hope: number;
};

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type Tier = 1 | 2 | 3 | 4;