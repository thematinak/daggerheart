import React, { useEffect, useState } from "react";
import { NextPreviousButton } from "../../pages/create_character/components/NextButton";
import styles from "../types/cssColor";
import Section from "./Section";
import { useNotifications } from "../contexts/CommonDataProvider";

type GridSelectorProps<T> = {
  endpoint?: string;
  items?: T[];
  selectedId?: string | number;
  onSelect: (id: T, pos: number) => void;
  renderItem: (item: T, selected: boolean) => React.ReactNode;
  title?: string;
  eyebrow?: string;
  description?: string;
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
  eyebrow,
  description,
  showNext = false,
  showBack = false,
  onNext,
  onBack,
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
    <Section eyebrow={eyebrow} title={title} subtitle={description}>
      <div className={`flex flex-col gap-6 p-5 sm:p-6 lg:p-8`}>

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
    </Section>
  );
}
