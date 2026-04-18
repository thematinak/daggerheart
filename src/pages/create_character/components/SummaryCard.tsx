import React from "react";
import {
  BadgeCheck,
  BookOpen,
  Castle,
  Crosshair,
  ScrollText,
  Shield,
  Sparkles,
  Swords,
} from "lucide-react";
import StatsBar, { buildStatsFromCharacter } from "../../../common/components/StatsBar";
import styles from "../../../common/types/cssColor";
import { Character } from "../../../common/types/Character";
import H2 from "../../../common/components/H2";
import SplitBar from "../../../common/components/SplitBar";
import HopeFeatureCard from "../../character_detail/components/HopeFeatureCard";

type SummaryCardProps = {
  character: Character;
  onBack?: () => void;
  onCreate?: () => void;
};

type SectionCardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const formatLabel = (label: string) =>
  label.charAt(0).toUpperCase() + label.slice(1);

const SummarySection: React.FC<SectionCardProps> = ({ title, icon, children, className = "" }) => (
  <section
    className={`${styles.tokens.page.section} ${className}`}
  >
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        {icon}
      </div>
      <H2>{title}</H2>
    </div>
    {children}
  </section>
);

const DetailRow: React.FC<{ label: string; value?: React.ReactNode; className?: string }> = ({
  label,
  value,
  className = "",
}) => (
  <div className={`rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-muted)] px-4 py-3 ${className}`}>
    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
      {label}
    </div>
    <div className="mt-1 text-sm font-medium text-[var(--text-primary)]">{value || "-"}</div>
  </div>
);

const SummaryCard: React.FC<SummaryCardProps> = ({ character, onBack, onCreate }) => {
  const stats = buildStatsFromCharacter(character);
  const subtitle = [
    character.class?.name,
    character.specialization?.name,
    character.ancestry?.name,
  ]
    .filter(Boolean)
    .join(" / ");
    
  return (
    <div className="flex flex-col gap-6">
        <section className={`${styles.tokens.page.section} p-5 sm:p-6 lg:p-8`}>
          <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-8">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,_rgba(120,53,15,0.96),_rgba(180,83,9,0.94)_55%,_rgba(245,158,11,0.9)_100%)] p-6 text-white">
              <div className="absolute -right-10 top-0 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 left-8 h-24 w-24 rounded-full bg-amber-200/20 blur-2xl" />
              <div className="relative flex h-full flex-col justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                    {character.name || "Unnamed Hero"}
                  </h1>
                  <p className="mt-2 text-sm text-amber-50/90 sm:text-base">
                    {subtitle || "Your choices come together here."}
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-amber-50/85">
                    {character.description || "No description yet."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <DetailRow label="Class" value={character.class?.name} />
              <DetailRow label="Specialization" value={character.specialization?.name} />
              <DetailRow label="Ancestry" value={character.ancestry?.name} />
              <DetailRow label="Community" value={character.community?.name} />
            </div>
          </div>

          <SplitBar />

          <StatsBar stats={stats} currentStats={character.currentStats} proficiency={character.proficiency} />
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <SummarySection title="Class & Path" icon={<BadgeCheck size={18} />} className="lg:col-span-1">
            <div className="grid gap-3">
              <DetailRow label="Class" value={character.class?.name} />
              {character.class?.description && (
                <p className="text-sm leading-6 text-[var(--text-secondary)]">{character.class.description}</p>
              )}
              <DetailRow label="Specialization" value={character.specialization?.name} />
              {character.specialization?.description && (
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  {character.specialization.description}
                </p>
              )}
              <HopeFeatureCard
                feature={character.class?.hopeFeature}
                description={character.class?.hopeFeatureDescription}
                usable={true}
              />
            </div>
          </SummarySection>

          <SummarySection title="Origins" icon={<Castle size={18} />} className="lg:col-span-1">
            <div className="grid gap-3">
              <DetailRow label="Ancestry" value={character.ancestry?.name} />
              {character.ancestry?.description && (
                <p className="text-sm leading-6 text-[var(--text-secondary)]">{character.ancestry.description}</p>
              )}
              <DetailRow label="Community" value={character.community?.name} />
              {character.community?.description && (
                <p className="text-sm leading-6 text-[var(--text-secondary)]">{character.community.description}</p>
              )}
            </div>
          </SummarySection>

          <SummarySection title="Domains" icon={<Sparkles size={18} />}>
            {character.domainCards.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {character.domainCards.map((domain) => (
                  <div
                    key={domain.id}
                    className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-3 text-sm font-semibold text-amber-900 shadow-sm"
                  >
                    {domain.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No domains selected.</p>
            )}
          </SummarySection>

          <SummarySection title="Attributes" icon={<Crosshair size={18} />}>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {Object.entries(character.attributes).map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-panel)] px-4 py-3 text-center shadow-sm"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    {formatLabel(key)}
                  </div>
                  <div className="mt-2 text-2xl font-black text-[var(--text-primary)]">{value?.value ?? "-"}</div>
                </div>
              ))}
            </div>
          </SummarySection>

          <SummarySection title="Gear" icon={<Swords size={18} />}>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailRow label="Primary Weapon" value={character.weapons?.primary?.name} />
              <DetailRow label="Secondary Weapon" value={character.weapons?.secondary?.name} />
              <DetailRow label="Armor" value={character.armor?.name} className="sm:col-span-2" />
            </div>
            {character.armor?.abilityDescription && (
              <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3 text-sm leading-6 text-amber-900">
                <div className="mb-1 flex items-center gap-2 font-semibold">
                  <Shield size={16} />
                  Armor Ability
                </div>
                {character.armor.abilityDescription}
              </div>
            )}
          </SummarySection>

          <SummarySection title="Experience" icon={<BookOpen size={18} />}>
            <div className="grid gap-3">
              {character.experiences.map((experience, index) => (
                <div key={index} className="border-b border-slate-200 pb-3">
                  <DetailRow label={(index + 1) + ". Experience"} value={experience.name + (experience.bonus ? ` (+${experience.bonus})` : "")} />
                  {experience.description && (
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      {experience.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </SummarySection>

          {(onBack || onCreate) && (
            <SummarySection
              title={onCreate ? "Ready To Create" : "Character Overview"}
              icon={<ScrollText size={18} />}
              className="lg:col-span-2"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                  {onCreate
                    ? "This screen is now your final checkpoint. If everything feels right, create the character and send this build into the world."
                    : "Review the full build, stats, gear, and background details for this character."}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {onBack && (
                    <button
                      onClick={onBack}
                      className={`${styles.tokens.button.base} ${styles.tokens.button.secondary}`}
                    >
                      Back
                    </button>
                  )}

                  {onCreate && (
                    <button
                      onClick={onCreate}
                      className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
                    >
                      Create Character
                    </button>
                  )}
                </div>
              </div>
            </SummarySection>
          )}
      </div>
    </div>
  );
};

export default SummaryCard;
