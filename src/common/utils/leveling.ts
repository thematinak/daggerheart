import { Domain } from "../types/Domain";
import { Character, Stats } from "../types/Character";
import { CharacterTraitKey, LevelingData, LevelingOptionId, LevelingTier, LevelingTierKey } from "../types/Leveling";

export type LevelingOptionDefinition = {
  tier: LevelingTier;
  optionId: LevelingOptionId;
  label: string;
  description: string;
  maxUses: number;
};

export type LevelUpSelection = {
  tier: LevelingTier;
  optionId: LevelingOptionId;
  traits?: CharacterTraitKey[];
  experienceIndexes?: number[];
  domainCardId?: string;
  classId?: string;
  subclassNote?: string;
};

export const TRAIT_LABELS: Record<CharacterTraitKey, string> = {
  agility: "Agility",
  strength: "Strength",
  finesse: "Finesse",
  instinct: "Instinct",
  presence: "Presence",
  knowledge: "Knowledge",
};

export const TIER_OPTION_DEFINITIONS: Record<LevelingTier, LevelingOptionDefinition[]> = {
  2: [
    { tier: 2, optionId: "traitBoost", label: "Gain +1 to two unmarked traits", description: "Increase two unmarked character traits by +1 and mark them.", maxUses: 3 },
    { tier: 2, optionId: "hitPoint", label: "Gain one Hit Point slot", description: "Permanently gain one Hit Point slot.", maxUses: 2 },
    { tier: 2, optionId: "stress", label: "Gain one Stress slot", description: "Permanently gain one Stress slot.", maxUses: 2 },
    { tier: 2, optionId: "experienceBonus", label: "Gain +1 to two Experiences", description: "Permanently gain a +1 bonus to two Experiences.", maxUses: 1 },
    { tier: 2, optionId: "domainCard", label: "Gain an additional domain card", description: "Choose an additional domain card of your level or lower from an accessible domain, up to level 4.", maxUses: 1 },
    { tier: 2, optionId: "evasion", label: "Gain +1 Evasion", description: "Permanently gain a +1 bonus to your Evasion.", maxUses: 1 },
  ],
  3: [
    { tier: 3, optionId: "traitBoost", label: "Gain +1 to two unmarked traits", description: "Increase two unmarked character traits by +1 and mark them.", maxUses: 3 },
    { tier: 3, optionId: "hitPoint", label: "Gain one Hit Point slot", description: "Permanently gain one Hit Point slot.", maxUses: 2 },
    { tier: 3, optionId: "stress", label: "Gain one Stress slot", description: "Permanently gain one Stress slot.", maxUses: 2 },
    { tier: 3, optionId: "experienceBonus", label: "Gain +1 to two Experiences", description: "Permanently gain a +1 bonus to two Experiences.", maxUses: 1 },
    { tier: 3, optionId: "domainCard", label: "Gain an additional domain card", description: "Choose an additional domain card of your level or lower from an accessible domain, up to level 7.", maxUses: 1 },
    { tier: 3, optionId: "evasion", label: "Gain +1 Evasion", description: "Permanently gain a +1 bonus to your Evasion.", maxUses: 1 },
    { tier: 3, optionId: "subclass", label: "Take an upgraded subclass card", description: "Track an upgraded subclass card choice and gain +1 Proficiency. This blocks multiclass in the same tier block.", maxUses: 2 },
    { tier: 3, optionId: "multiclass", label: "Multiclass", description: "Track a multiclass choice for this tier block. This blocks the remaining multiclass slot and one subclass slot.", maxUses: 2 },
  ],
  4: [
    { tier: 4, optionId: "traitBoost", label: "Gain +1 to two unmarked traits", description: "Increase two unmarked character traits by +1 and mark them.", maxUses: 3 },
    { tier: 4, optionId: "hitPoint", label: "Gain one Hit Point slot", description: "Permanently gain one Hit Point slot.", maxUses: 2 },
    { tier: 4, optionId: "stress", label: "Gain one Stress slot", description: "Permanently gain one Stress slot.", maxUses: 2 },
    { tier: 4, optionId: "experienceBonus", label: "Gain +1 to two Experiences", description: "Permanently gain a +1 bonus to two Experiences.", maxUses: 1 },
    { tier: 4, optionId: "domainCard", label: "Gain an additional domain card", description: "Choose an additional domain card of your level or lower from an accessible domain.", maxUses: 1 },
    { tier: 4, optionId: "evasion", label: "Gain +1 Evasion", description: "Permanently gain a +1 bonus to your Evasion.", maxUses: 1 },
    { tier: 4, optionId: "subclass", label: "Take an upgraded subclass card", description: "Track an upgraded subclass card choice for this tier block. This blocks multiclass in the same tier block.", maxUses: 1 },
    { tier: 4, optionId: "proficiency", label: "Gain +1 Proficiency", description: "Increase your Proficiency by +1.", maxUses: 2 },
    { tier: 4, optionId: "multiclass", label: "Multiclass", description: "Track a multiclass choice for this tier block. This blocks the remaining multiclass slot and one subclass slot.", maxUses: 2 },
  ],
};

