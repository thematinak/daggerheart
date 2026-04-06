import React from "react";
import { Experience } from "../../../common/types/Experience";
import { NextPreviousButton } from "./NextButton";
import styles from "../../../common/types/cssColor";

export type ExperienceItem = {
  primaryExperience: Experience;
  secondaryExperience: Experience;
};

type ExperienceCardProps = {
  item: ExperienceItem;
  onSelect: (info: ExperienceItem) => void;
  showNext?: boolean;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
};

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  item,
  onSelect,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
}) => {
  return (
    <div className={`${styles.tokens.page.section} flex flex-col gap-6 p-5 sm:p-6 lg:p-8`}>
      <div className="text-center">
        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
          Character Builder
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Define Experiences
        </h2>
        <p className={`mx-auto mt-3 max-w-2xl ${styles.tokens.page.subtitle}`}>
          Add the two experiences that best reflect your character&apos;s history and expertise.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm">
          <div className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Primary
            </div>
            <h3 className="mt-1 text-xl font-bold text-slate-950">Primary Experience</h3>
            <p className="mt-1 text-sm text-slate-500">
              The experience your character leans on most often.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className={`mb-2 block text-sm font-semibold ${styles.gray.text}`}>Name</label>
              <input
                className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                placeholder="Name"
                value={item.primaryExperience.name}
                onChange={(e) =>
                  onSelect({
                    ...item,
                    primaryExperience: { ...item.primaryExperience, name: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-semibold ${styles.gray.text}`}>Description</label>
              <textarea
                className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[140px] resize-none`}
                placeholder="Describe what this experience represents."
                value={item.primaryExperience.description}
                onChange={(e) =>
                  onSelect({
                    ...item,
                    primaryExperience: { ...item.primaryExperience, description: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm">
          <div className="mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Secondary
            </div>
            <h3 className="mt-1 text-xl font-bold text-slate-950">Secondary Experience</h3>
            <p className="mt-1 text-sm text-slate-500">
              A supporting experience that rounds out the character.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className={`mb-2 block text-sm font-semibold ${styles.gray.text}`}>Name</label>
              <input
                className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                placeholder="Name"
                value={item.secondaryExperience.name}
                onChange={(e) =>
                  onSelect({
                    ...item,
                    secondaryExperience: { ...item.secondaryExperience, name: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-semibold ${styles.gray.text}`}>Description</label>
              <textarea
                className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[140px] resize-none`}
                placeholder="Describe what this experience represents."
                value={item.secondaryExperience.description}
                onChange={(e) =>
                  onSelect({
                    ...item,
                    secondaryExperience: { ...item.secondaryExperience, description: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {(showBack || showNext) && (
        <NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext} />
      )}
    </div>
  );
};

export default ExperienceCard;
