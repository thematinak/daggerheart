import React from "react";
import { Sparkles } from "lucide-react";
import styles from "../../../common/types/cssColor";

type HopeFeatureCardProps = {
  feature?: string;
  description?: string;
  usable?: boolean;
};

const HopeFeatureCard: React.FC<HopeFeatureCardProps> = ({ feature, description, usable = false }) => {
  if (!feature) {
    return <div className={styles.tokens.emptyState}>No hope feature available.</div>;
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[color:var(--border-soft)] bg-[image:var(--surface-modal)] p-5 shadow-[var(--shadow-soft)]">
      <div className="absolute -right-8 top-0 h-24 w-24 rounded-full bg-[var(--surface-accent)] opacity-50 blur-2xl" />
      <div className="absolute bottom-0 left-6 h-16 w-16 rounded-full bg-[var(--pill-accent-bg)] opacity-40 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border-soft)] bg-[var(--surface-accent)] text-[var(--text-accent)] shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--text-muted)]">
                Class Feature
              </div>
              <h4 className="mt-2 text-2xl font-black tracking-tight text-[var(--text-primary)]">
                {feature}
              </h4>
            </div>
          </div>

          <span className={`${styles.tokens.pill.base} ${styles.tokens.pill.accent}`}>
            Hope
          </span>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
          {description || "No hope feature description available."}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className={`${styles.tokens.pill.base} ${styles.tokens.pill.info}`}>
            Spend hope when triggered
          </div>

          <div className="text-sm text-[var(--text-muted)]">
            Keep this ready for your next big turn.
          </div>
        </div>

        {usable && (<div className="mt-6">
          <button
            type="button"
            className={`${styles.tokens.button.base} ${styles.tokens.button.primary} min-w-[12rem]`}
          >
            Use Hope Feature
          </button>
        </div>)}
      </div>
    </div>
  );
};

export default HopeFeatureCard;
