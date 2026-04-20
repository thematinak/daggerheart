import React, { useEffect, useMemo, useState } from "react";
import ModalCard from "../../../common/components/ModalCard";
import styles from "../../../common/types/cssColor";
import Eyebrow from "../../../common/components/Eyebrow";
import { Character, Stats } from "../../../common/types/Character";
import {
  SHORT_REST_MOVE_OPTIONS,
  ShortRestMove,
  resolveShortRest,
} from "../../../common/utils/shortRest";
import { useNotifications } from "../../../common/contexts/CommonDataProvider";
import { getTierFromLevel } from "../../../common/utils/funks";
import { postCharacterCommands } from "../../../common/endponts/common";

type ShortRestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  stats: Stats;
  onCharacterUpdated: () => Promise<void>;
};

const DEFAULT_MOVES: Array<ShortRestMove | ""> = ["", ""];

const ShortRestModal: React.FC<ShortRestModalProps> = ({ isOpen, onClose, character, stats, onCharacterUpdated }) => {
  const [selectedMoves, setSelectedMoves] = useState<Array<ShortRestMove | "">>(DEFAULT_MOVES);
  const [prepareWithParty, setPrepareWithParty] = useState([false, false]);
  const [isApplying, setIsApplying] = useState(false);
  const { showError } = useNotifications();
  const [results, setResults] = useState<ReturnType<typeof resolveShortRest>["results"]>([]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedMoves(DEFAULT_MOVES);
      setPrepareWithParty([false, false]);
      setIsApplying(false);
      setResults([]);
    }
  }, [isOpen]);

  const tier = useMemo(() => getTierFromLevel(character.level), [character.level]);
  const hasValidSelection = selectedMoves.every((move) => move !== "");

  const updateMove = (index: number, move: ShortRestMove | "") => {
    setSelectedMoves((current) => current.map((item, itemIndex) => (itemIndex === index ? move : item)));

    if (move !== "prepare") {
      setPrepareWithParty((current) => current.map((item, itemIndex) => (itemIndex === index ? false : item)));
    }
  };

  const handleApplyShortRest = async () => {
    if (!hasValidSelection) {
      showError("Choose two short rest moves.");
      return;
    }

    const selections = selectedMoves.map((move, index) => ({
      move: move as ShortRestMove,
      prepareWithParty: move === "prepare" ? prepareWithParty[index] : false,
    }));

    const resolution = resolveShortRest({
      level: character.level,
      currentStats: character.currentStats,
      stats,
      selections,
    });

    try {
      setIsApplying(true);

      if (resolution.commands.length > 0) {
        await postCharacterCommands(character.id, resolution.commands);
        await onCharacterUpdated();
      }

      setResults(resolution.results);
      onClose();
    } catch (applyError: any) {
      showError(applyError.message || "Failed to apply short rest.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <ModalCard
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Character Action"
      title="Short Rest"
      maxWidthClassName="max-w-4xl"
    >
      <div className="grid gap-5">
        <div className={styles.tokens.panel.base}>
          <Eyebrow eyebrow="Rules" />
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            Choose two moves for this short rest. You can pick the same move twice. Recovery moves use
            {" "}
            <span className="font-semibold text-[var(--text-primary)]">1d4 + tier</span>
            {" "}
            and your current tier is
            {" "}
            <span className="font-semibold text-[var(--text-primary)]">Tier {tier}</span>
            .
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1].map((slotIndex) => {
            const selectedMove = selectedMoves[slotIndex];

            return (
              <section key={slotIndex} className={styles.tokens.panel.base}>
                <div className="mb-4">
                  <div className={styles.tokens.text.label}>Move Slot {slotIndex + 1}</div>
                  <h4 className="mt-2 text-lg font-bold text-[var(--text-primary)]">Choose a downtime move</h4>
                </div>

                <div className="grid gap-3">
                  <select
                    value={selectedMove}
                    onChange={(event) => updateMove(slotIndex, event.target.value as ShortRestMove | "")}
                    className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                  >
                    <option value="">Select move</option>
                    {SHORT_REST_MOVE_OPTIONS.map((option) => (
                      <option key={`${slotIndex}-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {selectedMove ? (
                    <div className={styles.tokens.panel.muted}>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        {SHORT_REST_MOVE_OPTIONS.find((option) => option.value === selectedMove)?.label}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                        {SHORT_REST_MOVE_OPTIONS.find((option) => option.value === selectedMove)?.description}
                      </p>

                      {selectedMove === "prepare" ? (
                        <label className="mt-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <input
                            type="checkbox"
                            checked={prepareWithParty[slotIndex]}
                            onChange={(event) =>
                              setPrepareWithParty((current) =>
                                current.map((value, index) => (index === slotIndex ? event.target.checked : value))
                              )
                            }
                          />
                          Prepare with party members for 2 Hope instead of 1.
                        </label>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>

        {results.length > 0 ? (
          <section className={styles.tokens.panel.base}>
            <div className="mb-4">
              <Eyebrow eyebrow="Result" />
              <h4 className="mt-2 text-lg font-bold text-[var(--text-primary)]">Short rest outcome</h4>
            </div>

            <div className="grid gap-3">
              {results.map((result, index) => (
                <div key={`${result.move}-${index}`} className={styles.tokens.panel.muted}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-[var(--text-primary)]">{result.label}</div>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {result.rolled === null
                          ? `Prepared ${result.prepareWithParty ? "with the party" : "alone"} for ${result.applied} Hope.`
                          : `Rolled ${result.rolled} + Tier ${result.tier} = ${result.requested}; applied ${result.applied}.`}
                      </p>
                    </div>
                    <span className={`${styles.tokens.pill.base} ${styles.tokens.pill.accent}`}>
                      {result.action === "add" ? "+" : "-"}
                      {result.applied} {result.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
          onClick={handleApplyShortRest}
          disabled={!hasValidSelection || isApplying}
          className={`${styles.tokens.button.base} ${styles.tokens.button.primary} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isApplying ? "Applying..." : "Apply Short Rest"}
        </button>
      </div>
    </ModalCard>
  );
};

export default ShortRestModal;
