import styles, { Color } from "../types/cssColor";

type BadgeProps = {
  label: string;
  color?: Color;
  onClick?: () => void;
};

export const Badge: React.FC<BadgeProps> = ({ label, color = "gray", onClick }) => {
  // svetlé pozadie a tmavší rámik


  const style = styles[color] || styles.gray;

  return (
    <span
      onClick={onClick}
      className={`rounded-full text-xs px-3 py-1 rounded font-semibold border ${style.bg} ${style.border} ${style.text}`}
    >
      {label}
    </span>
  );
};