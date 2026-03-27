import React, { useEffect, useState } from "react";
import ArmorCard from "./ArmorCard";
import { ArmorItem } from "../types/Armor";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArmor = async (f: ArmorFilters) => {
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

      const response = await fetch(`http://pecen.eu/daggerheart/api1/armor.php?${queryString}`);

      if (!response.ok) {
        throw new Error("Failed to fetch armor");
      }

      const data: ArmorItem[] = await response.json();
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
          onChange={(e) => setFilters({ ...filters, tier: e.target.value ? Number(e.target.value) : undefined })}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Tier</option>
          <option value="1">T1</option>
          <option value="2">T2</option>
          <option value="3">T3</option>
          <option value="4">T4</option>
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

      {/* STATES */}
      {loading && <p>Loading armor...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* CARDS */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 && <p>No armor found</p>}

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
      )}

    </div>
  );
};

export default ArmorFilterList;