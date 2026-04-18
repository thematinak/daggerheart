import React, { useEffect, useMemo, useState } from "react";
import ModalCard from "../../../common/components/ModalCard";
import { useCommonData, useNotifications } from "../../../common/contexts/CommonDataProvider";
import Eyebrow from "../../../common/components/Eyebrow";
import styles from "../../../common/types/cssColor";
import { Character, Level } from "../../../common/types/Character";
import { CharacterTraitKey, LevelingOptionId, LevelingTier } from "../../../common/types/Leveling";
import {
  LevelUpSelection,
  TRAIT_LABELS,
  TIER_OPTION_DEFINITIONS,
  getProjectedStatsAfterLevel,
  getAccessibleDomainCards,
  getAutomaticAchievementSummary,
  getBlockedSubclassSlots,
  getDomainCardCapForTier,
  getEligibleOptionTiers,
  getOptionUses,
  isMulticlassBlocked,
} from "../../../common/utils/leveling";
import { buildStatsFromCharacter } from "../../../common/components/StatsBar";

type LevelUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  onCharacterUpdated: () => Promise<void>;
};

const EMPTY_SELECTIONS: Array<LevelUpSelection | null> = [null, null];
const TRAIT_KEYS = Object.keys(TRAIT_LABELS) as CharacterTraitKey[];

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, character, onCharacterUpdated }) => {
  const { commonData: { list: { domainCards, characterClasses } } } = useCommonData();
  const { showError, showInfo } = useNotifications();
  const [selectedAdvancements, setSelectedAdvancements] = useState<Array<LevelUpSelection | null>>(EMPTY_SELECTIONS);
  const [rewardDomainCardId, setRewardDomainCardId] = useState("");
  const [achievementExperience, setAchievementExperience] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSelectedAdvancements(EMPTY_SELECTIONS);
      setRewardDomainCardId("");
      setAchievementExperience({ name: "", description: "" });
    }
  }, [isOpen]);

  const targetLevel = Math.min(character.level + 1, 10) as Level;
  const automaticAchievement = useMemo(() => getAutomaticAchievementSummary(targetLevel), [targetLevel]);
  const eligibleTiers = useMemo(() => getEligibleOptionTiers(targetLevel), [targetLevel]);
  const baseStats = useMemo(() => buildStatsFromCharacter(character), [character]);
  const projectedStats = useMemo(
    () => getProjectedStatsAfterLevel(character, baseStats, targetLevel),
    [baseStats, character, targetLevel]
  );

  const buildOptionEntries = (slotIndex: number) =>
    eligibleTiers.flatMap((tier) =>
      TIER_OPTION_DEFINITIONS[tier].map((definition) => {
        const baseUses = getOptionUses(character.levelingData, tier, definition.optionId);
        const pendingUses = selectedAdvancements.reduce((count, selection, index) => {
          if (index === slotIndex || !selection) {
            return count;
          }

          return selection.tier === tier && selection.optionId === definition.optionId ? count + 1 : count;
        }, 0);

        const blockedSubclassSlots = tier >= 3 ? getBlockedSubclassSlots(character.levelingData, tier as 3 | 4) : 0;
        const pendingMulticlassInTier = selectedAdvancements.some((selection, index) =>
          index !== slotIndex &&
          selection?.tier === tier &&
          selection.optionId === "multiclass"
        );
        const pendingSubclassInTier = selectedAdvancements.some((selection, index) =>
          index !== slotIndex &&
          selection?.tier === tier &&
          selection.optionId === "subclass"
        );

        const subclassLimit = definition.optionId === "subclass"
          ? Math.max(0, definition.maxUses - blockedSubclassSlots - (pendingMulticlassInTier ? 1 : 0))
          : definition.maxUses;

        const disabled =
          (definition.optionId === "subclass" && (
            (tier >= 3 && isMulticlassBlocked(character.levelingData, tier as 3 | 4)) ||
            pendingMulticlassInTier
          )) ||
          (definition.optionId === "multiclass" && (
            (tier >= 3 && isMulticlassBlocked(character.levelingData, tier as 3 | 4)) ||
            pendingSubclassInTier ||
            pendingMulticlassInTier ||
            baseUses >= 1
          )) ||
          baseUses + pendingUses >= (definition.optionId === "subclass" ? subclassLimit : definition.maxUses);

        const remaining = Math.max(
          0,
          (definition.optionId === "subclass" ? subclassLimit : definition.maxUses) - baseUses - pendingUses
        );

        return {
          ...definition,
          disabled,
          remaining,
        };
      })
    );

  const optionEntriesBySlot = [buildOptionEntries(0), buildOptionEntries(1)];

  const getReservedDomainIds = (excludeSlot?: number) => {
    const ids = new Set<string>();

    if (rewardDomainCardId) {
      ids.add(rewardDomainCardId);
    }

    selectedAdvancements.forEach((selection, index) => {
      if (index === excludeSlot || !selection?.domainCardId) {
        return;
      }

      ids.add(selection.domainCardId);
    });

    return ids;
  };

  const getDomainChoices = (maxLevel: number, excludeSlot?: number) =>
    getAccessibleDomainCards({ allDomainCards: domainCards, character, maxLevel })
      .filter((domainCard) => !getReservedDomainIds(excludeSlot).has(String(domainCard.id)));

  const getAvailableTraits = (slotIndex: number) => {
    const marked = new Set<CharacterTraitKey>((automaticAchievement.clearsTraitMarks ? [] : character.levelingData.markedTraits) ?? []);

    selectedAdvancements.forEach((selection, index) => {
      if (index === slotIndex || selection?.optionId !== "traitBoost") {
        return;
      }

      selection.traits?.forEach((trait) => marked.add(trait));
    });

    return TRAIT_KEYS.filter((trait) => !marked.has(trait) && character.attributes[trait] !== null);
  };

  const isValidSelection = useMemo(() => {
    if (character.level >= 10 || !rewardDomainCardId) {
      return false;
    }

    if (automaticAchievement.grantsExperience && achievementExperience.name.trim() === "") {
      return false;
    }

    return selectedAdvancements.every((selection) => {
      if (!selection) {
        return false;
      }

      if (selection.optionId === "traitBoost") {
        return selection.traits?.length === 2 && selection.traits[0] !== selection.traits[1];
      }

      if (selection.optionId === "experienceBonus") {
        return selection.experienceIndexes?.length === 2 && selection.experienceIndexes[0] !== selection.experienceIndexes[1];
      }

      if (selection.optionId === "domainCard") {
        return Boolean(selection.domainCardId);
      }

      if (selection.optionId === "multiclass") {
        return Boolean(selection.classId);
      }

      if (selection.optionId === "subclass") {
        return Boolean(selection.subclassNote?.trim());
      }

      return true;
    });
  }, [achievementExperience.name, automaticAchievement.grantsExperience, character.level, rewardDomainCardId, selectedAdvancements]);

  const updateSelection = (slotIndex: number, next: LevelUpSelection | null) => {
    setSelectedAdvancements((current) => current.map((selection, index) => (index === slotIndex ? next : selection)));
  };

  const updateSelectionField = <K extends keyof LevelUpSelection>(slotIndex: number, field: K, value: LevelUpSelection[K]) => {
    setSelectedAdvancements((current) =>
      current.map((selection, index) => {
        if (index !== slotIndex || !selection) {
          return selection;
        }

        return {
          ...selection,
          [field]: value,
        };
      })
    );
  };

  const handleApplyLevelUp = async () => {
    if (!isValidSelection) {
      showError("Complete every required level-up choice before applying.", "Level Up Incomplete");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("http://pecen.eu/daggerheart/api1/level_up.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          character_id: character.id,
          targetLevel,
          rewardDomainCardId,
          achievementExperience: automaticAchievement.grantsExperience ? achievementExperience : null,
          selectedAdvancements,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to level up character.");
      }

      await onCharacterUpdated();
      onClose();
      showInfo(`${character.name} advanced to level ${targetLevel}.`, "Level Up Complete");
    } catch (error: any) {
      showError(error.message || "Failed to level up character.", "Level Up Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalCard
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Character Progression"
      title={character.level >= 10 ? "Max Level Reached" : `Level Up To ${targetLevel}`}
      maxWidthClassName="max-w-5xl"
    >
      <div className="grid gap-5">
        <section className={styles.tokens.panel.base}>
          <Eyebrow eyebrow="Overview" />
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            Choose two advancement options with remaining slots, apply the level achievement for this level,
            and select your reward domain card.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryPill label="Current Level" value={String(character.level)} />
            <SummaryPill label="Next Level" value={String(targetLevel)} />
            <SummaryPill label="HP After Level" value={String(projectedStats.maxHp)} />
            <SummaryPill label="Stress After Level" value={String(projectedStats.maxStress)} />
            <SummaryPill label="Thresholds After Level" value={`${projectedStats.threshold1}/${projectedStats.threshold2}`} />
          </div>
        </section>

        <section className={styles.tokens.panel.base}>
          <Eyebrow eyebrow="Automatic" />
          <h4 className="mt-2 text-lg font-bold text-[var(--text-primary)]">Level achievements</h4>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className={styles.tokens.panel.muted}>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                <li>Level increases to {targetLevel}.</li>
                <li>Damage thresholds increase naturally because thresholds include current level.</li>
                <li>Choose one domain card of level {targetLevel} or lower from an accessible domain.</li>
                {automaticAchievement.grantsProficiency ? <li>Gain +1 permanent Proficiency.</li> : null}
                {automaticAchievement.clearsTraitMarks ? <li>Clear all previously marked traits before applying new trait boosts.</li> : null}
                {automaticAchievement.grantsExperience ? <li>Add one new Experience at +2.</li> : null}
              </ul>
            </div>

            <div className={styles.tokens.panel.muted}>
              <div className="text-sm font-semibold text-[var(--text-primary)]">Reward domain card</div>
              <select
                value={rewardDomainCardId}
                onChange={(event) => setRewardDomainCardId(event.target.value)}
                className={`${styles.tokens.input.base} ${styles.tokens.input.focus} mt-3`}
              >
                <option value="">Select domain card</option>
                {getDomainChoices(targetLevel).map((domainCard) => (
                  <option key={`reward-${domainCard.id}`} value={domainCard.id}>
                    {domainCard.name} · Level {domainCard.level}
                  </option>
                ))}
              </select>

              {automaticAchievement.grantsExperience ? (
                <div className="mt-4 grid gap-3">
                  <input
                    type="text"
                    value={achievementExperience.name}
                    onChange={(event) => setAchievementExperience((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Experience name"
                    className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                  />
                  <textarea
                    value={achievementExperience.description}
                    onChange={(event) => setAchievementExperience((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Experience description"
                    rows={3}
                    className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className={styles.tokens.panel.base}>
          <Eyebrow eyebrow="Advancements" />
          <h4 className="mt-2 text-lg font-bold text-[var(--text-primary)]">Choose two options</h4>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {[0, 1].map((slotIndex) => {
              const selection = selectedAdvancements[slotIndex];
              const slotOptions = optionEntriesBySlot[slotIndex];
              const selectedOption = slotOptions.find((option) => option.tier === selection?.tier && option.optionId === selection?.optionId);
              const availableTraits = getAvailableTraits(slotIndex);

              return (
                <section key={slotIndex} className={styles.tokens.panel.muted}>
                  <div className="mb-4">
                    <div className={styles.tokens.text.label}>Advancement Slot {slotIndex + 1}</div>
                    <h5 className="mt-1 text-lg font-bold text-[var(--text-primary)]">Choose one advancement</h5>
                  </div>

                  <div className="grid gap-3">
                    <select
                      value={selection ? `${selection.tier}:${selection.optionId}` : ""}
                      onChange={(event) => {
                        const [tierValue, optionId] = event.target.value.split(":") as [string, LevelingOptionId];
                        if (!tierValue || !optionId) {
                          updateSelection(slotIndex, null);
                          return;
                        }

                        updateSelection(slotIndex, {
                          tier: Number(tierValue) as LevelingTier,
                          optionId,
                        });
                      }}
                      className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                    >
                      <option value="">Select advancement</option>
                      {slotOptions.map((option) => (
                        <option
                          key={`${slotIndex}-${option.tier}-${option.optionId}`}
                          value={`${option.tier}:${option.optionId}`}
                          disabled={option.disabled}
                        >
                          {`Tier ${option.tier} · ${option.label} (${option.remaining} left)`}
                        </option>
                      ))}
                    </select>

                    {selectedOption ? (
                      <div className={styles.tokens.panel.base}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-[var(--text-primary)]">{selectedOption.label}</div>
                            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">{selectedOption.description}</p>
                          </div>
                          <span className={`${styles.tokens.pill.base} ${styles.tokens.pill.accent}`}>
                            Tier {selectedOption.tier}
                          </span>
                        </div>

                        {selection?.optionId === "traitBoost" ? (
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {[0, 1].map((traitIndex) => (
                              <select
                                key={`trait-${traitIndex}`}
                                value={selection.traits?.[traitIndex] ?? ""}
                                onChange={(event) => {
                                  const nextTraits = [...(selection.traits ?? ["", ""])] as Array<CharacterTraitKey | "">;
                                  nextTraits[traitIndex] = event.target.value as CharacterTraitKey;
                                  updateSelectionField(slotIndex, "traits", nextTraits.filter((value): value is CharacterTraitKey => value !== ""));
                                }}
                                className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                              >
                                <option value="">Select trait</option>
                                {availableTraits
                                  .concat(selection.traits?.[traitIndex] && !availableTraits.includes(selection.traits[traitIndex]) ? [selection.traits[traitIndex]] : [])
                                  .map((trait) => (
                                    <option key={`${slotIndex}-${traitIndex}-${trait}`} value={trait}>
                                      {TRAIT_LABELS[trait]}
                                    </option>
                                  ))}
                              </select>
                            ))}
                          </div>
                        ) : null}

                        {selection?.optionId === "experienceBonus" ? (
                          <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {[0, 1].map((experienceSlot) => (
                              <select
                                key={`exp-${experienceSlot}`}
                                value={selection.experienceIndexes?.[experienceSlot] ?? ""}
                                onChange={(event) => {
                                  const nextIndexes = [...(selection.experienceIndexes ?? ["", ""])] as Array<number | "">;
                                  nextIndexes[experienceSlot] = event.target.value === "" ? "" : Number(event.target.value);
                                  updateSelectionField(slotIndex, "experienceIndexes", nextIndexes.filter((value): value is number => value !== ""));
                                }}
                                className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                              >
                                <option value="">Select experience</option>
                                {character.experiences.map((experience, experienceIndex) => (
                                  <option key={`${slotIndex}-${experienceIndex}`} value={experienceIndex}>
                                    {experience.name || `Experience ${experienceIndex + 1}`} (+{experience.bonus})
                                  </option>
                                ))}
                              </select>
                            ))}
                          </div>
                        ) : null}

                        {selection?.optionId === "domainCard" ? (
                          <div className="mt-4">
                            <select
                              value={selection.domainCardId ?? ""}
                              onChange={(event) => updateSelectionField(slotIndex, "domainCardId", event.target.value)}
                              className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                            >
                              <option value="">Select additional domain card</option>
                              {getDomainChoices(getDomainCardCapForTier(selection.tier, targetLevel), slotIndex).map((domainCard) => (
                                <option key={`${slotIndex}-domain-${domainCard.id}`} value={domainCard.id}>
                                  {domainCard.name} · Level {domainCard.level}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : null}

                        {selection?.optionId === "multiclass" ? (
                          <div className="mt-4">
                            <select
                              value={selection.classId ?? ""}
                              onChange={(event) => updateSelectionField(slotIndex, "classId", event.target.value)}
                              className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                            >
                              <option value="">Select multiclass</option>
                              {characterClasses
                                .filter((characterClass) => characterClass.id !== character.class?.id)
                                .map((characterClass) => (
                                  <option key={`${slotIndex}-class-${characterClass.id}`} value={characterClass.id}>
                                    {characterClass.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                        ) : null}

                        {selection?.optionId === "subclass" ? (
                          <div className="mt-4">
                            <textarea
                              value={selection.subclassNote ?? ""}
                              onChange={(event) => updateSelectionField(slotIndex, "subclassNote", event.target.value)}
                              rows={3}
                              placeholder="Describe the upgraded subclass card you are taking"
                              className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                            />
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        {character.level >= 10 ? (
          <section className={styles.tokens.panel.base}>
            <div className="text-sm font-semibold text-[var(--text-primary)]">This character is already at level 10.</div>
          </section>
        ) : null}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
        >
          Close
        </button>
        <button
          type="button"
          onClick={handleApplyLevelUp}
          disabled={!isValidSelection || isSubmitting || character.level >= 10}
          className={`${styles.tokens.button.base} ${styles.tokens.button.primary} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isSubmitting ? "Applying..." : `Apply Level ${targetLevel}`}
        </button>
      </div>
    </ModalCard>
  );
};

const SummaryPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3">
    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</div>
    <div className="mt-1 text-sm font-bold text-[var(--text-primary)]">{value}</div>
  </div>
);

export default LevelUpModal;
