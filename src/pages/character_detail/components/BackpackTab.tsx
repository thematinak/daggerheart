import React, { useState } from "react";
import WeaponCard from "../../../common/components/WeaponCard";
import ArmorCard from "../../../common/components/ArmorCard";
import ModalCardPicker from "../../../common/components/ModalCardPicker";
import { Character } from "../../../common/types/Character";
import { BackpackItem } from "../../../common/types/BackpackItem";
import { WeaponItem } from "../../../common/types/Weapon";
import { ArmorItem } from "../../../common/types/Armor";
import { useCommonData, useNotifications } from "../../../common/contexts/CommonDataProvider";
import styles from "../../../common/types/cssColor";
import Eyebrow from "../../../common/components/Eyebrow";
import H2 from "../../../common/components/H2";
import SplitBar from "../../../common/components/SplitBar";
import { ARMOR_PICKER_FILTERS, ITEM_PICKER_FILTERS, WEAPON_PICKER_FILTERS } from "../../../common/utils/filters";
import { CharacterCommand, postCharacterCommands } from "../../../common/endponts/common";
import Bank from "./Bank";

type BackpackTabProps = {
  character: Character;
  onCharacterUpdated: () => Promise<void>;
};

type PickerState = {
  item: boolean;
  weapon: boolean;
  armor: boolean;
};

type PendingSelectionsState = {
  items: BackpackItem[];
  weapons: WeaponItem[];
  armor: ArmorItem[];
};

type ActionState = {
  savePending: boolean;
  equipEquipment: boolean;
  removeEquipment: boolean;
};

