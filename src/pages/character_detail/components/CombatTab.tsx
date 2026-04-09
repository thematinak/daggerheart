import React from "react";
import { ScrollText, Shield, Sparkles, Swords } from "lucide-react";
import StatsBar, { buildStatsFromCharacter } from "../../../common/components/StatsBar";
import WeaponCard from "../../../common/components/WeaponCard";
import ArmorCard from "../../../common/components/ArmorCard";
import { Character } from "../../../common/types/Character";
import styles from "../../../common/types/cssColor";
import Eyebrow from "../../../common/components/Eyebrow";
import H2 from "../../../common/components/H2";

type CombatTabProps = {
  character: Character;
  stats: ReturnType<typeof buildStatsFromCharacter>;
  onAdjustCurrentStat: (stat: "health" | "stress" | "armor" | "hope", action: "add" | "remove") => Promise<void>;
  isAdjustingStat: boolean;
};

const CombatTab: React.FC<CombatTabProps> = ({ character, stats, onAdjustCurrentStat, isAdjustingStat }) => (
  <div className="flex flex-col gap-6">
    <section className={`${styles.tokens.page.section} p-5 sm:p-6 lg:p-8`}>
      <div className="mb-5 text-center">
        <Eyebrow eyebrow="Action Actions" />
        <H2>Action Loadout</H2>
      </div>
      <div className="grid gap-4">
        <StatsBar
          stats={stats}
          currentStats={character.currentStats}
        />
      </div>
    </section>

      <section className={styles.tokens.panel.base}>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
            <Shield size={18} />
          </div>
          <div>
            <div className={styles.tokens.text.label}>Combat Tracker</div>
            <h3 className="text-lg font-bold text-slate-950">Current Resources</h3>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ResourceAdjustCard
            label="HP"
            value={`${character.currentStats.hp}/${stats.maxHp}`}
            onDecrease={() => void onAdjustCurrentStat("health", "remove")}
            onIncrease={() => void onAdjustCurrentStat("health", "add")}
            disabled={isAdjustingStat}
          />
          <ResourceAdjustCard
            label="Armor"
            value={`${character.currentStats.armor}/${stats.maxArmor}`}
            onDecrease={() => void onAdjustCurrentStat("armor", "remove")}
            onIncrease={() => void onAdjustCurrentStat("armor", "add")}
            disabled={isAdjustingStat}
          />
          <ResourceAdjustCard
            label="Stress"
            value={`${character.currentStats.stress}/${stats.maxStress}`}
            onDecrease={() => void onAdjustCurrentStat("stress", "remove")}
            onIncrease={() => void onAdjustCurrentStat("stress", "add")}
            disabled={isAdjustingStat}
          />
          <ResourceAdjustCard
            label="Hope"
            value={`${character.currentStats.hope}/${stats.maxHope}`}
            onDecrease={() => void onAdjustCurrentStat("hope", "remove")}
            onIncrease={() => void onAdjustCurrentStat("hope", "add")}
            disabled={isAdjustingStat}
          />
        </div>
      </section>

    <div className="grid gap-4 lg:grid-cols-2">
      <section className={`${styles.tokens.page.section} p-5 sm:p-6`}>
        <div className={`mb-4 flex items-center gap-2 ${styles.tokens.text.heading}`}>
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
        <div className={`mb-4 flex items-center gap-2 ${styles.tokens.text.heading}`}>
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
        <div className={`mb-4 flex items-center gap-2 ${styles.tokens.text.heading}`}>
          <Sparkles size={18} />
          <h3 className="text-xl font-bold">Hope Feature</h3>
        </div>

        {character.class?.hopeFeature ? (
          <div className={styles.tokens.panel.accent}>
            <div className={styles.tokens.page.eyebrow}>
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
        <div className={`mb-4 flex items-center gap-2 ${styles.tokens.text.heading}`}>
          <ScrollText size={18} />
          <h3 className="text-xl font-bold">Domain Cards</h3>
        </div>

        <div className="grid gap-3">
          {character.domainCards.length > 0 ? (
            character.domainCards.map((domainCard) => (
              <div
                key={domainCard.id}
                className={styles.tokens.panel.base}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className={styles.tokens.text.label}>
                      Domain Card
                    </div>
                    <h4 className="mt-1 text-lg font-bold text-slate-950">{domainCard.name}</h4>
                  </div>
                  <span className={`${styles.tokens.pill.base} ${styles.tokens.pill.accent}`}>
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
  <div className={styles.tokens.emptyState}>{text}</div>
);

const ResourceAdjustCard: React.FC<{
  label: string;
  value: string;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled: boolean;
}> = ({ label, value, onDecrease, onIncrease, disabled }) => (
  <div className={styles.tokens.panel.muted}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className={styles.tokens.text.label}>{label}</div>
        <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDecrease}
          disabled={disabled}
          className={`${styles.tokens.button.base} ${styles.tokens.button.danger} h-9 w-9 rounded-full px-0 py-0 text-sm shadow-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          -
        </button>
        <button
          type="button"
          onClick={onIncrease}
          disabled={disabled}
          className={`${styles.tokens.button.base} ${styles.tokens.button.primary} h-9 w-9 rounded-full px-0 py-0 text-sm shadow-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60`}
        >
          +
        </button>
      </div>
    </div>
  </div>
);

export default CombatTab;
