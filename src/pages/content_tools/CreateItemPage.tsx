import React, { useState } from "react";
import ContentToolShell from "../../common/components/ContentToolShell";
import { useCommonData } from "../../common/contexts/CommonDataProvider";
import styles from "../../common/types/cssColor";

const CreateItemPage: React.FC = () => {
  const { refreshCommonData } = useCommonData();
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    roll: 1,
    type: "loot" as "loot" | "consumables",
    modifiers: "{}",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    let modifiers: Record<string, number> = {};

    try {
      modifiers = form.modifiers.trim() ? JSON.parse(form.modifiers) : {};
    } catch {
      setError("Modifiers must be valid JSON.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch("http://pecen.eu/daggerheart/api1/backpack_items.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id.trim(),
          name: form.name.trim(),
          description: form.description.trim(),
          roll: Number(form.roll),
          type: form.type,
          modifiers,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create item");
      }

      await refreshCommonData();
      setMessage(`Item "${form.name}" was created.`);
      setForm({
        id: "",
        name: "",
        description: "",
        roll: 1,
        type: "loot",
        modifiers: "{}",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create item");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ContentToolShell
      eyebrow="Content Tools"
      title="Create New Item"
      description="Add a new backpack item and make it immediately available for character creation and gameplay."
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

        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <label className="grid gap-2">
            <span className={styles.tokens.text.label}>Description</span>
            <textarea className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[120px] resize-y`} value={form.description} onChange={(e) => setForm((state) => ({ ...state, description: e.target.value }))} />
          </label>
          <div className="grid gap-4">
            <label className="grid gap-2">
              <span className={styles.tokens.text.label}>Roll</span>
              <input type="number" className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.roll} onChange={(e) => setForm((state) => ({ ...state, roll: Number(e.target.value) }))} required />
            </label>
            <label className="grid gap-2">
              <span className={styles.tokens.text.label}>Type</span>
              <select className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`} value={form.type} onChange={(e) => setForm((state) => ({ ...state, type: e.target.value as "loot" | "consumables" }))}>
                <option value="loot">Loot</option>
                <option value="consumables">Consumables</option>
              </select>
            </label>
          </div>
        </div>

        <label className="grid gap-2">
          <span className={styles.tokens.text.label}>Modifiers JSON</span>
          <textarea className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[120px] resize-y font-mono text-sm`} value={form.modifiers} onChange={(e) => setForm((state) => ({ ...state, modifiers: e.target.value }))} />
        </label>

        {message ? <div className={`${styles.tokens.panel.accent} py-3 text-sm ${styles.green.text}`}>{message}</div> : null}
        {error ? <div className={`${styles.tokens.panel.muted} border-rose-200 bg-rose-50/80 py-3 text-sm text-rose-700`}>{error}</div> : null}

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}>
            {isSaving ? "Saving..." : "Create Item"}
          </button>
        </div>
      </form>
    </ContentToolShell>
  );
};

export default CreateItemPage;
