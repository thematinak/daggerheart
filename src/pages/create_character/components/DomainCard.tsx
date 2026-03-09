import React from "react";

export type DomainCardItem = {
  id: string;
  name: string;
  description?: string;
};

type DomainCardProps = {
  item: DomainCardItem;
  selected?: boolean;
  onSelect: () => void;
};

const DomainCard: React.FC<DomainCardProps> = ({ item, selected = false, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`
        border rounded-xl p-4 cursor-pointer transition-all duration-200
        ${selected ? "border-amber-400 bg-amber-50" : "border-gray-300"}
        hover:shadow-lg hover:scale-[1.02]
      `}
    >
      <h3 className="font-bold text-lg">{item.name}</h3>
      {item.description && (
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
      )}
    </div>
  );
};

export default DomainCard;