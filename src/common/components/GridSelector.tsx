import React from "react";

type GridSelectorProps<T> = {
  items: T[];
  selectedId?: string | number;
  onSelect: (id: string | number, pos: number) => void;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  title?: string; // nový prop pre nadpis
  showNext?: boolean;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
};

export function GridSelector<T extends { id: string | number }>({
  items,
  selectedId,
  onSelect,
  renderItem,
  title,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
}: GridSelectorProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      {title && (
        <h2 className="text-center text-2xl font-bold">{title}</h2>
      )}
      {/* GRID s položkami */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, pos) => (
          <div key={item.id} onClick={() => onSelect(item.id, pos)}>
            {renderItem(item, item.id === selectedId)}
          </div>
        ))}
      </div>

      {/* Tlačidlá Späť a Pokračovať */}
      {(showBack || showNext) && (
        <div className="flex justify-between mt-4">
          {showBack ? (
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
            >
              Previous
            </button>
          ) : <div />}

          {showNext ? (
            <button
              onClick={onNext}
              className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-white font-semibold"
            >
              Next
            </button>
          ) : <div />}
        </div>
      )}
    </div>
  );
}