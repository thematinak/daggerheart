import React, { useMemo } from "react";
import { EyeOff, Link2Off, ShieldAlert } from "lucide-react";
import ModalCard from "../../../common/components/ModalCard";
import { Character } from "../../../common/types/Character";
import { Condition } from "../../../common/types/Condition";
import styles from "../../../common/types/cssColor";

type ConditionsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  character: Character;
  availableConditions: Condition[];
  onToggleCondition: (conditionId: string, isActive: boolean) => Promise<void>;
  disabled?: boolean;
};

const conditionIcons: Record<string, React.ReactNode> = {
  hidden: <EyeOff size={18} />,
  restrained: <Link2Off size={18} />,
  vulnerable: <ShieldAlert size={18} />,
};

const ConditionsPanel: React.FC<ConditionsPanelProps> = ({
  isOpen,
  onClose,
  character,
  availableConditions,
  onToggleCondition,
  disabled = false,
}) => {
  const activeIds = useMemo(
    () => new Set(character.conditions.map((condition) => condition.id)),
    [character.conditions]
  );

  const mergedConditions = useMemo(() => {
    const byId = new Map<string, Condition>();

    availableConditions.forEach((condition) => {
      byId.set(condition.id, condition);
    });

    character.conditions.forEach((condition) => {
      if (!byId.has(condition.id)) {
        byId.set(condition.id, condition);
      }
    });

    return Array.from(byId.values());
  }, [availableConditions, character.conditions]);

  return (
    <ModalCard
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Character Effects"
      title="Manage Conditions"
      maxWidthClassName="max-w-4xl"
    >
      <div className="grid gap-5">
        <div className={styles.tokens.panel.base}>
          <p className="text-sm leading-6 text-slate-600">
            Select any condition to add it to the character. Active conditions can be removed from the same list.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {mergedConditions.map((condition) => {
            const isActive = activeIds.has(condition.id);

            return (
              <button
                key={condition.id}
                type="button"
                disabled={disabled}
                onClick={() => void onToggleCondition(condition.id, isActive)}
                className={[
                  "rounded-[1.5rem] border p-4 text-left transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60",
                  isActive
                    ? "border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-[0_12px_24px_-18px_rgba(180,83,9,0.3)]"
                    : "border-slate-200 bg-white/90 hover:-translate-y-0.5 hover:border-slate-300",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                      {conditionIcons[condition.id] || <ShieldAlert size={18} />}
                    </span>
                    <div>
                      <div className="text-lg font-bold text-slate-950">{condition.name}</div>
                      <div className={styles.tokens.text.label}>
                        {isActive ? "Active" : "Available"}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`${styles.tokens.pill.base} ${
                      isActive ? styles.tokens.pill.accent : styles.tokens.pill.muted
                    }`}
                  >
                    {isActive ? "Remove" : "Add"}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {condition.description || "No description available."}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
          >
            Close
          </button>
        </div>
      </div>
    </ModalCard>
  );
};

export default ConditionsPanel;
