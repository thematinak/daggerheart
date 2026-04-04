import styles from "../types/cssColor";

type CardProps = React.HTMLAttributes<HTMLDivElement> & { selected?: boolean };

export const Card: React.FC<CardProps> = ({ selected, className = "", ...props }) => (
  <div
    className={`
      rounded-xl border p-4 cursor-pointer transition-all duration-200
      hover:shadow-lg hover:scale-[1.02]
      ${selected ? `${styles.green.border} ${styles.green.bg}` : styles.gray.border}
      ${className}
    `}
    {...props}
  />
);