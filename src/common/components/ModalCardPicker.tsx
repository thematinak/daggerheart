import React, { useEffect, useMemo, useState } from "react";
import styles from "../types/cssColor";
import Eyebrow from "./Eyebrow";
import ModalCard from "./ModalCard";

type BaseFilter<T> = {
  id: string;
  label: string;
  getValue: (item: T) => string | number | undefined | null;
};

type TextFilter<T> = BaseFilter<T> & {
  type: "text";
  placeholder?: string;
  match?: "includes" | "exact";
};

type SelectFilter<T> = BaseFilter<T> & {
  type: "select";
  options: Array<{
    label: string;
    value: string;
  }>;
};

export type ModalCardPickerFilter<T> = TextFilter<T> | SelectFilter<T>;

type ModalCardPickerProps<T> = {
  isOpen: boolean;
  eyebrow?: string;
  title: string;
  items: T[];
  filters?: Array<ModalCardPickerFilter<T>>;
  getItemId: (item: T) => string;
  onClose: () => void;
  onConfirm: (item: T, quantity: number) => void;
  renderCard: (item: T, selected: boolean) => React.ReactNode;
  renderDetail: (item: T) => React.ReactNode;
  emptyText?: string;
  detailEmptyText?: string;
  confirmLabel?: (item: T, quantity: number) => string;
  quantityLabel?: string;
  quantityEnabled?: boolean;
  cardsGridClassName?: string;
};

const createInitialFilterState = <T,>(filters: Array<ModalCardPickerFilter<T>>) =>
  filters.reduce<Record<string, string>>((acc, filter) => {
    acc[filter.id] = "";
    return acc;
  }, {});

const getFilterGridColumnsClass = (filterCount: number) => {
  if (filterCount <= 1) {
    return "sm:grid-cols-1";
  }

  if (filterCount === 2) {
    return "sm:grid-cols-2";
  }

  return "sm:grid-cols-3";
};

function matchesTextFilter<T>(item: T, filter: TextFilter<T>, value: string) {
  if (value.trim() === "") {
    return true;
  }

  const itemValue = String(filter.getValue(item) ?? "");
  const normalizedFilter = value.trim().toLowerCase();
  const normalizedItemValue = itemValue.toLowerCase();

  if (filter.match === "exact") {
    return normalizedItemValue === normalizedFilter;
  }

  return normalizedItemValue.includes(normalizedFilter);
}

function matchesSelectFilter<T>(item: T, filter: SelectFilter<T>, value: string) {
  if (!value) {
    return true;
  }

  return String(filter.getValue(item) ?? "") === value;
}

const ModalCardPicker = <T,>({
  isOpen,
  eyebrow,
  title,
  items,
  filters = [],
  getItemId,
  onClose,
  onConfirm,
  renderCard,
  renderDetail,
  emptyText = "No items available.",
  detailEmptyText = "Select a card to see more detail.",
  confirmLabel,
  quantityLabel = "Quantity",
  quantityEnabled = true,
  cardsGridClassName = "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
}: ModalCardPickerProps<T>) => {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => createInitialFilterState(filters));

  useEffect(() => {
    setFilterValues(createInitialFilterState(filters));
  }, [filters]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedItemId("");
      setQuantity(1);
      setFilterValues(createInitialFilterState(filters));
    }
  }, [filters, isOpen]);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      filters.every((filter) => {
        const value = filterValues[filter.id] ?? "";

        if (filter.type === "text") {
          return matchesTextFilter(item, filter, value);
        }

        return matchesSelectFilter(item, filter, value);
      })
    );
  }, [filterValues, filters, items]);

  const selectedItem = useMemo(
    () => items.find((item) => getItemId(item) === selectedItemId) || null,
    [getItemId, items, selectedItemId]
  );

  if (!isOpen) {
    return null;
  }

  return (
    <ModalCard
      isOpen={isOpen}
      onClose={onClose}
      eyebrow={eyebrow}
      title={title}
      maxWidthClassName="max-w-6xl"
      bodyClassName="grid min-h-0 gap-3 overflow-y-auto p-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]"
    >
      <div className="grid gap-5">
        {filters.length > 0 ? (
          <div
            className={[
              "grid gap-3 rounded-[1.5rem] p-4",
              styles.tokens.panel.base,
              getFilterGridColumnsClass(filters.length),
            ].join(" ")}
          >
            {filters.map((filter) => (
              <label key={filter.id} className="grid gap-2">
                <span className={styles.tokens.text.label}>{filter.label}</span>
                {filter.type === "select" ? (
                  <select
                    value={filterValues[filter.id] ?? ""}
                    onChange={(event) =>
                      setFilterValues((current) => ({ ...current, [filter.id]: event.target.value }))
                    }
                    className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                  >
                    <option value="">All</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={filterValues[filter.id] ?? ""}
                    onChange={(event) =>
                      setFilterValues((current) => ({ ...current, [filter.id]: event.target.value }))
                    }
                    placeholder={filter.placeholder}
                    className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                  />
                )}
              </label>
            ))}
          </div>
        ) : null}

        <div className={cardsGridClassName}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <button
                key={getItemId(item)}
                type="button"
                onClick={() => setSelectedItemId(getItemId(item))}
                className="text-left"
              >
                {renderCard(item, getItemId(item) === selectedItemId)}
              </button>
            ))
          ) : (
            <div className="md:col-span-2 xl:col-span-3">
              <EmptyState text={emptyText} />
            </div>
          )}
        </div>
      </div>

      <section className={`${styles.tokens.panel.base} grid self-start gap-4 lg:sticky lg:top-0`}>
        <div>
          <Eyebrow eyebrow="Selection" />
          <h4 className="mt-2 text-xl font-bold text-[var(--text-primary)]">Item detail</h4>
        </div>

        {selectedItem ? (
          <>
            {renderDetail(selectedItem)}

            {quantityEnabled ? (
              <label className="grid gap-2">
                <span className="text-[var(--text-primary)]">{quantityLabel}</span>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                  className={`${styles.tokens.input.base} ${styles.tokens.input.focus}`}
                />
              </label>
            ) : null}

            <button
              type="button"
              onClick={() => onConfirm(selectedItem, quantity)}
              className={`${styles.tokens.button.base} ${styles.tokens.button.primary}`}
            >
              {confirmLabel ? confirmLabel(selectedItem, quantity) : "Confirm"}
            </button>
          </>
        ) : (
          <EmptyState text={detailEmptyText} />
        )}
      </section>
    </ModalCard>
  );
};

const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className={styles.tokens.emptyState}>{text}</div>
);

export default ModalCardPicker;
