import React from "react";
import WeaponCard from "../../../common/components/WeaponCard";
import ArmorCard from "../../../common/components/ArmorCard";
import { Character } from "../../../common/types/Character";
import styles from "../../../common/types/cssColor";

type BackpackTabProps = {
  character: Character;
};

const BackpackTab: React.FC<BackpackTabProps> = ({ character }) => (
  <div className="grid gap-6">
    <section className={`${styles.tokens.page.section} p-5 sm:p-6 lg:p-8`}>
      <div className="mb-5 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
          Inventory
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Backpack & Equipment
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm">
          <h3 className="mb-4 text-xl font-bold text-slate-950">Backpack Items</h3>
          <div className="grid gap-3">
            {character.backpack.length > 0 ? (
              character.backpack.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{item.name}</div>
                      <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                    </div>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                      Roll {item.roll}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState text="Backpack is empty." />
            )}
          </div>
        </section>

        <section className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm">
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
  </div>
);

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
    {text}
  </div>
);

export default BackpackTab;
