import React from "react";
import { Experience } from "../../../common/types/Experience";
import { NextPreviousButton } from "./NextButton";
import styles from "../../../common/types/cssColor";
import Eyebrow from "../../../common/components/Eyebrow";
import H2 from "../../../common/components/H2";
import Subtitle from "../../../common/components/Subtitle";

type ExperienceCardProps = {
  item: Experience[];
  onSelect: (info: { experiences: Experience[] }) => void;
  showNext?: boolean;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
};

const ensureExperience = (items: Experience[], index: number): Experience =>
  items[index] || { name: "", description: "", bonus: 2 };

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  item,
  onSelect,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
}) => {
  const primaryExperience = ensureExperience(item, 0);
  const secondaryExperience = ensureExperience(item, 1);

  return (
    <div className={`${styles.tokens.page.section} flex flex-col gap-6 p-5 sm:p-6 lg:p-8`}>
      <div className="text-center">
        <Eyebrow eyebrow="Character Builder" />
        <H2>Define Experiences</H2>
        <Subtitle text="Add the two experiences that best reflect your character's history and expertise." />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm">
          <div className="mb-4">
            <Eyebrow eyebrow="Primary" />
            <h3 className="mt-1 text-xl font-bold text-slate-950">Primary Experience</h3>
            <Subtitle text="The experience your character leans on most often." />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className={`mb-2 block text-sm font-semibold ${styles.gray.text}`}>Name</label>
              <input
                className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                placeholder="Name"
                value={primaryExperience.name}
                onChange={(e) =>
                  onSelect({
                    experiences: [
                      { ...primaryExperience, name: e.target.value },
                      secondaryExperience,
                    ],
                  })
                }
              />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-semibold ${styles.gray.text}`}>Description</label>
              <textarea
                className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[140px] resize-none`}
                placeholder="Describe what this experience represents."
                value={primaryExperience.description}
                onChange={(e) =>
                  onSelect({
                    experiences: [
                      { ...primaryExperience, description: e.target.value },
                      secondaryExperience,
                    ],
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/75 p-5 shadow-sm">
          <div className="mb-4">
            <Eyebrow eyebrow="Secondary" />
            <h3 className="mt-1 text-xl font-bold text-slate-950">Secondary Experience</h3>
            <Subtitle text="A supporting experience that rounds out the character." />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className={`mb-2 block text-sm font-semibold ${styles.gray.text}`}>Name</label>
              <input
                className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                placeholder="Name"
                value={secondaryExperience.name}
                onChange={(e) =>
                  onSelect({
                    experiences: [
                      primaryExperience,
                      { ...secondaryExperience, name: e.target.value },
                    ],
                  })
                }
              />
            </div>

            <div>
              <label className={`mb-2 block text-sm font-semibold ${styles.gray.text}`}>Description</label>
              <textarea
                className={`${styles.tokens.input.base} ${styles.tokens.input.focus} min-h-[140px] resize-none`}
                placeholder="Describe what this experience represents."
                value={secondaryExperience.description}
                onChange={(e) =>
                  onSelect({
                    experiences: [
                      primaryExperience,
                      { ...secondaryExperience, description: e.target.value },
                    ],
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