export const getTierFromLevel = (level: number) => {
  if (level <= 1) return 1;
  if (level <= 4) return 2;
  if (level <= 7) return 3;
  return 4;
};

export const getEligibleOptionTiers = (targetLevel: number): LevelingTier[] => {
  const tier = getTierFromLevel(targetLevel);
  if (tier === 4) return [2, 3, 4];
  if (tier === 3) return [2, 3];
  if (tier === 2) return [2];
  return [];
};

export const getTierKey = (tier: LevelingTier): LevelingTierKey => `tier${tier}`;

export const getAutomaticAchievementSummary = (targetLevel: number) => ({
  grantsExperience: [2, 5, 8].includes(targetLevel),
  grantsProficiency: [2, 5, 8].includes(targetLevel),
  clearsTraitMarks: [5, 8].includes(targetLevel),
});

export const getDomainCardCapForTier = (tier: LevelingTier, targetLevel: number) => {
  if (tier === 2) return Math.min(4, targetLevel);
  if (tier === 3) return Math.min(7, targetLevel);
  return targetLevel;
};

export const getOptionUses = (levelingData: LevelingData | undefined, tier: LevelingTier, optionId: LevelingOptionId) =>
  levelingData?.optionUses?.[getTierKey(tier)]?.[optionId] ?? 0;

export const getBlockedSubclassSlots = (levelingData: LevelingData | undefined, tier: Extract<LevelingTier, 3 | 4>) =>
  levelingData?.blockedSubclassSlots?.[getTierKey(tier)] ?? 0;

export const isMulticlassBlocked = (levelingData: LevelingData | undefined, tier: Extract<LevelingTier, 3 | 4>) =>
  Boolean(levelingData?.multiclassBlocked?.[getTierKey(tier)]);

export const getAccessibleDomainCards = ({
  allDomainCards,
  character,
  maxLevel,
}: {
  allDomainCards: Domain[];
  character: Character;
  maxLevel: number;
}) => {
  const accessibleDomains = new Set(character.class?.domains ?? []);
  const ownedIds = new Set(character.domainCards.map((domainCard) => String(domainCard.id)));

  return allDomainCards.filter((domainCard) =>
    accessibleDomains.has(domainCard.domainId) &&
    domainCard.level <= maxLevel &&
    !ownedIds.has(String(domainCard.id))
  );
};

export const getProjectedStatsAfterLevel = (character: Character, stats: Stats, targetLevel: number) => {
  const levelDelta = targetLevel - character.level;

  return {
    maxHp: stats.maxHp + levelDelta,
    maxStress: stats.maxStress + levelDelta,
    threshold1: stats.threshold1 + levelDelta,
    threshold2: stats.threshold2 + levelDelta,
    proficiency: character.proficiency + (getAutomaticAchievementSummary(targetLevel).grantsProficiency ? 1 : 0),
  };
};
