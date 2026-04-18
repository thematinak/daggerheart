import { useMemo, useState } from "react";
import styles from "../../../common/types/cssColor";
import { Coins, Package, ShoppingBag } from "lucide-react";
import { Character } from "../../../common/types/Character";
import { postCharacterCommands } from "../../../common/endponts/common";
import { useNotifications } from "../../../common/contexts/CommonDataProvider";

const getBankBreakdown = (bank: number) => {
  const handfulPerBag = 10;
  const bagsPerChest = 13;
  const handfulPerChest = handfulPerBag * bagsPerChest;

  const normalizedBank = Math.max(0, bank);
  const chests = Math.floor(normalizedBank / handfulPerChest);
  const remainingAfterChests = normalizedBank % handfulPerChest;
  const bags = Math.floor(remainingAfterChests / handfulPerBag);
  const handful = remainingAfterChests % handfulPerBag;

  return { chests, bags, handful };
};

const Bank: React.FC<{character: Character; onCharacterUpdated: () => Promise<void>}> = ({ character, onCharacterUpdated }) => {

    const [isSavingBank, setIsSavingBank] = useState(false);
    const { showError, showInfo } = useNotifications();
    const bankBreakdown = useMemo(() => getBankBreakdown(character.bank), [character.bank]);

    const handleBankChange = async (action: "add" | "remove", value: number) => {
        try {
            setIsSavingBank(true);

            await postCharacterCommands(character.id,[
                {
                action,
                target: "bank",
                value,
                },
            ]);
            await onCharacterUpdated();
            showInfo(
              `${action === "add" ? "Added" : "Removed"} ${value} handful${value === 1 ? "" : "s"} from bank.`,
              "Bank Updated"
            );
        } catch (error: any) {
            showError(error.message || "Failed to update bank.", "Bank Update Failed");
        } finally {
            setIsSavingBank(false);
        }
    };

    return (
        <div className="grid gap-4">
          <div>
            <h3 className="mt-2 text-xl font-bold text-[var(--text-primary)]">Character Bank</h3>
            <p className={`mt-1 ${styles.tokens.text.muted}`}>
              Total value: {character.bank} handful
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <BankUnitCard
              icon={<Package size={18} />}
              label="Chests"
              value={bankBreakdown.chests}
              note="1 chest = 13 bags"
              onAdd={() => handleBankChange("add", BANK_VALUES.chest)}
              onRemove={() => handleBankChange("remove", BANK_VALUES.chest)}
              disabled={isSavingBank}
            />
            <BankUnitCard
              icon={<ShoppingBag size={18} />}
              label="Bags"
              value={bankBreakdown.bags}
              note="1 bag = 10 handful"
              onAdd={() => handleBankChange("add", BANK_VALUES.bag)}
              onRemove={() => handleBankChange("remove", BANK_VALUES.bag)}
              disabled={isSavingBank}
            />
            <BankUnitCard
              icon={<Coins size={18} />}
              label="Handful"
              value={bankBreakdown.handful}
              note="Loose coin"
              onAdd={() => handleBankChange("add", BANK_VALUES.handful)}
              onRemove={() => handleBankChange("remove", BANK_VALUES.handful)}
              disabled={isSavingBank}
            />
          </div>
        </div>
    );
}

const BANK_VALUES = {
  chest: 130,
  bag: 10,
  handful: 1,
};

const BankUnitCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  note: string;
  onAdd: () => void;
  onRemove: () => void;
  disabled?: boolean;
}> = ({ icon, label, value, note, onAdd, onRemove, disabled = false }) => (
  <div className={`${styles.tokens.panel.muted} min-w-[11rem]`}>
    <div className="flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
        {icon}
      </div>
      <div>
        <div className={styles.tokens.text.label}>{label}</div>
        <div className="text-2xl font-black text-[var(--text-primary)]">{value}</div>
      </div>
    </div>
    <p className={`mt-3 ${styles.tokens.text.muted}`}>{note}</p>
    <div className="mt-4 flex gap-2">
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        -
      </button>
      <button
        type="button"
        onClick={onAdd}
        disabled={disabled}
        className="flex-1 rounded-xl border border-amber-300 bg-amber-100 px-3 py-2 text-sm font-bold text-amber-900 transition hover:border-amber-400 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        +
      </button>
    </div>
  </div>
);

export default Bank;