const BackpackTab: React.FC<BackpackTabProps> = ({ character, onCharacterUpdated }) => {
  const { commonData: { list: { backpackItems, weapons, armor } } } = useCommonData();
  const [pickerState, setPickerState] = useState<PickerState>({ item: false, weapon: false, armor: false });
  const [pendingSelections, setPendingSelections] = useState<PendingSelectionsState>({ items: [], weapons: [], armor: []});
  const [actionState, setActionState] = useState<ActionState>({ savePending: false, equipEquipment: false, removeEquipment: false});
  const { showError, showInfo, showWarning } = useNotifications();

  const addPendingItem = (selectedItem: BackpackItem, quantity: number) => {
    setPendingSelections((current) => ({
      ...current,
      items: [...current.items, { ...selectedItem, quantity }],
    }));
    setPickerState((current) => ({ ...current, item: false }));
  };

  const addPendingWeapon = (selectedWeapon: WeaponItem) => {
    setPendingSelections((current) => ({
      ...current,
      weapons: [...current.weapons, selectedWeapon],
    }));
    setPickerState((current) => ({ ...current, weapon: false }));
  };

  const addPendingArmor = (selectedArmor: ArmorItem) => {
    setPendingSelections((current) => ({
      ...current,
      armor: [...current.armor, selectedArmor],
    }));
    setPickerState((current) => ({ ...current, armor: false }));
  };

  const removePendingItem = (indexToRemove: number) => {
    setPendingSelections((current) => ({
      ...current,
      items: current.items.filter((_, index) => index !== indexToRemove),
    }));
  };
  const removePendingWeapon = (indexToRemove: number) => {
    setPendingSelections((current) => ({
      ...current,
      weapons: current.weapons.filter((_, index) => index !== indexToRemove),
    }));
  };
  const removePendingArmor = (indexToRemove: number) => {
    setPendingSelections((current) => ({
      ...current,
      armor: current.armor.filter((_, index) => index !== indexToRemove),
    }));
  };

  const hasPendingChanges =
    pendingSelections.items.length > 0 ||
    pendingSelections.weapons.length > 0 ||
    pendingSelections.armor.length > 0;

  const postCommands = async (commands: CharacterCommand[]) => {
    await postCharacterCommands(character.id, commands)
    await onCharacterUpdated();
  };

  const handleSavePending = async () => {
    if (!hasPendingChanges) {
      return;
    }

    const commands: CharacterCommand[] = [
      ...pendingSelections.items.map((item) => ({
        action: "add" as const,
        target: "item" as const,
        id: item.id,
        quantity: Math.max(1, item.quantity ?? 1),
      })),
      ...pendingSelections.weapons.map((weapon) => ({
        action: "add" as const,
        target: "weapon" as const,
        id: weapon.id,
      })),
      ...pendingSelections.armor.map((armor) => ({
        action: "add" as const,
        target: "armor" as const,
        id: armor.id,
      })),
    ];

    try {
      setActionState((current) => ({ ...current, savePending: true }));

      await postCommands(commands);

      setPendingSelections({
        items: [],
        weapons: [],
        armor: [],
      });
      showInfo("Pending additions were saved to the character.", "Inventory Saved");
    } catch (error: any) {
      showError(error.message || "Failed to save pending additions.", "Inventory Save Failed");
    } finally {
      setActionState((current) => ({ ...current, savePending: false }));
    }
  };

  const handleEquipEquipment = async (target: "weapon" | "armor", id: string) => {
    try {
      setActionState((current) => ({ ...current, equipEquipment: true }));

      await postCommands([
        {
          action: "equip",
          target,
          id,
        },
      ]);
      showInfo(`${target === "weapon" ? "Weapon" : "Armor"} equipped successfully.`, "Equipment Updated");
    } catch (error: any) {
      showError(error.message || `Failed to equip ${target}.`, "Equip Failed");
    } finally {
      setActionState((current) => ({ ...current, equipEquipment: false }));
    }
  };

  const handleRemoveEquipment = async (target: "weapon" | "armor", id: string) => {
    try {
      setActionState((current) => ({ ...current, removeEquipment: true }));

      await postCommands([
        {
          action: "remove",
          target,
          id,
        },
      ]);
      showWarning(`${target === "weapon" ? "Weapon" : "Armor"} removed from storage.`, "Equipment Removed");
    } catch (error: any) {
      showError(error.message || `Failed to remove ${target}.`, "Remove Failed");
    } finally {
      setActionState((current) => ({ ...current, removeEquipment: false }));
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
            <h3 className="mb-4 text-xl font-bold text-[var(--text-primary)]">Backpack Items</h3>
            <div className="grid gap-3">
              {character.backpack.length > 0 ? (
                character.backpack.map((item) => <BackpackItemCard key={`${item.id}-owned`} item={item} />)
              ) : (
                <EmptyState text="Backpack is empty." />
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold text-[var(--text-primary)]">Stored Equipment</h3>
            <div className="grid gap-4">
              {character.weaponInventory.length > 0 ? (
                character.weaponInventory.map((weapon) => (
                  <div key={weapon.id} className="grid gap-2">
                    <WeaponCard weapon={weapon} proficiency={character.proficiency} selected={false} onSelect={() => {}} onDeselect={() => {}} />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment("weapon", weapon.id)}
                        disabled={actionState.removeEquipment || actionState.equipEquipment}
                        className={`${styles.tokens.button.base} ${styles.tokens.button.danger} mr-2 disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {actionState.removeEquipment ? "Removing..." : "Remove"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEquipEquipment("weapon", weapon.id)}
                        disabled={actionState.equipEquipment || actionState.removeEquipment}
                        className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {actionState.equipEquipment ? "Equipping..." : "Equip"}
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
                        disabled={actionState.removeEquipment || actionState.equipEquipment}
                        className={`${styles.tokens.button.base} ${styles.tokens.button.danger} mr-2 disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {actionState.removeEquipment ? "Removing..." : "Remove"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEquipEquipment("armor", armor.id)}
                        disabled={actionState.equipEquipment || actionState.removeEquipment}
                        className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {actionState.equipEquipment ? "Equipping..." : "Equip"}
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
            <h3 className="mb-4 text-xl font-bold text-[var(--text-primary)]">Add To Character</h3>
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setPickerState((current) => ({ ...current, item: true }))}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
                >
                  Add item
                </button>
                <button
                  type="button"
                  onClick={() => setPickerState((current) => ({ ...current, weapon: true }))}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
                >
                  Add weapon
                </button>
                <button
                  type="button"
                  onClick={() => setPickerState((current) => ({ ...current, armor: true }))}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
                >
                  Add armor
                </button>
              </div>

              <div className="grid gap-3">
                <div>
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Pending item additions</div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Prepared additions can be saved straight to the character.</p>
                </div>

                {pendingSelections.items.length > 0 ? (
                  pendingSelections.items.map((item, index) => (
                    <div
                      key={`${item.id}-pending-${index}`}
                      className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</div>
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePendingItem(index)}
                          className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} rounded-full px-3 py-1 text-xs uppercase tracking-wide`}
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
                <div className="text-sm font-semibold text-[var(--text-primary)]">Pending weapon additions</div>
                {pendingSelections.weapons.length > 0 ? (
                  pendingSelections.weapons.map((weapon, index) => (
                    <div key={`${weapon.id}-pending-weapon-${index}`} className="grid gap-2">
                      <WeaponCard
                        weapon={weapon}
                        proficiency={character.proficiency}
                        selected={false}
                        onSelect={() => {}}
                        onDeselect={() => {}}
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePendingWeapon(index)}
                          className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} rounded-full px-3 py-1 text-xs uppercase tracking-wide`}
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
                <div className="text-sm font-semibold text-[var(--text-primary)]">Pending armor additions</div>
                {pendingSelections.armor.length > 0 ? (
                  pendingSelections.armor.map((armor, index) => (
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
                          className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} rounded-full px-3 py-1 text-xs uppercase tracking-wide`}
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
                  <div className="text-sm font-semibold text-[var(--text-primary)]">Save pending additions</div>
                  <p className="text-sm text-[var(--text-muted)]">
                    Items, weapons, and armor will be written to the database and refreshed into the page state.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSavePending}
                    disabled={!hasPendingChanges || actionState.savePending}
                    className={`${styles.tokens.button.base} ${styles.tokens.button.primary} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {actionState.savePending ? "Saving additions..." : "Save pending"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SplitBar />
        
        <Bank character={character} onCharacterUpdated={onCharacterUpdated} />

      </section>

      <ModalCardPicker
        isOpen={pickerState.item}
        eyebrow="Backpack Items"
        title="Select Item"
        items={backpackItems}
        filters={ITEM_PICKER_FILTERS}
        getItemId={(item) => item.id}
        onClose={() => setPickerState((current) => ({ ...current, item: false }))}
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
                <div className="text-lg font-bold text-[var(--text-primary)]">{item.name}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
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
        isOpen={pickerState.weapon}
        eyebrow="Weapons"
        title="Select Weapon"
        items={weapons}
        cardsGridClassName="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))]"
        filters={WEAPON_PICKER_FILTERS}
        getItemId={(weapon) => weapon.id}
        onClose={() => setPickerState((current) => ({ ...current, weapon: false }))}
        onConfirm={(weapon) => addPendingWeapon(weapon)}
        emptyText="No weapons match the selected filters."
        detailEmptyText="Select a weapon to see more detail."
        quantityEnabled={false}
        confirmLabel={(weapon) => `Add ${weapon.name}`}
        renderCard={(weapon, selected) => (
          <WeaponCard weapon={weapon} proficiency={character.proficiency} selected={selected} onSelect={() => {}} onDeselect={() => {}} />
        )}
        renderDetail={(weapon) => (
          <WeaponCard weapon={weapon} proficiency={character.proficiency} selected={false} onSelect={() => {}} onDeselect={() => {}} />
        )}
      />

      <ModalCardPicker
        isOpen={pickerState.armor}
        eyebrow="Armor"
        title="Select Armor"
        items={armor}
        cardsGridClassName="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))]"
        filters={ARMOR_PICKER_FILTERS}
        getItemId={(armor) => armor.id}
        onClose={() => setPickerState((current) => ({ ...current, armor: false }))}
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
          <div className="text-base font-bold text-[var(--text-primary)]">{item.name}</div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">{item.id}</div>
        </div>
        <TypeBadge type={item.type} />
      </div>

      <p className="text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>

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
        <div className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</div>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.description}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <TypeBadge type={item.type} />
        <span className={`${styles.tokens.pill.base} ${styles.tokens.pill.accent}`}>
          Roll {item.roll}
        </span>
        {typeof item.quantity === "number" ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Qty {item.quantity}</span>
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
