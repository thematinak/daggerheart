import React from "react";
import styles from "../types/cssColor";

export type DamageKey = "flat" | "4" | "6" | "8" | "10" | "12" | "20";

export type DamageEntry = {
  key: DamageKey;
  value: number;
};

const DAMAGE_OPTIONS: Array<{ value: DamageKey; label: string }> = [
  { value: "4", label: "d4" },
  { value: "6", label: "d6" },
  { value: "8", label: "d8" },
  { value: "10", label: "d10" },
  { value: "12", label: "d12" },
  { value: "20", label: "d20" },
  { value: "flat", label: "Flat damage" },
];

export const buildDamageEntries = (damage?: Record<string, number>): DamageEntry[] =>
  Object.entries(damage ?? {}).flatMap(([key, value]) =>
    typeof value === "number" ? [{ key: key as DamageKey, value }] : []
  );

export const buildDamageRecord = (entries: DamageEntry[]): Record<string, number> =>
  entries.reduce<Record<string, number>>((result, entry) => {
    result[entry.key] = Number(entry.value);
    return result;
  }, {});

type DamageListBuilderProps = {
  label?: string;
  entries: DamageEntry[];
  onChange: (entries: DamageEntry[]) => void;
  helperText?: string;
  className?: string;
};

const DamageListBuilder: React.FC<DamageListBuilderProps> = ({
  label = "Damage",
  entries,
  onChange,
  helperText = "Build the damage object by adding dice types or flat damage.",
  className = "",
}) => {
  const usedKeys = new Set(entries.map((entry) => entry.key));
  const availableOptions = DAMAGE_OPTIONS.filter((option) => !usedKeys.has(option.value));

  const handleEntryChange = <K extends keyof DamageEntry>(index: number, field: K, value: DamageEntry[K]) => {
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
        value: availableOptions[0].value === "flat" ? 1 : 1,
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
            const selectableOptions = DAMAGE_OPTIONS.filter(
              (option) => option.value === entry.key || !usedKeys.has(option.value)
            );

            return (
              <div
                key={`${entry.key}-${index}`}
                className="grid gap-3 rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-muted)] p-4 lg:grid-cols-[minmax(0,1.4fr)_180px_auto]"
              >
                <label className="grid gap-2">
                  <span className={styles.tokens.text.label}>Damage Type</span>
                  <select
                    className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                    value={entry.key}
                    onChange={(event) => handleEntryChange(index, "key", event.target.value as DamageKey)}
                  >
                    {selectableOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className={styles.tokens.text.label}>
                    {entry.key === "flat" ? "Flat Value" : "Dice Count"}
                  </span>
                  <input
                    type="number"
                    min={0}
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
        <div className={styles.tokens.emptyState}>No damage entries added yet.</div>
      )}

      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleAdd}
          disabled={availableOptions.length === 0}
          className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          Add damage
        </button>
      </div>
    </div>
  );
};

export default DamageListBuilder;
