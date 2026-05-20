"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, CreditCard, History, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Input, Badge } from "@ffx/ui";
import { formatMoney } from "@ffx/utils";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type WalletData = {
  wallet: { balance: string; winningBalance: string; bonusBalance: string; lockedBalance: string };
  transactions: { id: string; type: string; status: string; amount: string; createdAt: string; provider?: string }[];
};

export default function WalletPage() {
  const [data, setData] = useState<WalletData | null>(null);
  const [amount, setAmount] = useState(250);
  const [provider, setProvider] = useState<"RAZORPAY" | "CASHFREE">("RAZORPAY");
  const [withdrawAmount, setWithdrawAmount] = useState(500);
  const [upi, setUpi] = useState("");

  useEffect(() => {
    loadWallet();
  }, []);

  function loadWallet() {
    api.get("/wallet").then((response) => setData(response.data.data));
  }

  async function createDeposit() {
    try {
      const response = await api.post("/wallet/deposit/create", { amount, provider });
      const payload = response.data.data;
      if (provider === "RAZORPAY" && payload.keyId && payload.order) {
        await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        const Checkout = window.Razorpay;
        if (!Checkout) throw new Error("Razorpay SDK unavailable");
        new Checkout({
          key: payload.keyId,
          amount: payload.order.amount,
          currency: "INR",
          name: "FFX ESPORTS",
          description: "Wallet deposit",
          order_id: payload.order.id,
          handler: () => {
            toast.success("Payment captured. Wallet updates after webhook verification.");
            loadWallet();
          }
        }).open();
      } else {
        toast.success("Payment order created");
      }
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  async function withdraw() {
    try {
      await api.post("/wallet/withdraw", {
        amount: withdrawAmount,
        payoutAccount: { upi, holderName: "FFX Player" }
      });
      toast.success("Withdrawal requested");
      loadWallet();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  const wallet = data?.wallet;

  return (
    <div>
      <PageHeader eyebrow="Money ops" title="Wallet" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={WalletCards} label="Deposit Balance" value={formatMoney(wallet?.balance ?? 0)} detail="Usable entry balance" />
        <MetricCard icon={CircleDollarSign} label="Winning" value={formatMoney(wallet?.winningBalance ?? 0)} detail="Withdrawable prizes" />
        <MetricCard icon={CreditCard} label="Bonus" value={formatMoney(wallet?.bonusBalance ?? 0)} detail="Promo balance" />
        <MetricCard icon={History} label="Locked" value={formatMoney(wallet?.lockedBalance ?? 0)} detail="Entries and payouts" />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
        <Card className="p-5">
          <h2 className="text-xl font-black">Deposit</h2>
          <div className="mt-4 space-y-4">
            <Input type="number" min={10} value={amount} onChange={(event: any) => setAmount(Number(event.target.value))} />
            <div className="grid grid-cols-2 gap-2">
              {(["RAZORPAY", "CASHFREE"] as const).map((item) => (
                <Button key={item} variant={provider === item ? "primary" : "secondary"} onClick={() => setProvider(item)}>
                  {item}
                </Button>
              ))}
            </div>
            <Button className="w-full" onClick={createDeposit}>
              Create payment
            </Button>
          </div>
          <h2 className="mt-7 text-xl font-black">Withdraw</h2>
          <div className="mt-4 space-y-4">
            <Input type="number" min={100} value={withdrawAmount} onChange={(event: any) => setWithdrawAmount(Number(event.target.value))} />
            <Input placeholder="upi@bank" value={upi} onChange={(event: any) => setUpi(event.target.value)} />
            <Button variant="secondary" className="w-full" onClick={withdraw}>
              Request withdrawal
            </Button>
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-black">Transaction History</h2>
          <div className="mt-4 space-y-3">
            {(data?.transactions ?? []).map((txn) => (
              <div key={txn.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0F172A] p-3">
                <div>
                  <div className="font-bold">{txn.type.replace("_", " ")}</div>
                  <div className="text-xs text-slate-400">{new Date(txn.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-black">{formatMoney(txn.amount)}</div>
                  <Badge tone={txn.status === "SUCCESS" ? "green" : txn.status === "PENDING" ? "amber" : "pink"}>{txn.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Payment SDK failed to load"));
    document.body.appendChild(script);
  });
}
