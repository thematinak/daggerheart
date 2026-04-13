export type CharacterTraitKey =
  | "agility"
  | "strength"
  | "finesse"
  | "instinct"
  | "presence"
  | "knowledge";

export type LevelingTier = 2 | 3 | 4;

export type LevelingTierKey = "tier2" | "tier3" | "tier4";

export type LevelingOptionId =
  | "traitBoost"
  | "hitPoint"
  | "stress"
  | "experienceBonus"
  | "domainCard"
  | "evasion"
  | "subclass"
  | "multiclass"
  | "proficiency";

export type LevelingData = {
  optionUses?: Partial<Record<LevelingTierKey, Partial<Record<LevelingOptionId, number>>>>;
  markedTraits?: CharacterTraitKey[];
  multiclassBlocked?: Partial<Record<LevelingTierKey, boolean>>;
  blockedSubclassSlots?: Partial<Record<LevelingTierKey, number>>;
  subclassNotes?: Partial<Record<LevelingTierKey, string[]>>;
  multiclassChoices?: Partial<Record<LevelingTierKey, string[]>>;
};
