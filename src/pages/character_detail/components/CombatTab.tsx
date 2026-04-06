import React from "react";
import { ScrollText, Shield, Sparkles, Swords } from "lucide-react";
import StatsBar, { buildStatsFromCharacter } from "../../../common/components/StatsBar";
import WeaponCard from "../../../common/components/WeaponCard";
import ArmorCard from "../../../common/components/ArmorCard";
import { Character } from "../../../common/types/Character";
import styles from "../../../common/types/cssColor";

type CombatTabProps = {
  character: Character;
  stats: ReturnType<typeof buildStatsFromCharacter>;
};

const CombatTab: React.FC<CombatTabProps> = ({ character, stats }) => (
  <div className="flex flex-col gap-6">
    <section className={`${styles.tokens.page.section} p-5 sm:p-6 lg:p-8`}>
      <div className="mb-5 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
          Actions
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Action Loadout
        </h2>
      </div>
      <StatsBar stats={stats} />
    </section>

    <div className="grid gap-4 lg:grid-cols-2">
      <section className={`${styles.tokens.page.section} p-5 sm:p-6`}>
        <div className="mb-4 flex items-center gap-2 text-slate-950">
          <Swords size={18} />
          <h3 className="text-xl font-bold">Equipped Weapons</h3>
        </div>
        <div className="grid gap-4">
          {character.weapons.primary ? (
            <WeaponCard weapon={character.weapons.primary} selected={false} onSelect={() => {}} onDeselect={() => {}} />
          ) : (
            <EmptyState text="No primary weapon equipped." />
          )}
          {character.weapons.secondary ? (
            <WeaponCard weapon={character.weapons.secondary} selected={false} onSelect={() => {}} onDeselect={() => {}} />
          ) : (
            <EmptyState text="No secondary weapon equipped." />
          )}
        </div>
      </section>

      <section className={`${styles.tokens.page.section} p-5 sm:p-6`}>
        <div className="mb-4 flex items-center gap-2 text-slate-950">
          <Shield size={18} />
          <h3 className="text-xl font-bold">Armor & Thresholds</h3>
        </div>
        <div className="grid gap-4">
          {character.armor ? (
            <ArmorCard armor={character.armor} selected={false} onSelect={() => {}} onDeselect={() => {}} />
          ) : (
            <EmptyState text="No armor equipped." />
          )}
        </div>
      </section>
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <section className={`${styles.tokens.page.section} p-5 sm:p-6`}>
        <div className="mb-4 flex items-center gap-2 text-slate-950">
          <Sparkles size={18} />
          <h3 className="text-xl font-bold">Hope Feature</h3>
        </div>

        {character.class?.hopeFeature ? (
          <div className="rounded-[1.5rem] border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-700">
              {character.class.name}
            </div>
            <h4 className="mt-2 text-xl font-black text-amber-950">{character.class.hopeFeature}</h4>
            <p className="mt-3 text-sm leading-6 text-amber-900/85">
              {character.class.hopeFeatureDescription || "No hope feature description available."}
            </p>
            <div className="mt-4">
              <button
                type="button"
                className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
              >
                Use Hope Feature
              </button>
            </div>
          </div>
        ) : (
          <EmptyState text="No hope feature available." />
        )}
      </section>

      <section className={`${styles.tokens.page.section} p-5 sm:p-6`}>
        <div className="mb-4 flex items-center gap-2 text-slate-950">
          <ScrollText size={18} />
          <h3 className="text-xl font-bold">Domain Cards</h3>
        </div>

        <div className="grid gap-3">
          {character.domainCards.length > 0 ? (
            character.domainCards.map((domainCard) => (
              <div
                key={domainCard.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Domain Card
                    </div>
                    <h4 className="mt-1 text-lg font-bold text-slate-950">{domainCard.name}</h4>
                  </div>
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                    Level {domainCard.level}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{domainCard.description}</p>
              </div>
            ))
          ) : (
            <EmptyState text="No domain cards equipped." />
          )}
        </div>
      </section>
    </div>
  </div>
);

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
    {text}
  </div>
);

const StatPill: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-center">
    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</div>
    <div className="mt-2 text-2xl font-black text-slate-950">{value}</div>
  </div>
);

export default CombatTab;
