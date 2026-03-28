type CardProps = React.HTMLAttributes<HTMLDivElement> & { selected?: boolean };

export const Card: React.FC<CardProps> = ({ selected, className = "", ...props }) => (
  <div
    className={`
      rounded-xl border p-4 cursor-pointer transition-all duration-200
      hover:shadow-lg hover:scale-[1.02]
      ${selected ? "border-green-400 bg-green-50" : "border-gray-300"}
      ${className}
    `}
    {...props}
  />
);