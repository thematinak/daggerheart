import React, { useMemo, useState } from "react";
import { Coins, Package, ShoppingBag } from "lucide-react";
import WeaponCard from "../../../common/components/WeaponCard";
import ArmorCard from "../../../common/components/ArmorCard";
import ModalCardPicker, { ModalCardPickerFilter } from "../../../common/components/ModalCardPicker";
import { Character } from "../../../common/types/Character";
import { BackpackItem } from "../../../common/types/BackpackItem";
import { WeaponItem } from "../../../common/types/Weapon";
import { ArmorItem } from "../../../common/types/Armor";
import { useCommonData } from "../../../common/contexts/CommonDataProvider";
import styles from "../../../common/types/cssColor";

type BackpackTabProps = {
  character: Character;
};

const BackpackTab: React.FC<BackpackTabProps> = ({ character }) => {
  const { commonData } = useCommonData();
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);
  const [isWeaponPickerOpen, setIsWeaponPickerOpen] = useState(false);
  const [isArmorPickerOpen, setIsArmorPickerOpen] = useState(false);
  const [pendingItems, setPendingItems] = useState<BackpackItem[]>([]);
  const [pendingWeapons, setPendingWeapons] = useState<WeaponItem[]>([]);
  const [pendingArmor, setPendingArmor] = useState<ArmorItem[]>([]);

  const availableItems = useMemo(
    () => Object.values(commonData.backpackItems).sort((a, b) => a.name.localeCompare(b.name)),
    [commonData.backpackItems]
  );
  const availableWeapons = useMemo(
    () => Object.values(commonData.weapons).sort((a, b) => a.name.localeCompare(b.name)),
    [commonData.weapons]
  );
  const availableArmor = useMemo(
    () => Object.values(commonData.armor).sort((a, b) => a.name.localeCompare(b.name)),
    [commonData.armor]
  );
  const bankBreakdown = useMemo(() => getBankBreakdown(character.bank), [character.bank]);

  const itemPickerFilters = useMemo<Array<ModalCardPickerFilter<BackpackItem>>>(
    () => [
      {
        id: "name",
        label: "Name",
        type: "text",
        placeholder: "Search by name",
        match: "includes",
        getValue: (item) => item.name,
      },
      {
        id: "roll",
        label: "Roll",
        type: "text",
        placeholder: "Filter by roll",
        match: "exact",
        getValue: (item) => item.roll,
      },
      {
        id: "type",
        label: "Type",
        type: "select",
        options: [
          { label: "Loot", value: "loot" },
          { label: "Consumables", value: "consumables" },
        ],
        getValue: (item) => item.type || "loot",
      },
    ],
    []
  );

  const weaponPickerFilters = useMemo<Array<ModalCardPickerFilter<WeaponItem>>>(
    () => [
      {
        id: "name",
        label: "Name",
        type: "text",
        placeholder: "Search by name",
        match: "includes",
        getValue: (weapon) => weapon.name,
      },
      {
        id: "tier",
        label: "Tier",
        type: "select",
        options: [
          { label: "T1", value: "1" },
          { label: "T2", value: "2" },
          { label: "T3", value: "3" },
          { label: "T4", value: "4" },
        ],
        getValue: (weapon) => weapon.tier,
      },
      {
        id: "burden",
        label: "Burden",
        type: "select",
        options: [
          { label: "One Handed", value: "one-handed" },
          { label: "Two Handed", value: "two-handed" },
        ],
        getValue: (weapon) => weapon.burden,
      },
      {
        id: "range",
        label: "Range",
        type: "select",
        options: [
          { label: "Melee", value: "melee" },
          { label: "Near", value: "near" },
          { label: "Far", value: "far" },
        ],
        getValue: (weapon) => weapon.range,
      },
      {
        id: "slot",
        label: "Slot",
        type: "select",
        options: [
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
        getValue: (weapon) => weapon.slot,
      },
    ],
    []
  );

  const armorPickerFilters = useMemo<Array<ModalCardPickerFilter<ArmorItem>>>(
    () => [
      {
        id: "name",
        label: "Name",
        type: "text",
        placeholder: "Search by name",
        match: "includes",
        getValue: (armor) => armor.name,
      },
      {
        id: "tier",
        label: "Tier",
        type: "select",
        options: [
          { label: "T1", value: "1" },
          { label: "T2", value: "2" },
          { label: "T3", value: "3" },
          { label: "T4", value: "4" },
        ],
        getValue: (armor) => armor.tier,
      },
      {
        id: "weight",
        label: "Weight",
        type: "select",
        options: [
          { label: "Light", value: "light" },
          { label: "Medium", value: "medium" },
          { label: "Heavy", value: "heavy" },
        ],
        getValue: (armor) => getArmorWeight(armor.baseScore),
      },
    ],
    []
  );

  const addPendingItem = (selectedItem: BackpackItem, quantity: number) => {
    setPendingItems((current) => [...current, { ...selectedItem, quantity }]);
    setIsItemPickerOpen(false);
  };

  const addPendingWeapon = (selectedWeapon: WeaponItem) => {
    setPendingWeapons((current) => [...current, selectedWeapon]);
    setIsWeaponPickerOpen(false);
  };

  const addPendingArmor = (selectedArmor: ArmorItem) => {
    setPendingArmor((current) => [...current, selectedArmor]);
    setIsArmorPickerOpen(false);
  };

  const removePendingItem = (indexToRemove: number) => {
    setPendingItems((current) => current.filter((_, index) => index !== indexToRemove));
  };
  const removePendingWeapon = (indexToRemove: number) => {
    setPendingWeapons((current) => current.filter((_, index) => index !== indexToRemove));
  };
  const removePendingArmor = (indexToRemove: number) => {
    setPendingArmor((current) => current.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="grid gap-6">
      <section className={`${styles.tokens.page.section} p-5 sm:p-6 lg:p-8`}>
        <div className="mb-5 text-center">
          <div className={styles.tokens.page.eyebrow}>Inventory</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Backpack & Equipment
          </h2>
        </div>

        <section className={`${styles.tokens.panel.base} mb-4`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className={styles.tokens.page.eyebrow}>Wealth</div>
              <h3 className="mt-2 text-xl font-bold text-slate-950">Character Bank</h3>
              <p className={`mt-1 ${styles.tokens.text.muted}`}>
                Total value: {character.bank} handful
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <BankUnitCard
                icon={<Package size={18} />}
                label="Chests"
                value={bankBreakdown.chests}
                note="1 chest = 13 bags"
              />
              <BankUnitCard
                icon={<ShoppingBag size={18} />}
                label="Bags"
                value={bankBreakdown.bags}
                note="1 bag = 10 handful"
              />
              <BankUnitCard
                icon={<Coins size={18} />}
                label="Handful"
                value={bankBreakdown.handful}
                note="Loose coin"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className={styles.tokens.panel.base}>
            <h3 className="mb-4 text-xl font-bold text-slate-950">Backpack Items</h3>
            <div className="grid gap-3">
              {character.backpack.length > 0 ? (
                character.backpack.map((item) => <BackpackItemCard key={`${item.id}-owned`} item={item} />)
              ) : (
                <EmptyState text="Backpack is empty." />
              )}
            </div>
          </section>

          <section className={styles.tokens.panel.base}>
            <h3 className="mb-4 text-xl font-bold text-slate-950">Add To Character</h3>
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setIsItemPickerOpen(true)}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
                >
                  Add item
                </button>
                <button
                  type="button"
                  onClick={() => setIsWeaponPickerOpen(true)}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
                >
                  Add weapon
                </button>
                <button
                  type="button"
                  onClick={() => setIsArmorPickerOpen(true)}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
                >
                  Add armor
                </button>
              </div>

              <div className="grid gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-950">Pending item additions</div>
                  <p className="mt-1 text-sm text-slate-500">
                    These additions are only prepared in UI for now. Server save will be added in the next step.
                  </p>
                </div>

                {pendingItems.length > 0 ? (
                  pendingItems.map((item, index) => (
                    <div
                      key={`${item.id}-pending-${index}`}
                      className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-slate-950">{item.name}</div>
                          <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePendingItem(index)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState text="No pending backpack items." />
                )}
              </div>

              <div className="grid gap-3">
                <div className="text-sm font-semibold text-slate-950">Pending weapon additions</div>
                {pendingWeapons.length > 0 ? (
                  pendingWeapons.map((weapon, index) => (
                    <div key={`${weapon.id}-pending-weapon-${index}`} className="grid gap-2">
                      <WeaponCard
                        weapon={weapon}
                        selected={false}
                        onSelect={() => {}}
                        onDeselect={() => {}}
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePendingWeapon(index)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState text="No pending weapons." />
                )}
              </div>

              <div className="grid gap-3">
                <div className="text-sm font-semibold text-slate-950">Pending armor additions</div>
                {pendingArmor.length > 0 ? (
                  pendingArmor.map((armor, index) => (
                    <div key={`${armor.id}-pending-armor-${index}`} className="grid gap-2">
                      <ArmorCard
                        armor={armor}
                        selected={false}
                        onSelect={() => {}}
                        onDeselect={() => {}}
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePendingArmor(index)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-slate-400 hover:bg-white"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState text="No pending armor." />
                )}
              </div>
            </div>
          </section>

          <section className={`${styles.tokens.panel.base} lg:col-span-2`}>
            <h3 className="mb-4 text-xl font-bold text-slate-950">Stored Equipment</h3>
            <div className="grid gap-4">
              {character.weaponInventory.length > 0 ? (
                character.weaponInventory.map((weapon) => (
                  <WeaponCard key={weapon.id} weapon={weapon} selected={false} onSelect={() => {}} onDeselect={() => {}} />
                ))
              ) : (
                <EmptyState text="No stored weapons." />
              )}

              {character.armorInventory.length > 0 ? (
                character.armorInventory.map((armor) => (
                  <ArmorCard key={armor.id} armor={armor} selected={false} onSelect={() => {}} onDeselect={() => {}} />
                ))
              ) : (
                <EmptyState text="No stored armor." />
              )}
            </div>
          </section>
        </div>
      </section>

      <ModalCardPicker
        isOpen={isItemPickerOpen}
        eyebrow="Backpack Items"
        title="Select Item"
        items={availableItems}
        filters={itemPickerFilters}
        getItemId={(item) => item.id}
        onClose={() => setIsItemPickerOpen(false)}
        onConfirm={addPendingItem}
        emptyText="No items match the selected filters."
        detailEmptyText="Select a card to see item detail and set quantity."
        quantityLabel="Quantity"
        confirmLabel={(item, quantity) => `Add ${quantity > 1 ? `${quantity}x ` : ""}${item.name}`}
        renderCard={(item, selected) => <PickerCard item={item} selected={selected} />}
        renderDetail={(item) => (
          <div className="grid gap-3 rounded-[1.5rem] border border-amber-200 bg-amber-50/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-slate-950">{item.name}</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.description}</p>
              </div>
              <TypeBadge type={item.type} />
            </div>

            <div className="flex flex-wrap gap-2">
              <InfoPill label={`Roll ${item.roll}`} />
              <InfoPill label={`ID ${item.id}`} muted />
            </div>
          </div>
        )}
      />

      <ModalCardPicker
        isOpen={isWeaponPickerOpen}
        eyebrow="Weapons"
        title="Select Weapon"
        items={availableWeapons}
        cardsGridClassName="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))]"
        filters={weaponPickerFilters}
        getItemId={(weapon) => weapon.id}
        onClose={() => setIsWeaponPickerOpen(false)}
        onConfirm={(weapon) => addPendingWeapon(weapon)}
        emptyText="No weapons match the selected filters."
        detailEmptyText="Select a weapon to see more detail."
        quantityEnabled={false}
        confirmLabel={(weapon) => `Add ${weapon.name}`}
        renderCard={(weapon, selected) => (
          <WeaponCard weapon={weapon} selected={selected} onSelect={() => {}} onDeselect={() => {}} />
        )}
        renderDetail={(weapon) => (
          <WeaponCard weapon={weapon} selected={false} onSelect={() => {}} onDeselect={() => {}} />
        )}
      />

      <ModalCardPicker
        isOpen={isArmorPickerOpen}
        eyebrow="Armor"
        title="Select Armor"
        items={availableArmor}
        cardsGridClassName="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))]"
        filters={armorPickerFilters}
        getItemId={(armor) => armor.id}
        onClose={() => setIsArmorPickerOpen(false)}
        onConfirm={(armor) => addPendingArmor(armor)}
        emptyText="No armor matches the selected filters."
        detailEmptyText="Select armor to see more detail."
        quantityEnabled={false}
        confirmLabel={(armor) => `Add ${armor.name}`}
        renderCard={(armor, selected) => (
          <ArmorCard armor={armor} selected={selected} onSelect={() => {}} onDeselect={() => {}} />
        )}
        renderDetail={(armor) => (
          <ArmorCard armor={armor} selected={false} onSelect={() => {}} onDeselect={() => {}} />
        )}
      />
    </div>
  );
};

const getArmorWeight = (baseScore: number) => {
  if (baseScore <= 2) {
    return "light";
  }

  if (baseScore <= 4) {
    return "medium";
  }

  return "heavy";
};

const getBankBreakdown = (bank: number) => {
  const handfulPerBag = 10;
  const bagsPerChest = 13;
  const handfulPerChest = handfulPerBag * bagsPerChest;

  const normalizedBank = Math.max(0, bank);
  const chests = Math.floor(normalizedBank / handfulPerChest);
  const remainingAfterChests = normalizedBank % handfulPerChest;
  const bags = Math.floor(remainingAfterChests / handfulPerBag);
  const handful = remainingAfterChests % handfulPerBag;

  return { chests, bags, handful };
};

const BankUnitCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  note: string;
}> = ({ icon, label, value, note }) => (
  <div className={`${styles.tokens.panel.muted} min-w-[11rem]`}>
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
        {icon}
      </div>
      <div>
        <div className={styles.tokens.text.label}>{label}</div>
        <div className="text-2xl font-black text-slate-950">{value}</div>
      </div>
    </div>
    <p className={`mt-3 ${styles.tokens.text.muted}`}>{note}</p>
  </div>
);

const PickerCard: React.FC<{ item: BackpackItem; selected: boolean }> = ({ item, selected }) => (
  <div
    className={[
      styles.tokens.card.base,
      styles.tokens.card.hover,
      selected ? styles.tokens.card.selected : styles.semantic.muted.border,
      "h-full",
    ].join(" ")}
  >
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-bold text-slate-950">{item.name}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.id}</div>
        </div>
        <TypeBadge type={item.type} />
      </div>

      <p className="text-sm leading-6 text-slate-600">{item.description}</p>

      <div className="mt-auto flex flex-wrap gap-2">
        <InfoPill label={`Roll ${item.roll}`} />
      </div>
    </div>
  </div>
);

const BackpackItemCard: React.FC<{ item: BackpackItem }> = ({ item }) => (
  <div className={styles.tokens.panel.muted}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-semibold text-slate-950">{item.name}</div>
        <p className="mt-1 text-sm text-slate-600">{item.description}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <TypeBadge type={item.type} />
        <span className={`${styles.tokens.pill.base} ${styles.tokens.pill.accent}`}>
          Roll {item.roll}
        </span>
        {typeof item.quantity === "number" ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Qty {item.quantity}</span>
        ) : null}
      </div>
    </div>
  </div>
);

const TypeBadge: React.FC<{ type?: BackpackItem["type"] }> = ({ type }) => {
  const normalizedType = type || "loot";
  const className =
    normalizedType === "consumables"
      ? "border-sky-200 bg-sky-50 text-sky-800"
      : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <span className={`${styles.tokens.pill.base} ${className}`}>
      {normalizedType}
    </span>
  );
};

const InfoPill: React.FC<{ label: string; muted?: boolean }> = ({ label, muted = false }) => (
  <span
    className={[
      styles.tokens.pill.base,
      muted ? styles.tokens.pill.muted : styles.tokens.pill.info,
    ].join(" ")}
  >
    {label}
  </span>
);

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className={styles.tokens.emptyState}>{text}</div>
);

export default BackpackTab;
