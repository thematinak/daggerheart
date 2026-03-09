type BadgeProps = {
  label: string;
  color?: string;
  onClick?: () => void;
};

export const Badge: React.FC<BadgeProps> = ({ label, color = "gray", onClick }) => {
  // svetlé pozadie a tmavší rámik
  const styles: Record<string, { bg: string; border: string; text: string }> = {
    gray: { bg: "bg-gray-100", border: "border-gray-400", text: "text-gray-800" },
    yellow: { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-800" },
    blue: { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-800" },
    green: { bg: "bg-green-100", border: "border-green-400", text: "text-green-800" },
    purple: { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-800" },
    red: { bg: "bg-red-100", border: "border-red-400", text: "text-red-800" },
  };

  const style = styles[color] || styles.gray;

  return (
    <span
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded font-semibold border ${style.bg} ${style.border} ${style.text}`}
    >
      {label}
    </span>
  );
};