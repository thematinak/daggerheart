import { Attributes } from "../../pages/create_character/components/AttributeGrid";
import { Ancestries } from "../types/Ancestries";
import { ArmorItem } from "../types/Armor";
import { BackpackItem } from "../types/BackpackItem";
import { CurrentStats } from "../types/Character";
import { CharacterClass } from "../types/CharacterClass";
import { CommunityItem } from "../types/Community";
import { Domain } from "../types/Domain";
import { Experience } from "../types/Experience";
import { SpecializationsItem } from "../types/Specializations";
import { StatModifiers } from "../types/StatModifiers";
import { WeaponItem } from "../types/Weapon";

export type CharacterCommand =
  | { action: "add" | "remove"; target: "bank"; value: number }
  | { action: "add"; target: "item"; id: string; quantity: number }
  | { action: "add" | "remove" | "equip"; target: "weapon" | "armor"; id: string };

export const postCharacterCommands = async (characterId: string, commands: CharacterCommand[]) => {
  const response = await fetch("http://pecen.eu/daggerheart/api1/character.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      character_id: characterId,
      commands,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to save character changes");
  }

  return data;
};

export const fetchAncestries: () => Promise<Ancestries[]> = async () => {
  const res = await fetch("http://pecen.eu/daggerheart/api1/ancestries.php");
  return res.json();
}

export const fetchCharacterClasses: () => Promise<CharacterClass[]> = async () => {
  const res = await fetch("http://pecen.eu/daggerheart/api1/classes.php");
  return res.json();
}

export const fetchCommunities: () => Promise<CommunityItem[]> = async () => {
  const res = await fetch("http://pecen.eu/daggerheart/api1/communities.php");
  return res.json();
}

export const fetchDomainCards: () => Promise<Domain[]> = async () => {
  const res = await fetch("http://pecen.eu/daggerheart/api1/domain_cards.php");
  return res.json();
}

export const fetchSpecializations: () => Promise<SpecializationsItem[]> = async () => {
  const res = await fetch("http://pecen.eu/daggerheart/api1/specializations.php");
  return res.json();
}

export const fetchBackpackItems: () => Promise<BackpackItem[]> = async () => {
  const res = await fetch("http://pecen.eu/daggerheart/api1/backpack_items.php");
  return res.json();
}


export const fetchWeapons: () => Promise<WeaponItem[]> = async () => {
  const res = await fetch("http://pecen.eu/daggerheart/api1/weapons.php");
  return res.json();
}

export const fetchArmor: () => Promise<ArmorItem[]> = async () => {
  const res = await fetch("http://pecen.eu/daggerheart/api1/armor.php");
  return res.json();
}

export const registerUser: (username: string) => Promise<{id: number, username: string, error?: string}> = async (username: string) => {
    const response = await fetch(`http://pecen.eu/daggerheart/api1/create_user.php`, {
      method: "POST",
      body: JSON.stringify({ username: username })
    });

    return response.json();
}

export type CharacterDetailResponse = {
  id: string;
  userId: number;
  level: number;
  proficiency: number;
  bank: number;
  name: string;
  description: string;
  class: {
    id: string;
    name: string;
    description: string;
    baseHp: number;
    baseEvasion: number;
    modifiers: StatModifiers;
    hopeFeature: string;
    hopeFeatureDescription: string;
    classItem: string;
  };
  specialization: {
    id: string;
    name: string;
    description: string;
  };
  ancestry: {
    id: string;
    name: string;
    description: string;
    modifiers: StatModifiers;
  };
  community: {
    id: string;
    name: string;
    description: string;
    modifiers: StatModifiers;
  };
  attributes: Partial<Attributes>;
  customAttributes: StatModifiers;
  experiences: Experience[];
  weapons: {
    primary: WeaponItem | null;
    secondary: WeaponItem | null;
  };
  armor: ArmorItem | null;
  weaponInventory: WeaponItem[];
  armorInventory: ArmorItem[];
  domainCards: Array<{
    id: string | number;
    level: number;
    name: string;
    description: string;
    domainId: string;
  }>;
  backpack: BackpackItem[];
  currentStats: CurrentStats;
};

export const fetchUserCharacters: (userId: string) => Promise<CharacterDetailResponse> = async (userId: string) => {
  const response = await fetch(`http://pecen.eu/daggerheart/api1/character_detail.php?id=${userId}`);
  return response.json();
}

export const loginUser: (username: string) => Promise<{id: number, username: string, error?: string}> = async (username: string) => {
    const response = await fetch(`http://pecen.eu/daggerheart/api1/login_user.php`, {
      method: "POST",
      body: JSON.stringify({ username: username })
    });

    return await response.json();
}
