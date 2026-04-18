import React, { useState } from "react";
import ContentToolShell from "../../common/components/ContentToolShell";
import { useCommonData, useNotifications } from "../../common/contexts/CommonDataProvider";
import styles from "../../common/types/cssColor";
import ModifierListBuilder, { ModifierEntry, buildModifierRecord } from "../../common/components/ModifierListBuilder";

const CreateArmorPage: React.FC = () => {
  const { refreshCommonData } = useCommonData();
  const [form, setForm] = useState({
    id: "",
    name: "",
    tier: 1,
    threshold1: 1,
    threshold2: 3,
    baseScore: 1,
    ability: "",
    abilityDescription: "",
  });
  const [modifierEntries, setModifierEntries] = useState<ModifierEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { showError, showInfo } = useNotifications();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const modifiers = buildModifierRecord(modifierEntries);

    try {
      setIsSaving(true);

      const response = await fetch("http://pecen.eu/daggerheart/api1/armor.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id.trim(),
          name: form.name.trim(),
          tier: Number(form.tier),
          threshold1: Number(form.threshold1),
          threshold2: Number(form.threshold2),
          baseScore: Number(form.baseScore),
          ability: form.ability.trim(),
          abilityDescription: form.abilityDescription.trim(),
          modifiers,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create armor");
      }

      await refreshCommonData();
      showInfo(`Armor "${form.name}" was created.`, "Armor Created");
      setForm({
        id: "",
        name: "",
        tier: 1,
        threshold1: 1,
        threshold2: 3,
        baseScore: 1,
        ability: "",
        abilityDescription: "",
      });
      setModifierEntries([]);
    } catch (err: any) {
      showError(err.message || "Failed to create armor", "Create Armor Failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ContentToolShell
      eyebrow="Content Tools"
      title="Create New Armor"
      description="Add a new armor entry with thresholds, score and modifiers, then use it directly during character creation."
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Id</span>
            <input className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.id} onChange={(e) => setForm((state) => ({ ...state, id: e.target.value }))} required />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Name</span>
            <input className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.name} onChange={(e) => setForm((state) => ({ ...state, name: e.target.value }))} required />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Tier</span>
            <input type="number" min={1} max={4} className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.tier} onChange={(e) => setForm((state) => ({ ...state, tier: Number(e.target.value) }))} required />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Threshold 1</span>
            <input type="number" className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.threshold1} onChange={(e) => setForm((state) => ({ ...state, threshold1: Number(e.target.value) }))} required />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Threshold 2</span>
            <input type="number" className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.threshold2} onChange={(e) => setForm((state) => ({ ...state, threshold2: Number(e.target.value) }))} required />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Base Score</span>
            <input type="number" className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.baseScore} onChange={(e) => setForm((state) => ({ ...state, baseScore: Number(e.target.value) }))} required />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Ability</span>
            <input className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.ability} onChange={(e) => setForm((state) => ({ ...state, ability: e.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Ability Description</span>
            <textarea className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[110px] resize-y`} value={form.abilityDescription} onChange={(e) => setForm((state) => ({ ...state, abilityDescription: e.target.value }))} />
          </label>
        </div>

        <ModifierListBuilder
          label="Modifiers"
          entries={modifierEntries}
          onChange={setModifierEntries}
        />
        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}>
            {isSaving ? "Saving..." : "Create Armor"}
          </button>
        </div>
      </form>
    </ContentToolShell>
  );
};

export default CreateArmorPage;
