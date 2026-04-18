import React, { useEffect, useMemo, useState } from "react";
import ModalCard from "../../../common/components/ModalCard";
import styles from "../../../common/types/cssColor";
import Eyebrow from "../../../common/components/Eyebrow";
import { Character, Stats } from "../../../common/types/Character";
import {
  CharacterStatCommand,
  LONG_REST_MOVE_OPTIONS,
  LongRestMove,
  resolveLongRest,
} from "../../../common/utils/shortRest";
import { useNotifications } from "../../../common/contexts/CommonDataProvider";
import { getTierFromLevel } from "../../../common/utils/funks";

type LongRestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  stats: Stats;
  onCharacterUpdated: () => Promise<void>;
};

const DEFAULT_MOVES: Array<LongRestMove | ""> = ["", ""];

const LongRestModal: React.FC<LongRestModalProps> = ({ isOpen, onClose, character, stats, onCharacterUpdated }) => {
  const [selectedMoves, setSelectedMoves] = useState<Array<LongRestMove | "">>(DEFAULT_MOVES);
  const [prepareWithParty, setPrepareWithParty] = useState([false, false]);
  const [isApplying, setIsApplying] = useState(false);
  const { showError } = useNotifications();
  const [results, setResults] = useState<ReturnType<typeof resolveLongRest>["results"]>([]);

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

  const updateMove = (index: number, move: LongRestMove | "") => {
    setSelectedMoves((current) => current.map((item, itemIndex) => (itemIndex === index ? move : item)));

    if (move !== "prepare") {
      setPrepareWithParty((current) => current.map((item, itemIndex) => (itemIndex === index ? false : item)));
    }
  };

  const postCommands = async (commands: CharacterStatCommand[]) => {
    const response = await fetch("http://pecen.eu/daggerheart/api1/character.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        character_id: character.id,
        commands,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to apply long rest.");
    }
  };

  const handleApplyLongRest = async () => {
    if (!hasValidSelection) {
      showError("Choose two long rest moves.");
      return;
    }

    const selections = selectedMoves.map((move, index) => ({
      move: move as LongRestMove,
      prepareWithParty: move === "prepare" ? prepareWithParty[index] : false,
    }));

    const resolution = resolveLongRest({
      level: character.level,
      currentStats: character.currentStats,
      stats,
      selections,
    });

    try {
      setIsApplying(true);

      if (resolution.commands.length > 0) {
        await postCommands(resolution.commands);
        await onCharacterUpdated();
      }

      setResults(resolution.results);
      onClose();
    } catch (applyError: any) {
      showError(applyError.message || "Failed to apply long rest.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <ModalCard
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Character Action"
      title="Long Rest"
      maxWidthClassName="max-w-4xl"
    >
      <div className="grid gap-5">
        <div className={styles.tokens.panel.base}>
          <Eyebrow eyebrow="Rules" />
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Choose two long rest moves. You can pick the same move twice. Your current tier is
            {" "}
            <span className="font-semibold text-slate-900">Tier {tier}</span>
            {" "}
            and long rest recovery moves fully restore their matching resource.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1].map((slotIndex) => {
            const selectedMove = selectedMoves[slotIndex];

            return (
              <section key={slotIndex} className={styles.tokens.panel.base}>
                <div className="mb-4">
                  <div className={styles.tokens.text.label}>Move Slot {slotIndex + 1}</div>
                  <h4 className="mt-2 text-lg font-bold text-slate-950">Choose a downtime move</h4>
                </div>

                <div className="grid gap-3">
                  <select
                    value={selectedMove}
                    onChange={(event) => updateMove(slotIndex, event.target.value as LongRestMove | "")}
                    className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                  >
                    <option value="">Select move</option>
                    {LONG_REST_MOVE_OPTIONS.map((option) => (
                      <option key={`${slotIndex}-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {selectedMove ? (
                    <div className={styles.tokens.panel.muted}>
                      <div className="text-sm font-semibold text-slate-950">
                        {LONG_REST_MOVE_OPTIONS.find((option) => option.value === selectedMove)?.label}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {LONG_REST_MOVE_OPTIONS.find((option) => option.value === selectedMove)?.description}
                      </p>

                      {selectedMove === "prepare" ? (
                        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
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
              <h4 className="mt-2 text-lg font-bold text-slate-950">Long rest outcome</h4>
            </div>

            <div className="grid gap-3">
              {results.map((result, index) => (
                <div key={`${result.move}-${index}`} className={styles.tokens.panel.muted}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{result.label}</div>
                      <p className="mt-1 text-sm text-slate-600">
                        {result.move === "prepare"
                          ? `Prepared ${result.prepareWithParty ? "with the party" : "alone"} for ${result.applied} Hope.`
                          : result.move === "workOnProject"
                            ? "Project progress placeholder recorded. No character stat was changed."
                            : `Applied ${result.applied} to ${result.target}.`}
                      </p>
                    </div>
                    <span className={`${styles.tokens.pill.base} ${styles.tokens.pill.accent}`}>
                      {result.action === "none" ? "No stat change" : `${result.action === "add" ? "+" : "-"}${result.applied} ${result.target}`}
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
          onClick={handleApplyLongRest}
          disabled={!hasValidSelection || isApplying}
          className={`${styles.tokens.button.base} ${styles.tokens.button.primary} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isApplying ? "Applying..." : "Apply Long Rest"}
        </button>
      </div>
    </ModalCard>
  );
};

export default LongRestModal;
