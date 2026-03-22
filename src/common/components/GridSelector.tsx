import React, { useEffect, useState } from "react";
import { NextPreviousButton } from "../../pages/create_character/components/NextButton";

// type GridSelectorProps<T> = {
//   items: T[];
//   selectedId?: string | number;
//   onSelect: (id: T, pos: number) => void;
//   renderItem: (item: T, selected: boolean) => React.ReactNode;
//   title?: string; // nový prop pre nadpis
//   showNext?: boolean;
//   showBack?: boolean;
//   onNext?: () => void;
//   onBack?: () => void;
// };

// export function GridSelector<T extends { id: string | number }>({
//   items,
//   selectedId,
//   onSelect,
//   renderItem,
//   title,
//   showNext = false,
//   showBack = false,
//   onNext,
//   onBack,
// }: GridSelectorProps<T>) {
//   return (
//     <div className="flex flex-col gap-4">
//       {title && (
//         <h2 className="text-center text-2xl font-bold">{title}</h2>
//       )}
//       {/* GRID s položkami */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {items.map((item, pos) => (
//           <div key={item.id} onClick={() => onSelect(item, pos)}>
//             {renderItem(item, item.id === selectedId)}
//           </div>
//         ))}
//       </div>

//       {/* Tlačidlá Späť a Pokračovať */}
//       {(showBack || showNext) && (<NextPreviousButton showBack={showBack} showNext={showNext} onBack={onBack} onNext={onNext} />
//       )}
//     </div>
//   );
// }


type GridSelectorProps<T> = {
  endpoint: string;
  selectedId?: string | number;
  onSelect: (id: T, pos: number) => void;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  title?: string;
  showNext?: boolean;
  showBack?: boolean;
  onNext?: () => void;
  onBack?: () => void;
};

export function GridSelector<T extends { id: string | number }>({
  endpoint,
  selectedId,
  onSelect,
  renderItem,
  title,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
}: GridSelectorProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(endpoint);

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();

        if (isMounted) {
          setItems(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  // --- Loading ---
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  // --- Error ---
  if (error) {
    return (
      <div className="text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="flex flex-col gap-4">
      {title && (
        <h2 className="text-center text-2xl font-bold">{title}</h2>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, pos) => (
          <div key={item.id} onClick={() => onSelect(item, pos)}>
            {renderItem(item, item.id === selectedId)}
          </div>
        ))}
      </div>

      {(showBack || showNext) && (
        <NextPreviousButton
          showBack={showBack}
          showNext={showNext}
          onBack={onBack}
          onNext={onNext}
        />
      )}
    </div>
  );
}