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
import Eyebrow from "../../../common/components/Eyebrow";
import H2 from "../../../common/components/H2";
import SplitBar from "../../../common/components/SplitBar";

type BackpackTabProps = {
  character: Character;
  onCharacterUpdated: () => Promise<void>;
};

type CharacterCommand =
  | { action: "add" | "remove"; target: "bank"; value: number }
  | { action: "add"; target: "item"; id: string; quantity: number }
  | { action: "add" | "remove" | "equip"; target: "weapon" | "armor"; id: string };

const BackpackTab: React.FC<BackpackTabProps> = ({ character, onCharacterUpdated }) => {
  const { commonData } = useCommonData();
  const [isItemPickerOpen, setIsItemPickerOpen] = useState(false);
  const [isWeaponPickerOpen, setIsWeaponPickerOpen] = useState(false);
  const [isArmorPickerOpen, setIsArmorPickerOpen] = useState(false);
  const [pendingItems, setPendingItems] = useState<BackpackItem[]>([]);
  const [pendingWeapons, setPendingWeapons] = useState<WeaponItem[]>([]);
  const [pendingArmor, setPendingArmor] = useState<ArmorItem[]>([]);
  const [isSavingBank, setIsSavingBank] = useState(false);
  const [isSavingPending, setIsSavingPending] = useState(false);
  const [isEquippingEquipment, setIsEquippingEquipment] = useState(false);
  const [isRemovingEquipment, setIsRemovingEquipment] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

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

  const hasPendingChanges = pendingItems.length > 0 || pendingWeapons.length > 0 || pendingArmor.length > 0;

  const postCommands = async (commands: CharacterCommand[]) => {
    const response = await fetch("http://pecen.eu/daggerheart/api1/character.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        character_id: character.id,
        commands,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save character changes");
    }

    await onCharacterUpdated();
  };

  const handleBankChange = async (action: "add" | "remove", value: number) => {
    try {
      setIsSavingBank(true);
      setSaveError(null);
      setSaveMessage(null);

      await postCommands([
        {
          action,
          target: "bank",
          value,
        },
      ]);

      setSaveMessage(`Bank was ${action === "add" ? "updated" : "reduced"}.`);
    } catch (error: any) {
      setSaveError(error.message || "Failed to update bank.");
    } finally {
      setIsSavingBank(false);
    }
  };

  const handleSavePending = async () => {
    if (!hasPendingChanges) {
      return;
    }

    const commands: CharacterCommand[] = [
      ...pendingItems.map((item) => ({
        action: "add" as const,
        target: "item" as const,
        id: item.id,
        quantity: Math.max(1, item.quantity ?? 1),
      })),
      ...pendingWeapons.map((weapon) => ({
        action: "add" as const,
        target: "weapon" as const,
        id: weapon.id,
      })),
      ...pendingArmor.map((armor) => ({
        action: "add" as const,
        target: "armor" as const,
        id: armor.id,
      })),
    ];

    try {
      setIsSavingPending(true);
      setSaveError(null);
      setSaveMessage(null);

      await postCommands(commands);

      setPendingItems([]);
      setPendingWeapons([]);
      setPendingArmor([]);
      setSaveMessage("Pending additions were saved.");
    } catch (error: any) {
      setSaveError(error.message || "Failed to save pending additions.");
    } finally {
      setIsSavingPending(false);
    }
  };

  const handleEquipEquipment = async (target: "weapon" | "armor", id: string) => {
    try {
      setIsEquippingEquipment(true);
      setSaveError(null);
      setSaveMessage(null);

      await postCommands([
        {
          action: "equip",
          target,
          id,
        },
      ]);

      setSaveMessage(`${target === "weapon" ? "Weapon" : "Armor"} equipped.`);
    } catch (error: any) {
      setSaveError(error.message || `Failed to equip ${target}.`);
    } finally {
      setIsEquippingEquipment(false);
    }
  };

  const handleRemoveEquipment = async (target: "weapon" | "armor", id: string) => {
    try {
      setIsRemovingEquipment(true);
      setSaveError(null);
      setSaveMessage(null);

      await postCommands([
        {
          action: "remove",
          target,
          id,
        },
      ]);

      setSaveMessage(`${target === "weapon" ? "Weapon" : "Armor"} removed.`);
    } catch (error: any) {
      setSaveError(error.message || `Failed to remove ${target}.`);
    } finally {
      setIsRemovingEquipment(false);
    }
  };

  return (
    <div className="grid gap-6">
      <section className={`${styles.tokens.page.section} p-5 sm:p-6 lg:p-8`}>
        <div className="mb-5 text-center">
          <Eyebrow eyebrow="Inventory" />
          <H2>Backpack & Equipment</H2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xl font-bold text-slate-950">Backpack Items</h3>
            <div className="grid gap-3">
              {character.backpack.length > 0 ? (
                character.backpack.map((item) => <BackpackItemCard key={`${item.id}-owned`} item={item} />)
              ) : (
                <EmptyState text="Backpack is empty." />
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold text-slate-950">Stored Equipment</h3>
            <div className="grid gap-4">
              {character.weaponInventory.length > 0 ? (
                character.weaponInventory.map((weapon) => (
                  <div key={weapon.id} className="grid gap-2">
                    <WeaponCard weapon={weapon} selected={false} onSelect={() => {}} onDeselect={() => {}} />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment("weapon", weapon.id)}
                        disabled={isRemovingEquipment || isEquippingEquipment}
                        className={`${styles.tokens.button.base} ${styles.tokens.button.danger} mr-2 disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {isRemovingEquipment ? "Removing..." : "Remove"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEquipEquipment("weapon", weapon.id)}
                        disabled={isEquippingEquipment || isRemovingEquipment}
                        className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {isEquippingEquipment ? "Equipping..." : "Equip"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState text="No stored weapons." />
              )}

              {character.armorInventory.length > 0 ? (
                character.armorInventory.map((armor) => (
                  <div key={armor.id} className="grid gap-2">
                    <ArmorCard armor={armor} selected={false} onSelect={() => {}} onDeselect={() => {}} />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment("armor", armor.id)}
                        disabled={isRemovingEquipment || isEquippingEquipment}
                        className={`${styles.tokens.button.base} ${styles.tokens.button.danger} mr-2 disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {isRemovingEquipment ? "Removing..." : "Remove"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEquipEquipment("armor", armor.id)}
                        disabled={isEquippingEquipment || isRemovingEquipment}
                        className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {isEquippingEquipment ? "Equipping..." : "Equip"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState text="No stored armor." />
              )}
            </div>
          </div>
        </div>

        <SplitBar />

        <div>
          <div>
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
                  className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
                >
                  Add weapon
                </button>
                <button
                  type="button"
                  onClick={() => setIsArmorPickerOpen(true)}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
                >
                  Add armor
                </button>
              </div>

              <div className="grid gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-950">Pending item additions</div>
                  <p className="mt-1 text-sm text-slate-500">Prepared additions can be saved straight to the character.</p>
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

              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold text-slate-950">Save pending additions</div>
                  <p className="text-sm text-slate-500">
                    Items, weapons, and armor will be written to the database and refreshed into the page state.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSavePending}
                    disabled={!hasPendingChanges || isSavingPending}
                    className={`${styles.tokens.button.base} ${styles.tokens.button.primary} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {isSavingPending ? "Saving additions..." : "Save pending"}
                  </button>

                  {saveMessage ? <span className="text-sm font-medium text-emerald-700">{saveMessage}</span> : null}
                  {saveError ? <span className="text-sm font-medium text-rose-700">{saveError}</span> : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <SplitBar />
        
        <div className="grid gap-4">
          <div>
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
              onAdd={() => handleBankChange("add", BANK_VALUES.chest)}
              onRemove={() => handleBankChange("remove", BANK_VALUES.chest)}
              disabled={isSavingBank}
            />
            <BankUnitCard
              icon={<ShoppingBag size={18} />}
              label="Bags"
              value={bankBreakdown.bags}
              note="1 bag = 10 handful"
              onAdd={() => handleBankChange("add", BANK_VALUES.bag)}
              onRemove={() => handleBankChange("remove", BANK_VALUES.bag)}
              disabled={isSavingBank}
            />
            <BankUnitCard
              icon={<Coins size={18} />}
              label="Handful"
              value={bankBreakdown.handful}
              note="Loose coin"
              onAdd={() => handleBankChange("add", BANK_VALUES.handful)}
              onRemove={() => handleBankChange("remove", BANK_VALUES.handful)}
              disabled={isSavingBank}
            />
          </div>
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

const BANK_VALUES = {
  chest: 130,
  bag: 10,
  handful: 1,
};

const BankUnitCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  note: string;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
}> = ({ icon, label, value, note, onAdd, onRemove, disabled = false }) => (
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
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        -
      </button>
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="flex-1 rounded-xl border border-amber-300 bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900 transition hover:border-amber-400 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        +
      </button>
    </div>
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
