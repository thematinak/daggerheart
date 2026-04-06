import React, { useEffect, useState } from "react";
import WeaponCard from "./WeaponCard";
import { WeaponItem } from "../types/Weapon";
import styles from "../types/cssColor";

type WeaponFilters = {
  attribute?: string;
  range?: string;
  burden?: string;
  tier?: number;
  slot?: string;
};

type Props = {
  selected: WeaponItem | null;
  forcedSlot?: "primary" | "secondary";
  onSelect: (w: WeaponItem | null) => void;
};

const WeaponFilterList: React.FC<Props> = ({
  selected,
  forcedSlot,
  onSelect,
}) => {
  const [filters, setFilters] = useState<WeaponFilters>({});
  const [items, setItems] = useState<WeaponItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeapons = async (f: WeaponFilters) => {
    try {
      setLoading(true);
      setError(null);

      const cleaned: Record<string, string> = {};
      Object.entries(f).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          cleaned[key] = String(value);
        }
      });

      const queryString = new URLSearchParams(cleaned).toString();

      const response = await fetch(`http://pecen.eu/daggerheart/api1/weapons.php?${queryString}`);

      if (!response.ok) {
        throw new Error("Failed to fetch weapons");
      }

      const data: WeaponItem[] = await response.json();
      setItems(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const f = {
      ...filters,
      ...(forcedSlot ? { slot: forcedSlot } : {}),
    };

    fetchWeapons(f);
  }, [filters, forcedSlot]);

  return (
    <div className="flex flex-col gap-5">

      {!selected && (
        <div className="grid gap-3 md:grid-cols-5">
          <select
            onChange={(e) => setFilters({ ...filters, attribute: e.target.value })}
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
            value={filters.attribute || ""}
          >
            <option value="">Attribute</option>
            <option value="strength">Strength</option>
            <option value="agility">Agility</option>
            <option value="finesse">Finesse</option>
            <option value="instinct">Instinct</option>
          </select>

          <select
            onChange={(e) => setFilters({ ...filters, range: e.target.value })}
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
            value={filters.range || ""}
          >
            <option value="">Range</option>
            <option value="melee">Melee</option>
            <option value="near">Near</option>
            <option value="far">Far</option>
          </select>

          <select
            onChange={(e) => setFilters({ ...filters, burden: e.target.value })}
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
            value={filters.burden || ""}
          >
            <option value="">Burden</option>
            <option value="one-handed">One Handed</option>
            <option value="two-handed">Two Handed</option>
          </select>

          <select
            onChange={(e) =>
              setFilters({ ...filters, tier: e.target.value ? Number(e.target.value) : undefined })
            }
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
            value={filters.tier || ""}
          >
            <option value="">Tier</option>
            <option value="1">T1</option>
            <option value="2">T2</option>
            <option value="3">T3</option>
            <option value="4">T4</option>
          </select>

          {!forcedSlot && (
            <select
              onChange={(e) => setFilters({ ...filters, slot: e.target.value })}
              className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
              value={filters.slot || ""}
            >
              <option value="">Slot</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </select>
          )}
        </div>
      )}

      {/* STATES */}
      {loading && <p>Loading weapons...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* CARDS */}
      {!loading && !error && (
        <div className={selected ? "grid grid-cols-1" : "grid gap-4 md:grid-cols-2 lg:grid-cols-3"}>
          {items.length === 0 && <p>No weapons found</p>}

          {(selected ? [selected] : items).map((w) => (
            <WeaponCard
              key={w.id}
              weapon={w}
              selected={selected?.id === w.id}
              onSelect={() => onSelect(w)}
              onDeselect={() => onSelect(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeaponFilterList;
