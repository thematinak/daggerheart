import React from "react";
import WeaponCard, { WeaponItem } from "../../../common/components/WeaponCard";
import ArmorCard, { ArmorItem } from "../../../common/components/ArmorCard";


type GearCardProps = {
  weaponItems: WeaponItem[];
  armorItems: ArmorItem[];
  selected: {
    weapon: WeaponItem | null;
    armor: ArmorItem | null;
  };
  onSelect: (selected: { weapon: WeaponItem | null; armor: ArmorItem | null }) => void;

  showNext?: boolean;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
};

const GearCard: React.FC<GearCardProps> = ({
  weaponItems,
  armorItems,
  selected,
  onSelect,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
}) => {
  return (
    <div className="flex flex-col gap-8">

      {/* Weapons */}
      <div>
        <h2 className="text-center text-2xl font-bold mb-4">Select Weapon</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weaponItems.map((w) => (
            <WeaponCard
              key={w.id}
              weapon={w}
              selected={selected.weapon?.id === w.id}
              onSelect={() => onSelect({ ...selected, weapon: w })}
              onDeselect={() => onSelect({ ...selected, weapon: null })}
            />
          ))}
        </div>
      </div>

      {/* Armors */}
      <div>
        <h2 className="text-center text-2xl font-bold mb-4">Select Armor</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {armorItems.map((a) => (
            <ArmorCard
              key={a.id}
              armor={a}
              selected={selected.armor?.id === a.id}
              onSelect={() => onSelect({ ...selected, armor: a })}
              onDeselect={() => onSelect({ ...selected, armor: null })}
            />
          ))}
        </div>
      </div>

      {(showBack || showNext) && (
        <div className="flex justify-between mt-4">

          {showBack ? (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
            >
              Previous
            </button>
          ) : <div />}

          {showNext ? (
            <button
              onClick={onNext}
              disabled={!selected.weapon || !selected.armor}
              className={`px-4 py-2 rounded-lg font-semibold 
                ${!selected.weapon || !selected.armor
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-yellow-400 text-white hover:bg-yellow-500"}
              `}
            >
              Next
            </button>
          ) : <div />}

        </div>
      )}
    </div>
  );
};

export default GearCard;


