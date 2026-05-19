"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card } from "@ffx/ui";
import { formatMoney } from "@ffx/utils";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

type Withdrawal = {
  id: string;
  amount: string;
  status: string;
  createdAt: string;
  user: { username: string; email: string };
  transaction: { reference: string };
};

export default function AdminWalletPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    load();
  }, []);

  function load() {
    api.get("/admin/withdrawals").then((response) => setWithdrawals(response.data.data));
  }

  async function update(id: string, status: string) {
    try {
      await api.patch(`/admin/withdrawals/${id}`, { status });
      toast.success("Withdrawal updated");
      load();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Payouts" title="Wallet Control" />
      <Card className="divide-y divide-white/10 overflow-hidden">
        {withdrawals.map((withdrawal) => (
          <div key={withdrawal.id} className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="font-black">{withdrawal.user.username} / {formatMoney(withdrawal.amount)}</div>
              <div className="text-sm text-slate-400">{withdrawal.user.email} / {withdrawal.transaction.reference}</div>
              <div className="mt-2"><Badge tone={withdrawal.status === "PAID" ? "green" : "amber"}>{withdrawal.status}</Badge></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => update(withdrawal.id, "APPROVED")}>Approve</Button>
              <Button onClick={() => update(withdrawal.id, "PAID")}>Paid</Button>
              <Button variant="danger" onClick={() => update(withdrawal.id, "REJECTED")}>Reject</Button>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
