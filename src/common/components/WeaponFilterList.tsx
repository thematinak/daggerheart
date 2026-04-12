import React, { useMemo, useState } from "react";
import WeaponCard from "./WeaponCard";
import { useCommonData } from "../contexts/CommonDataProvider";
import { WeaponItem } from "../types/Weapon";
import styles from "../types/cssColor";

type WeaponFilters = {
  attribute?: string;
  range?: string;
  burden?: WeaponItem["burden"];
  tier?: WeaponItem["tier"];
  slot?: WeaponItem["slot"];
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
  const { commonData: { list: { weapons } } } = useCommonData();
  const [filters, setFilters] = useState<WeaponFilters>({tier: 1});

  const items = useMemo(() => {
    const appliedFilters = {
      ...filters,
      ...(forcedSlot ? { slot: forcedSlot } : {}),
    };

    return weapons.filter((weapon) => {
      if (appliedFilters.attribute && weapon.attribute !== appliedFilters.attribute) {
        return false;
      }

      if (appliedFilters.range && weapon.range !== appliedFilters.range) {
        return false;
      }

      if (appliedFilters.burden && weapon.burden !== appliedFilters.burden) {
        return false;
      }

      if (appliedFilters.tier && weapon.tier !== appliedFilters.tier) {
        return false;
      }

      if (appliedFilters.slot && weapon.slot !== appliedFilters.slot) {
        return false;
      }

      return true;
    });
  }, [weapons, filters, forcedSlot]);

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
            onChange={(e) => setFilters({ ...filters, burden: e.target.value ? (e.target.value as WeaponItem["burden"]) : undefined })}
            className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
            value={filters.burden || ""}
          >
            <option value="">Burden</option>
            <option value="one-handed">One Handed</option>
            <option value="two-handed">Two Handed</option>
          </select>

          <select
            onChange={(e) =>
              setFilters({ ...filters, tier: e.target.value ? (Number(e.target.value) as WeaponItem["tier"]) : undefined })
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
              onChange={(e) => setFilters({ ...filters, slot: e.target.value ? (e.target.value as WeaponItem["slot"]) : undefined })}
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

      {/* CARDS */}
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
    </div>
  );
};

export default WeaponFilterList;
