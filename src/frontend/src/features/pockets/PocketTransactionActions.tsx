import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  TransactionFormDialog,
  type TransactionPreset,
} from "@/features/transactions/TransactionFormDialog";

interface PocketTransactionActionsProps {
  pocketId: number;
  onSaved: () => void;
  /** Compact icon-only buttons (for list rows) vs. labelled buttons (for the detail header). */
  compact?: boolean;
}

// "Money in" prefills an income to this pocket; "Money out" an expense from it.
// Switching the type inside the dialog still lets the user record a transfer.
export function PocketTransactionActions({
  pocketId,
  onSaved,
  compact = false,
}: PocketTransactionActionsProps) {
  const [preset, setPreset] = useState<TransactionPreset | undefined>();

  const moneyIn: TransactionPreset = { type: "INCOME", toPocketId: pocketId };
  const moneyOut: TransactionPreset = { type: "EXPENSE", fromPocketId: pocketId };

  return (
    <>
      {compact ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreset(moneyIn)}
            aria-label="Add money to pocket"
          >
            <ArrowDownLeft className="text-emerald-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreset(moneyOut)}
            aria-label="Spend from pocket"
          >
            <ArrowUpRight />
          </Button>
        </>
      ) : (
        <>
          <Button variant="outline" size="sm" onClick={() => setPreset(moneyIn)}>
            <ArrowDownLeft /> Money in
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPreset(moneyOut)}>
            <ArrowUpRight /> Money out
          </Button>
        </>
      )}

      <TransactionFormDialog
        open={preset !== undefined}
        onOpenChange={(open) => !open && setPreset(undefined)}
        preset={preset}
        onSaved={() => {
          setPreset(undefined);
          onSaved();
        }}
      />
    </>
  );
}
