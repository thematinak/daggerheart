import React, { useMemo, useState } from "react";
import ArmorCard from "../../../common/components/ArmorCard";
import H3 from "../../../common/components/H3";
import ModalCardPicker, {
  ModalCardPickerFilter,
} from "../../../common/components/ModalCardPicker";
import WeaponCard from "../../../common/components/WeaponCard";
import { useCommonData } from "../../../common/contexts/CommonDataProvider";
import { ArmorItem } from "../../../common/types/Armor";
import { SelectedWeapons, WeaponItem } from "../../../common/types/Weapon";
import styles from "../../../common/types/cssColor";
import { BURDENS, RANGES, TIERS, WEAPON_TRAITS, WEIGHTS } from "../../../common/utils/filters";
import { mapArmorWeight } from "../../../common/utils/funks";

type GearCardProps = {
  proficiency: number;
  selected: {
    weapons: SelectedWeapons;
    armor: ArmorItem | null;
  };
  onSelect: (selected: {
    weapons: SelectedWeapons;
    armor: ArmorItem | null;
  }) => void;
};

type PickerState = {
  primary: boolean;
  secondary: boolean;
  armor: boolean;
};

const GearCard: React.FC<GearCardProps> = ({
  proficiency,
  selected,
  onSelect,
}) => {
  const {
    commonData: {
      list: { weapons: allWeapons, armor: allArmor },
    },
  } = useCommonData();
  const [pickerState, setPickerState] = useState<PickerState>({
    primary: false,
    secondary: false,
    armor: false,
  });

  const { weapons, armor } = selected;
  const primary = weapons.primary;
  const secondary = weapons.secondary;
  const canUseSecondary = primary?.burden === "one-handed";

  const primaryWeaponOptions = useMemo(
    () => allWeapons.filter((weapon) => weapon.slot === "primary"),
    [allWeapons]
  );
  const secondaryWeaponOptions = useMemo(
    () => allWeapons.filter((weapon) => weapon.slot === "secondary"),
    [allWeapons]
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
        options: TIERS,
        getValue: (weapon) => weapon.tier,
      },
      {
        id: "burden",
        label: "Burden",
        type: "select",
        options: BURDENS,
        getValue: (weapon) => weapon.burden,
      }, 
      {
        id: "trait",
        label: "Trait",
        type: "select",
        options: WEAPON_TRAITS,
        getValue: (weapon) => weapon.attribute
      },
      {
        id: "range",
        label: "Range",
        type: "select",
        options: RANGES,
        getValue: (weapon) => weapon.range,
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
        getValue: (item) => item.name,
      },
      {
        id: "tier",
        label: "Tier",
        type: "select",
        options: TIERS,
        getValue: (item) => item.tier,
      },
      {
        id: "weight",
        label: "Weight",
        type: "select",
        options: WEIGHTS,
        getValue: (item) => mapArmorWeight(item.baseScore),
      },
    ],
    []
  );

  const setPrimary = (weapon: WeaponItem | null) => {
    if (!weapon) {
      onSelect({
        ...selected,
        weapons: { primary: null, secondary: null },
      });
      return;
    }

    if (weapon.burden === "two-handed") {
      onSelect({
        ...selected,
        weapons: { primary: weapon, secondary: null },
      });
      return;
    }

    onSelect({
      ...selected,
      weapons: { ...weapons, primary: weapon },
    });
  };

  const setSecondary = (weapon: WeaponItem | null) => {
    onSelect({
      ...selected,
      weapons: { ...weapons, secondary: weapon },
    });
  };

  const setArmor = (nextArmor: ArmorItem | null) => {
    onSelect({
      ...selected,
      armor: nextArmor,
    });
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-3 md:grid-cols-3">
        <GearSlotPanel
          title="Primary Weapon"
          description="Your main weapon determines whether you can equip an off-hand option."
          emptyText="No primary weapon selected yet."
          actions={
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPickerState((current) => ({ ...current, primary: true }))}
                className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
              >
                {primary ? "Change primary weapon" : "Select primary weapon"}
              </button>
              {primary ? (
                <button
                  type="button"
                  onClick={() => setPrimary(null)}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
                >
                  Remove selection
                </button>
              ) : null}
            </div>
          }
        >
          {primary ? (
            <WeaponCard
              weapon={primary}
              proficiency={proficiency}
              selected={false}
              onSelect={() => {}}
              onDeselect={() => {}}
            />
          ) : null}
        </GearSlotPanel>

        <GearSlotPanel
          title="Secondary Weapon"
          description="Available only when your primary weapon is one-handed."
          emptyText={
            primary
              ? "This primary weapon does not allow a secondary slot."
              : "Select a primary weapon first to unlock the secondary slot."
          }
          actions={
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPickerState((current) => ({ ...current, secondary: true }))}
                disabled={!canUseSecondary}
                className={`${styles.tokens.button.base} ${styles.tokens.button.primary} disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {secondary ? "Change secondary weapon" : "Select secondary weapon"}
              </button>
              {secondary ? (
                <button
                  type="button"
                  onClick={() => setSecondary(null)}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
                >
                  Remove selection
                </button>
              ) : null}
            </div>
          }
        >
          {canUseSecondary && secondary ? (
            <WeaponCard
              weapon={secondary}
              proficiency={proficiency}
              selected={false}
              onSelect={() => {}}
              onDeselect={() => {}}
            />
          ) : null}
        </GearSlotPanel>

        <GearSlotPanel
          title="Armor"
          description="Balance protection, thresholds, and special armor abilities."
          emptyText="No armor selected yet."
          actions={
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setPickerState((current) => ({ ...current, armor: true }))}
                className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
              >
                {armor ? "Change armor" : "Select armor"}
              </button>
              {armor ? (
                <button
                  type="button"
                  onClick={() => setArmor(null)}
                  className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
                >
                  Remove selection
                </button>
              ) : null}
            </div>
          }
        >
          {armor ? (
            <ArmorCard
              armor={armor}
              selected={false}
              onSelect={() => {}}
              onDeselect={() => {}}
            />
          ) : null}
        </GearSlotPanel>
      </div>

      <ModalCardPicker
        isOpen={pickerState.primary}
        eyebrow="Gear"
        title="Select Primary Weapon"
        items={primaryWeaponOptions}
        cardsGridClassName="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))]"
        filters={weaponPickerFilters}
        getItemId={(weapon) => weapon.id}
        onClose={() => setPickerState((current) => ({ ...current, primary: false }))}
        onConfirm={(weapon) => {
          setPrimary(weapon);
          setPickerState((current) => ({ ...current, primary: false }));
        }}
        emptyText="No primary weapons match the selected filters."
        detailEmptyText="Select a primary weapon to see more detail."
        quantityEnabled={false}
        confirmLabel={(weapon) => `Select ${weapon.name}`}
        renderCard={(weapon, isSelected) => (
          <WeaponCard
            weapon={weapon}
            proficiency={proficiency}
            selected={isSelected}
            onSelect={() => {}}
            onDeselect={() => {}}
          />
        )}
        renderDetail={(weapon) => (
          <WeaponCard
            weapon={weapon}
            proficiency={proficiency}
            selected={false}
            onSelect={() => {}}
            onDeselect={() => {}}
          />
        )}
      />

      <ModalCardPicker
        isOpen={pickerState.secondary}
        eyebrow="Gear"
        title="Select Secondary Weapon"
        items={secondaryWeaponOptions}
        cardsGridClassName="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))]"
        filters={weaponPickerFilters}
        getItemId={(weapon) => weapon.id}
        onClose={() => setPickerState((current) => ({ ...current, secondary: false }))}
        onConfirm={(weapon) => {
          setSecondary(weapon);
          setPickerState((current) => ({ ...current, secondary: false }));
        }}
        emptyText="No secondary weapons match the selected filters."
        detailEmptyText="Select a secondary weapon to see more detail."
        quantityEnabled={false}
        confirmLabel={(weapon) => `Select ${weapon.name}`}
        renderCard={(weapon, isSelected) => (
          <WeaponCard
            weapon={weapon}
            proficiency={proficiency}
            selected={isSelected}
            onSelect={() => {}}
            onDeselect={() => {}}
          />
        )}
        renderDetail={(weapon) => (
          <WeaponCard
            weapon={weapon}
            proficiency={proficiency}
            selected={false}
            onSelect={() => {}}
            onDeselect={() => {}}
          />
        )}
      />

      <ModalCardPicker
        isOpen={pickerState.armor}
        eyebrow="Gear"
        title="Select Armor"
        items={allArmor}
        cardsGridClassName="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(24rem,1fr))]"
        filters={armorPickerFilters}
        getItemId={(item) => item.id}
        onClose={() => setPickerState((current) => ({ ...current, armor: false }))}
        onConfirm={(item) => {
          setArmor(item);
          setPickerState((current) => ({ ...current, armor: false }));
        }}
        emptyText="No armor matches the selected filters."
        detailEmptyText="Select armor to see more detail."
        quantityEnabled={false}
        confirmLabel={(item) => `Select ${item.name}`}
        renderCard={(item, isSelected) => (
          <ArmorCard
            armor={item}
            selected={isSelected}
            onSelect={() => {}}
            onDeselect={() => {}}
          />
        )}
        renderDetail={(item) => (
          <ArmorCard
            armor={item}
            selected={false}
            onSelect={() => {}}
            onDeselect={() => {}}
          />
        )}
      />
    </>
  );
};

const GearSlotPanel: React.FC<{
  title: string;
  description: string;
  emptyText: string;
  actions: React.ReactNode;
  children?: React.ReactNode;
}> = ({ title, description, emptyText, actions, children }) => (
  <section className={`${styles.tokens.panel.base} grid gap-4`}>
    <div className="flex flex-col gap-2">
      <H3>{title}</H3>
      <p className={styles.tokens.text.muted}>{description}</p>
    </div>

    {children ? children : <EmptyState text={emptyText} />}

    <div>{actions}</div>
  </section>
);

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className={styles.tokens.emptyState}>{text}</div>
);

export default GearCard;
