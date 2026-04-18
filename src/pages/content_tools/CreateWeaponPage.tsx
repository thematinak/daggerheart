import React, { useState } from "react";
import ContentToolShell from "../../common/components/ContentToolShell";
import { useCommonData, useNotifications } from "../../common/contexts/CommonDataProvider";
import styles from "../../common/types/cssColor";
import ModifierListBuilder, { ModifierEntry, buildModifierRecord } from "../../common/components/ModifierListBuilder";
import DamageListBuilder, { DamageEntry, buildDamageRecord } from "../../common/components/DamageListBuilder";

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
  });
  const [damageEntries, setDamageEntries] = useState<DamageEntry[]>([{ key: "flat", value: 1 }]);
  const [modifierEntries, setModifierEntries] = useState<ModifierEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { showError, showInfo } = useNotifications();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const damage = buildDamageRecord(damageEntries);
    const modifiers = buildModifierRecord(modifierEntries);

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
      showInfo(`Weapon "${form.name}" was created.`, "Weapon Created");
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
      });
      setDamageEntries([{ key: "flat", value: 1 }]);
      setModifierEntries([]);
    } catch (err: any) {
      showError(err.message || "Failed to create weapon", "Create Weapon Failed");
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
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Id</span>
            <input className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.id} onChange={(e) => setForm((state) => ({ ...state, id: e.target.value }))} required />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Name</span>
            <input className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.name} onChange={(e) => setForm((state) => ({ ...state, name: e.target.value }))} required />
          </label>
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Tier</span>
            <select
              className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
              value={form.tier}
              onChange={(e) => setForm((state) => ({ ...state, tier: Number(e.target.value) }))}
            >
              <option value={1}>Tier 1</option>
              <option value={2}>Tier 2</option>
              <option value={3}>Tier 3</option>
              <option value={4}>Tier 4</option>
            </select>
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

        <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
          <DamageListBuilder
            label="Damage"
            entries={damageEntries}
            onChange={setDamageEntries}
          />
          <ModifierListBuilder label="Modifiers" entries={modifierEntries} onChange={setModifierEntries} />
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
