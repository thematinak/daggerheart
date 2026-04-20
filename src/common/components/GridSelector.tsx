import React, { useEffect, useState } from "react";
import styles from "../types/cssColor";
import { useNotifications } from "../contexts/CommonDataProvider";

type GridSelectorProps<T> = {
  endpoint?: string;
  items?: T[];
  selectedId?: string | number;
  onSelect: (id: T, pos: number) => void;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
};

export function GridSelector<T extends { id: string | number }>({
  endpoint,
  items,
  selectedId,
  onSelect,
  renderItem,
}: GridSelectorProps<T>) {
  const [loadedItems, setLoadedItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useNotifications();
  

  useEffect(() => {
    let isMounted = true;

    if (endpoint !== undefined) {
      const loadData = async () => {
        try {
          setLoading(true);

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
            showError("Failed to load data: " + (err.message || "Unknown error"));
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
  }, [endpoint, items, showError]);

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

  // --- Render ---
  return (
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {loadedItems.map((item, pos) => (
          <div key={item.id} onClick={() => onSelect(item, pos)}>
            {renderItem(item, item.id === selectedId)}
          </div>
        ))}
      </div>
  );
}
