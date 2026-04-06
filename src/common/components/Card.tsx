import styles from "../types/cssColor";

type CardProps = React.HTMLAttributes<HTMLDivElement> & { selected?: boolean };

export const Card: React.FC<CardProps> = ({ selected, className = "", ...props }) => (
  <div
    className={`
      ${styles.tokens.card.base}
      ${styles.tokens.card.hover}
      ${selected ? styles.tokens.card.selected : styles.semantic.muted.border}
      ${className}
    `}
    {...props}
  />
);
