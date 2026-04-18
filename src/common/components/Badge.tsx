import styles, { Color } from "../types/cssColor";

type BadgeProps = {
  label: string;
  color?: Color;
  onClick?: () => void;
};

export const Badge: React.FC<BadgeProps> = ({ label, color = "gray", onClick }) => {
  const style = styles[color] || styles.gray;

  return (
    <span
      onClick={onClick}
      className={[
        styles.tokens.badge,
        style.bg,
        style.bgHover,
        style.border,
        style.text,
        onClick ? "cursor-pointer transition hover:brightness-105" : "",
      ].join(" ")}
    >
      {label}
    </span>
  );
};
