import React, { useEffect, useState } from "react";
import { NextPreviousButton } from "../../pages/create_character/components/NextButton";
import styles from "../types/cssColor";

type GridSelectorProps<T> = {
  endpoint?: string;
  items?: T[];
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
  const [loadedItems, setLoadedItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    let isMounted = true;

    if (endpoint !== undefined) {
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
            setLoadedItems(data);
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
    } else {
      setLoading(false);
      setLoadedItems(items || []);
    }
    return () => {
      isMounted = false;
    };
  }, [endpoint, items]);

  // --- Loading ---
  if (loading) {
    return (
      <div className={`${styles.tokens.page.section} p-8 text-center`}>
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
          Loading
        </div>
        <p className={`mt-2 ${styles.semantic.muted.text}`}>Preparing your selection...</p>
      </div>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <div className={`${styles.tokens.page.section} p-8 text-center ${styles.red.lightText}`}>
        Error: {error}
      </div>
    );
  }

  // --- Render ---
  return (
    <div className={`${styles.tokens.page.section} flex flex-col gap-6 p-5 sm:p-6 lg:p-8`}>
      {title && (
        <div className="text-center">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
            Character Builder
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loadedItems.map((item, pos) => (
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
