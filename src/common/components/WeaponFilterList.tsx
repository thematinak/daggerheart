import React, { useEffect, useState } from "react";
import WeaponCard, { WeaponItem } from "./WeaponCard";

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

const WeaponFilterList: React.FC<Props> = ({ selected, forcedSlot, onSelect }) => {
  const [filters, setFilters] = useState<WeaponFilters>({});
  const [items, setItems] = useState<WeaponItem[]>([]);

  // Fetch zbrane (tu dummy data)
  const fetchWeapons = async (f: WeaponFilters) => {
    console.log("fetch weapons with filters", f);

    const dummy: WeaponItem[] = [
      {
        id: "sword",
        name: "Sword",
        attribute: "strength",
        range: "melee",
        burden: "one-handed",
        tier: 1,
        slot: "primary",
        damage: { 6: 1, flat: 2 },
      },
      {
        id: "bow",
        name: "Bow",
        attribute: "agility",
        range: "far",
        burden: "two-handed",
        tier: 2,
        slot: "primary",
        damage: { 6: 1 },
      },
    ];

    // filtrovanie podľa filterov
    const filtered = dummy.filter((w) => {
      if (forcedSlot && w.slot !== forcedSlot) return false;
      if (filters.attribute && w.attribute !== filters.attribute) return false;
      if (filters.range && w.range !== filters.range) return false;
      if (filters.burden && w.burden !== filters.burden) return false;
      if (filters.tier && w.tier !== filters.tier) return false;
      if (filters.slot && w.slot !== filters.slot) return false;
      return true;
    });

    setItems(filtered);
  };

  useEffect(() => {
    const f = {
      ...filters,
      ...(forcedSlot ? { slot: forcedSlot } : {}),
    };
    fetchWeapons(f);
  }, [filters, forcedSlot]);

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm flex flex-col gap-5">

      {/* FILTER BAR */}
      <div className="grid md:grid-cols-5 gap-3">
        <select
          onChange={(e) => setFilters({ ...filters, attribute: e.target.value })}
          className="border rounded-lg px-3 py-2"
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
          className="border rounded-lg px-3 py-2"
          value={filters.range || ""}
        >
          <option value="">Range</option>
          <option value="melee">Melee</option>
          <option value="near">Near</option>
          <option value="far">Far</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, burden: e.target.value })}
          className="border rounded-lg px-3 py-2"
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
          className="border rounded-lg px-3 py-2"
          value={filters.tier || ""}
        >
          <option value="">Tier</option>
          <option value="1">T1</option>
          <option value="2">T2</option>
          <option value="3">T3</option>
          <option value="4">T4</option>
        </select>

        <select
          onChange={(e) => setFilters({ ...filters, slot: e.target.value })}
          className="border rounded-lg px-3 py-2"
          value={filters.slot || ""}
        >
          <option value="">Slot</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((w) => (
          <WeaponCard
            key={w.id}
            weapon={w}
            selected={selected?.id === w.id}
            onSelect={() => onSelect(w)}
            onDeselect={() => onSelect(null)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeaponFilterList;