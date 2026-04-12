import React, { useState } from "react";
import ContentToolShell from "../../common/components/ContentToolShell";
import { useCommonData } from "../../common/contexts/CommonDataProvider";
import styles from "../../common/types/cssColor";

const CreateWeaponPage: React.FC = () => {
  const { refreshCommonData } = useCommonData();
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    attribute: "agility",
    range: "melee",
    burden: "one-handed" as "one-handed" | "two-handed",
    tier: 1,
    slot: "primary" as "primary" | "secondary",
    ability: "",
    abilityDescription: "",
    damage: "{\"flat\":1}",
    modifiers: "{}",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    let damage: Record<string, number> = {};
    let modifiers: Record<string, number> = {};

    try {
      damage = form.damage.trim() ? JSON.parse(form.damage) : {};
      modifiers = form.modifiers.trim() ? JSON.parse(form.modifiers) : {};
    } catch {
      setError("Damage and modifiers must be valid JSON.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch("http://pecen.eu/daggerheart/api1/weapons.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id.trim(),
          name: form.name.trim(),
          description: form.description.trim(),
          attribute: form.attribute,
          range: form.range.trim(),
          burden: form.burden,
          tier: Number(form.tier),
          slot: form.slot,
          ability: form.ability.trim(),
          abilityDescription: form.abilityDescription.trim(),
          damage,
          modifiers,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create weapon");
      }

      await refreshCommonData();
      setMessage(`Weapon "${form.name}" was created.`);
      setForm({
        id: "",
        name: "",
        description: "",
        attribute: "agility",
        range: "melee",
        burden: "one-handed",
        tier: 1,
        slot: "primary",
        ability: "",
        abilityDescription: "",
        damage: "{\"flat\":1}",
        modifiers: "{}",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create weapon");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ContentToolShell
      eyebrow="Content Tools"
      title="Create New Weapon"
      description="Add a custom weapon definition, including burden, slot, damage and modifiers, and use it right away in the game."
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

        <label className="grid gap-2">
          <span className={styles.tokens.text.label}>Description</span>
          <textarea className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[110px] resize-y`} value={form.description} onChange={(e) => setForm((state) => ({ ...state, description: e.target.value }))} />
        </label>

        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Attribute</span>
            <select className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.attribute} onChange={(e) => setForm((state) => ({ ...state, attribute: e.target.value }))}>
              <option value="agility">Agility</option>
              <option value="strength">Strength</option>
              <option value="finesse">Finesse</option>
              <option value="instinct">Instinct</option>
              <option value="presence">Presence</option>
              <option value="knowledge">Knowledge</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Range</span>
            <input className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.range} onChange={(e) => setForm((state) => ({ ...state, range: e.target.value }))} required />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Burden</span>
            <select className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.burden} onChange={(e) => setForm((state) => ({ ...state, burden: e.target.value as "one-handed" | "two-handed" }))}>
              <option value="one-handed">One-handed</option>
              <option value="two-handed">Two-handed</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Slot</span>
            <select className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.slot} onChange={(e) => setForm((state) => ({ ...state, slot: e.target.value as "primary" | "secondary" }))}>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[160px_1fr_1fr]">
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Tier</span>
            <input type="number" min={1} max={4} className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.tier} onChange={(e) => setForm((state) => ({ ...state, tier: Number(e.target.value) }))} required />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Damage JSON</span>
            <textarea className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[110px] resize-y font-mono text-sm`} value={form.damage} onChange={(e) => setForm((state) => ({ ...state, damage: e.target.value }))} />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Modifiers JSON</span>
            <textarea className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[110px] resize-y font-mono text-sm`} value={form.modifiers} onChange={(e) => setForm((state) => ({ ...state, modifiers: e.target.value }))} />
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

        {message ? <div className={`${styles.tokens.panel.accent} py-3 text-sm ${styles.green.text}`}>{message}</div> : null}
        {error ? <div className={`${styles.tokens.panel.muted} border-rose-200 bg-rose-50/80 py-3 text-sm text-rose-700`}>{error}</div> : null}

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}>
            {isSaving ? "Saving..." : "Create Weapon"}
          </button>
        </div>
      </form>
    </ContentToolShell>
  );
};

export default CreateWeaponPage;
