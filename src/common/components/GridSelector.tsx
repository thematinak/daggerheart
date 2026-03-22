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


// import React, { useEffect, useState } from "react";
// import { NextPreviousButton } from "../../pages/create_character/components/NextButton";

// type GridSelectorProps<T> = {
//   endpoint: string;
//   selectedId?: string | number;
//   onSelect: (id: string | number, pos: number) => void;
//   renderItem: (item: T, selected: boolean) => React.ReactNode;
//   title?: string;
//   showNext?: boolean;
//   showBack?: boolean;
//   onNext?: () => void;
//   onBack?: () => void;
// };

// export function GridSelector<T extends { id: string | number }>({
//   endpoint,
//   selectedId,
//   onSelect,
//   renderItem,
//   title,
//   showNext = false,
//   showBack = false,
//   onNext,
//   onBack,
// }: GridSelectorProps<T>) {
//   const [items, setItems] = useState<T[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(endpoint);
//         if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
//         const data: T[] = await res.json();
//         setItems(data);
//       } catch (err: any) {
//         setError(err.message || "Unknown error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [endpoint]);

//   if (loading) return <p className="text-center">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div className="flex flex-col gap-4">
//       {title && <h2 className="text-center text-2xl font-bold">{title}</h2>}

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {items.map((item, pos) => (
//           <div key={item.id} onClick={() => onSelect(item.id, pos)}>
//             {renderItem(item, item.id === selectedId)}
//           </div>
//         ))}
//       </div>

//       {(showBack || showNext) && (
//         <NextPreviousButton
//           showBack={showBack}
//           showNext={showNext}
//           onBack={onBack}
//           onNext={onNext}
//         />
//       )}
//     </div>
//   );
// }