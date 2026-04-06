import React from "react";
import WeaponFilterList from "../../../common/components/WeaponFilterList";
import ArmorFilterList from "../../../common/components/ArmorFilterList";
import { NextPreviousButton } from "./NextButton";
import { SelectedWeapons, WeaponItem } from "../../../common/types/Weapon";
import { ArmorItem } from "../../../common/types/Armor";
import styles from "../../../common/types/cssColor";

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

  return (
    <div className={`${styles.tokens.page.section} flex flex-col gap-8 p-5 sm:p-6 lg:p-8`}>
      <div className="text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
          Character Builder
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Choose Your Gear
        </h2>
        <p className={`mx-auto mt-3 max-w-2xl ${styles.tokens.page.subtitle}`}>
          Pick the weapons and armor that define how your character enters the fight.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-950">Select Primary Weapon</h3>
            <p className="mt-1 text-sm text-slate-500">
              Your main weapon determines whether you can equip an off-hand option.
            </p>
          </div>

          <WeaponFilterList
            selected={primary}
            onSelect={setPrimary}
            forcedSlot="primary"
          />
        </div>

        {canUseSecondary && (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-950">Optional Secondary Weapon</h3>
              <p className="mt-1 text-sm text-slate-500">
                One-handed primary weapons let you carry a second option.
              </p>
            </div>

            <WeaponFilterList
              selected={secondary}
              onSelect={setSecondary}
              forcedSlot="secondary"
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-slate-950">Select Armor</h3>
            <p className="mt-1 text-sm text-slate-500">
              Balance protection, thresholds, and special armor abilities.
            </p>
          </div>

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
      </div>

      {(showBack || showNext) && (
        <NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext} />
      )}
    </div>
  );
};

export default GearCard;
