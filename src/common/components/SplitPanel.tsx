import React from "react";

type SplitPanelProps<T> = {
  items: T[];
  selectedId?: string | number;
  onSelect: (id: string | number, pos: number) => void;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  renderDetail: (item: T) => React.ReactNode;
  leftWidth?: string; // Tailwind width class
};

export function SplitPanel<T extends { id: string | number }>({
  items,
  selectedId,
  onSelect,
  renderItem,
  renderDetail,
  leftWidth = "w-1/3",
}: SplitPanelProps<T>) {
  const selectedItem = items.find((i) => i.id === selectedId) || items[0];

  return (
    <div className="flex gap-4">
      <div className={`${leftWidth} overflow-auto`}>
        {items.map((item, pos) => (
          <div key={item.id} onClick={() => onSelect(item.id, pos)}>
            {renderItem(item, item.id === selectedId)}
          </div>
        ))}
      </div>
      <div className="flex-1">
        {selectedItem && renderDetail(selectedItem)}
      </div>
    </div>
  );
}