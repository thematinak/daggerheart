import React from "react";
import { X } from "lucide-react";
import styles from "../types/cssColor";
import Eyebrow from "./Eyebrow";

type ModalCardProps = {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  eyebrow?: string;
  maxWidthClassName?: string;
  bodyClassName?: string;
  showCloseButton?: boolean;
  closeLabel?: string;
};

const ModalCard: React.FC<ModalCardProps> = ({
  isOpen,
  title,
  onClose,
  children,
  eyebrow,
  maxWidthClassName = "max-w-2xl",
  bodyClassName = "grid gap-5 px-6 py-6",
  showCloseButton = true,
  closeLabel = "Close",
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--surface-overlay)] p-3 backdrop-blur-sm sm:p-4">
      <div className="flex min-h-full items-center justify-center">
        <div
          className={[
            "flex w-full max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-[1.5rem] border border-[color:var(--border-soft)] bg-[image:var(--surface-modal)] shadow-[var(--shadow-soft)] sm:max-h-[calc(100vh-2rem)] sm:rounded-[2rem]",
            maxWidthClassName,
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4 border-b border-[color:var(--border-soft)] px-4 py-4 sm:px-6 sm:py-5">
            <div>
              {eyebrow ? <Eyebrow eyebrow={eyebrow} /> : null}
              <h3 className="mt-2 text-xl font-black tracking-tight text-[var(--text-primary)] sm:text-2xl">{title}</h3>
            </div>

            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} gap-2 px-3`}
              >
                <X size={16} />
                <span className="sr-only">{closeLabel}</span>
              </button>
            ) : null}
          </div>

          <div className={["min-h-0 flex-1 overflow-y-auto", bodyClassName].join(" ")}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalCard;
