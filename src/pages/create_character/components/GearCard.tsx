import React from "react";
import WeaponFilterList from "../../../common/components/WeaponFilterList";
import ArmorFilterList from "../../../common/components/ArmorFilterList";
import { NextPreviousButton } from "./NextButton";
import { SelectedWeapons, WeaponItem } from "../../../common/types/Weapon";
import { ArmorItem } from "../../../common/types/Armor";

type GearCardProps = {
  selected: {
    weapons: SelectedWeapons;
    armor: ArmorItem | null;
  };

  onSelect: (selected: {
    weapons: SelectedWeapons;
    armor: ArmorItem | null;
  }) => void;

  showNext?: boolean;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
};

const GearCard: React.FC<GearCardProps> = ({
  selected,
  onSelect,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
}) => {
  const { weapons, armor } = selected;

  const primary = weapons.primary;
  const secondary = weapons.secondary;

  const isTwoHanded = primary?.burden === "two-handed";

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
    } else {
      onSelect({
        ...selected,
        weapons: { ...weapons, primary: weapon },
      });
    }
  };

  const setSecondary = (weapon: WeaponItem | null) => {
    onSelect({
      ...selected,
      weapons: { ...weapons, secondary: weapon },
    });
  };

  const canUseSecondary = primary && primary.burden === "one-handed";

  const canContinue = primary && armor;

  return (
    <div className="flex flex-col gap-10">

      {/* PRIMARY WEAPON */}
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-2xl font-bold">
          Select Primary Weapon
        </h2>

        <WeaponFilterList
          selected={primary}
          onSelect={setPrimary}
          forcedSlot="primary"
        />
      </div>

      {canUseSecondary && (
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-2xl font-bold">
          Optional Secondary Weapon
        </h2>

        <WeaponFilterList
          selected={secondary}
          onSelect={setSecondary}
          forcedSlot="secondary"
        />
    </div>
    )}

      {/* ARMOR */}
      <div className="flex flex-col gap-4">
        <h2 className="text-center text-2xl font-bold">
          Select Armor
        </h2>

        <ArmorFilterList
          selected={armor}
          onSelect={(a) =>
            onSelect({
              ...selected,
              armor: a,
            })
          }
        />
      </div>

      {/* NAVIGATION */}
      {(showBack || showNext) && (
        <NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext} />
      )}
    </div>
  );
};

export default GearCard;