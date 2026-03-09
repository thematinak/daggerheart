import React from "react";
import { NextPreviousButton } from "../../pages/create_character/components/NextButton";

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
      {(showBack || showNext) && (<NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext} />
      )}
    </div>
  );
}