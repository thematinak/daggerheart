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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div
          className={[
            "w-full rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,_rgba(255,251,235,0.98),_rgba(255,255,255,0.98))] shadow-[0_24px_80px_-30px_rgba(15,23,42,0.45)]",
            maxWidthClassName,
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-6 py-5">
            <div>
              {eyebrow ? <Eyebrow eyebrow={eyebrow} /> : null}
              <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{title}</h3>
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

          <div className={bodyClassName}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalCard;
