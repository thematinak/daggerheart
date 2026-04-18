import React from "react";
import styles from "../types/cssColor";
import { StatModifiers } from "../types/StatModifiers";

export type ModifierKey = keyof StatModifiers;

export type ModifierEntry = {
  key: ModifierKey;
  value: number;
};

const MODIFIER_OPTIONS: Array<{ value: ModifierKey; label: string }> = [
  { value: "evasion", label: "Evasion" },
  { value: "maxArmor", label: "Max Armor" },
  { value: "agility", label: "Agility" },
  { value: "strength", label: "Strength" },
  { value: "finesse", label: "Finesse" },
  { value: "instinct", label: "Instinct" },
  { value: "presence", label: "Presence" },
  { value: "knowledge", label: "Knowledge" },
  { value: "threshold1", label: "Threshold 1" },
  { value: "threshold2", label: "Threshold 2" },
  { value: "maxHp", label: "Max HP" },
  { value: "maxStress", label: "Max Stress" },
];

export const buildModifierEntries = (modifiers?: StatModifiers): ModifierEntry[] =>
  Object.entries(modifiers ?? {}).flatMap(([key, value]) =>
    typeof value === "number" ? [{ key: key as ModifierKey, value }] : []
  );

export const buildModifierRecord = (entries: ModifierEntry[]): StatModifiers =>
  entries.reduce<StatModifiers>((result, entry) => {
    result[entry.key] = Number(entry.value);
    return result;
  }, {});

type ModifierListBuilderProps = {
  label?: string;
  entries: ModifierEntry[];
  onChange: (entries: ModifierEntry[]) => void;
  helperText?: string;
  className?: string;
};

const ModifierListBuilder: React.FC<ModifierListBuilderProps> = ({
  label = "Modifiers",
  entries,
  onChange,
  helperText = "Choose a stat modifier and value. You can add as many modifiers as needed.",
  className = "",
}) => {
  const usedKeys = new Set(entries.map((entry) => entry.key));
  const availableOptions = MODIFIER_OPTIONS.filter((option) => !usedKeys.has(option.value));

  const handleEntryChange = <K extends keyof ModifierEntry>(index: number, field: K, value: ModifierEntry[K]) => {
    onChange(
      entries.map((entry, entryIndex) =>
        entryIndex === index
          ? {
              ...entry,
              [field]: field === "value" ? Number(value) : value,
            }
          : entry
      )
    );
  };

  const handleAdd = () => {
    if (availableOptions.length === 0) {
      return;
    }

    onChange([
      ...entries,
      {
        key: availableOptions[0].value,
        value: 0,
      },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(entries.filter((_, entryIndex) => entryIndex !== index));
  };

  return (
    <div className={`grid min-w-0 gap-3 ${className}`}>
      <div>
        <div className={styles.tokens.text.label}>{label}</div>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{helperText}</p>
      </div>

      {entries.length > 0 ? (
        <div className="grid gap-3">
          {entries.map((entry, index) => {
            const selectableOptions = MODIFIER_OPTIONS.filter(
              (option) => option.value === entry.key || !usedKeys.has(option.value)
            );

            return (
              <div
                key={`${entry.key}-${index}`}
                className="grid gap-3 rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-muted)] p-4 lg:grid-cols-[minmax(0,1.4fr)_180px_auto]"
              >
                <label className="grid gap-2">
                  <span className={styles.tokens.text.label}>Modifier</span>
                  <select
                    className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                    value={entry.key}
                    onChange={(event) => handleEntryChange(index, "key", event.target.value as ModifierKey)}
                  >
                    {selectableOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className={styles.tokens.text.label}>Value</span>
                  <input
                    type="number"
                    className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                    value={entry.value}
                    onChange={(event) => handleEntryChange(index, "value", Number(event.target.value))}
                  />
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} w-full md:w-auto`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.tokens.emptyState}>No modifiers added yet.</div>
      )}

      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleAdd}
          disabled={availableOptions.length === 0}
          className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          Add modifier
        </button>
      </div>
    </div>
  );
};

export default ModifierListBuilder;
