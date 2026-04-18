import React from "react";
import { Domain } from "../types/Domain";
import { Badge } from "./Badge";
import GameCard from "./GameCard";
import styles from "../types/cssColor";
import { getTierColor, getTierFromLevel } from "../utils/funks";

type DomainCardProps = {
  domain: Domain;
  selected?: boolean;
  onSelect?: () => void;
  interactive?: boolean;
  showLabel?: boolean;
};

const DomainCard: React.FC<DomainCardProps> = ({
  domain,
  selected = false,
  onSelect,
  interactive = Boolean(onSelect),
  showLabel = true,
}) => {
  const clickable = interactive && onSelect ? onSelect : undefined;

  return (
    <GameCard selected={selected} onClick={clickable} hover={interactive}>
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            {showLabel ? <div className={styles.tokens.text.label}>Domain Card</div> : null}
            <h4 className="mt-1 text-lg font-bold text-[var(--text-primary)]">{domain.name}</h4>
          </div>

          <Badge label={`Level ${domain.level}`} color={getTierColor(getTierFromLevel(domain.level))} />
        </div>

        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          {domain.description || "No description available."}
        </p>
      </div>
    </GameCard>
  );
};

export default DomainCard;
