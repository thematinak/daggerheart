import React, { useEffect, useState } from "react";
import ArmorCard, { ArmorItem } from "./ArmorCard";

type ArmorFilters = {
  name?: string;
  tier?: number;
  baseScore?: string;
};

type Props = {
  selected: ArmorItem | null;
  onSelect: (a: ArmorItem | null) => void;
};

const ArmorFilterList: React.FC<Props> = ({ selected, onSelect }) => {
  const [filters, setFilters] = useState<ArmorFilters>({});
  const [items, setItems] = useState<ArmorItem[]>([]);

  const fetchArmor = async (f: ArmorFilters) => {
    console.log("fetch armor with filters", f);

    const dummy: ArmorItem[] = [
      {
        id: "leather",
        name: "Leather Armor",
        tier: 1,
        threshold1: 2,
        threshold2: 4,
        baseScore: 1,
        modifiers: { evasion: 1 }
      },
      {
        id: "plate",
        name: "Plate Armor",
        tier: 3,
        threshold1: 3,
        threshold2: 6,
        baseScore: 5,
        modifiers: { armor: 2 }
      }
    ];

    setItems(dummy);
  };

  useEffect(() => {
    fetchArmor(filters);
  }, [filters]);

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm flex flex-col gap-5">

      {/* FILTER BAR */}
      <div className="grid md:grid-cols-3 gap-3">

        <input
          placeholder="Name"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border rounded-lg px-3 py-2"
        />

        <select
          onChange={(e) =>
            setFilters({ ...filters, tier: Number(e.target.value) })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tier</option>
          <option value="1">T1</option>
          <option value="2">T2</option>
          <option value="3">T3</option>
        </select>

        <select
          onChange={(e) =>
            setFilters({ ...filters, baseScore: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Weight</option>
          <option value="light">Light (0-2)</option>
          <option value="medium">Medium (3-4)</option>
          <option value="heavy">Heavy (5+)</option>
        </select>

      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a) => (
          <ArmorCard
            key={a.id}
            armor={a}
            selected={selected?.id === a.id}
            onSelect={() => onSelect(a)}
            onDeselect={() => onSelect(null)}
          />
        ))}
      </div>

    </div>
  );
};

export default ArmorFilterList;