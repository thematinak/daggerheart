import React, { useMemo, useState } from "react";
import ArmorCard from "./ArmorCard";
import { useCommonData } from "../contexts/CommonDataProvider";
import { ArmorItem } from "../types/Armor";
import styles from "../types/cssColor";

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
  const { commonData } = useCommonData();
  const [filters, setFilters] = useState<ArmorFilters>({});

  const items = useMemo(() => {
    return Object.values(commonData.armor).filter((armor) => {
      if (filters.name && !armor.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      if (filters.tier && armor.tier !== filters.tier) {
        return false;
      }

      if (filters.baseScore === "light" && !(armor.baseScore >= 0 && armor.baseScore <= 2)) {
        return false;
      }

      if (filters.baseScore === "medium" && !(armor.baseScore >= 3 && armor.baseScore <= 4)) {
        return false;
      }

      if (filters.baseScore === "heavy" && !(armor.baseScore >= 5)) {
        return false;
      }

      return true;
    });
  }, [commonData.armor, filters]);

  return (
    <div className="flex flex-col gap-5">

      {!selected && (
        <div className="grid gap-3 md:grid-cols-3">
          <input
            placeholder="Name"
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
          />

          <select
            onChange={(e) => setFilters({ ...filters, tier: e.target.value ? Number(e.target.value) : undefined })}
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
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
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
          >
            <option value="">Weight</option>
            <option value="light">Light (0-2)</option>
            <option value="medium">Medium (3-4)</option>
            <option value="heavy">Heavy (5+)</option>
          </select>
        </div>
      )}

      {/* CARDS */}
      <div className={selected ? "grid grid-cols-1" : "grid gap-4 md:grid-cols-2 lg:grid-cols-3"}>
        {items.length === 0 && <p>No armor found</p>}

        {(selected ? [selected] : items).map((a) => (
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
