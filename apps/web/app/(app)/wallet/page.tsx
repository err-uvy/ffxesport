"use client";

import {
  useEffect,
  useState
} from "react";

import {
  CircleDollarSign,
  CreditCard,
  History,
  WalletCards,
  ArrowDownCircle,
  ShieldCheck,
  Sparkles,
  IndianRupee
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input
} from "@/ui";

import { formatMoney } from "@ffx/utils";

import { MetricCard } from "@/components/metric-card";

import { PageHeader } from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

declare global {
  interface Window {
    Razorpay?: new (
      options: Record<
        string,
        unknown
      >
    ) => {
      open: () => void;
    };
  }
}

type WalletData = {
  wallet: {
    balance: string;

    winningBalance: string;

    bonusBalance: string;

    lockedBalance: string;
  };

  transactions: {
    id: string;

    type: string;

    status: string;

    amount: string;

    createdAt: string;

    provider?: string;
  }[];
};

export default function WalletPage() {

  const [data, setData] =
    useState<WalletData | null>(
      null
    );

  const [amount, setAmount] =
    useState(250);

  const [provider, setProvider] =
    useState<
      "RAZORPAY" | "CASHFREE"
    >("RAZORPAY");

  const [
    withdrawAmount,
    setWithdrawAmount
  ] = useState(500);

  const [upi, setUpi] =
    useState("");

  useEffect(() => {
    loadWallet();
  }, []);

  function loadWallet() {

    api
      .get("/wallet")
      .then((response) =>
        setData(
          response.data.data
        )
      );
  }

  async function createDeposit() {

    try {

      const response =
        await api.post(
          "/wallet/deposit/create",
          {
            amount,
            provider
          }
        );

      const payload =
        response.data.data;

      if (
        provider ===
          "RAZORPAY" &&
        payload.keyId &&
        payload.order
      ) {

        await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        const Checkout =
          window.Razorpay;

        if (!Checkout) {

          throw new Error(
            "Razorpay SDK unavailable"
          );
        }

        new Checkout({
          key: payload.keyId,

          amount:
            payload.order.amount,

          currency: "INR",

          name: "FFX ESPORTS",

          description:
            "Wallet deposit",

          order_id:
            payload.order.id,

          handler: () => {

            toast.success(
              "Payment successful"
            );

            loadWallet();
          }
        }).open();

      } else {

        toast.success(
          "Payment order created"
        );
      }

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  async function withdraw() {

    try {

      await api.post(
        "/wallet/withdraw",
        {
          amount:
            withdrawAmount,

          payoutAccount: {
            upi,

            holderName:
              "FFX Player"
          }
        }
      );

      toast.success(
        "Withdrawal requested"
      );

      loadWallet();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  const wallet =
    data?.wallet;

  return (
    <div className="pb-10">

      {/* HERO */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-white/10
          bg-[#0d0d0d]
          p-7
          xl:p-10
        "
      >

        {/* BG */}

        <div
          className="
            absolute
            inset-0
            opacity-20
          "
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition:
              "center"
          }}
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-blue-600/20
            via-black/80
            to-cyan-500/10
          "
        />

        {/* CONTENT */}

        <div className="relative z-10">

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-3xl
                bg-blue-500/10
                text-blue-400
              "
            >
              <WalletCards size={32} />
            </div>

            <div>

              <div
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-zinc-500
                "
              >
                FFX PAYMENTS
              </div>

              <h1
                className="
                  mt-1
                  text-4xl
                  font-black
                  text-white
                  xl:text-6xl
                "
              >
                Wallet
              </h1>
            </div>
          </div>

          <p
            className="
              mt-4
              max-w-3xl
              text-base
              leading-8
              text-zinc-300
              xl:text-lg
            "
          >
            Deposit funds, join tournaments,
            withdraw winnings,
            and track every esports transaction
            securely.
          </p>

          {/* QUICK STATS */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <QuickCard
              icon={IndianRupee}
              label="Fast Deposits"
              value="Instant"
            />

            <QuickCard
              icon={ShieldCheck}
              label="Secure Payments"
              value="100%"
            />

            <QuickCard
              icon={Sparkles}
              label="Bonus Rewards"
              value="Active"
            />

            <QuickCard
              icon={ArrowDownCircle}
              label="Withdrawals"
              value="24/7"
            />
          </div>
        </div>
      </section>

      {/* METRICS */}

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          icon={WalletCards}
          label="Deposit Balance"
          value={formatMoney(
            wallet?.balance ?? 0
          )}
          detail="Usable tournament balance"
        />

        <MetricCard
          icon={CircleDollarSign}
          label="Winning"
          value={formatMoney(
            wallet?.winningBalance ??
              0
          )}
          detail="Withdrawable cash rewards"
        />

        <MetricCard
          icon={CreditCard}
          label="Bonus"
          value={formatMoney(
            wallet?.bonusBalance ??
              0
          )}
          detail="Promo & cashback credits"
        />

        <MetricCard
          icon={History}
          label="Locked"
          value={formatMoney(
            wallet?.lockedBalance ??
              0
          )}
          detail="Tournament locked funds"
        />
      </div>

      {/* MAIN GRID */}

      <div className="mt-7 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">

        {/* LEFT */}

        <div className="space-y-6">

          {/* DEPOSIT */}

          <Card
            className="
              rounded-[32px]
              border
              border-white/5
              bg-[#101010]
              p-6
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-green-500/10
                  text-green-400
                "
              >
                <CircleDollarSign
                  size={22}
                />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Deposit Funds
                </h2>

                <p className="text-sm text-zinc-400">
                  Add money instantly
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">

              <Input
                type="number"
                min={10}
                value={amount}
                onChange={(
                  event: any
                ) =>
                  setAmount(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="
                  h-12
                  border-white/10
                  bg-[#181818]
                "
              />

              <div className="grid grid-cols-2 gap-3">

                {(
                  [
                    "RAZORPAY",
                    "CASHFREE"
                  ] as const
                ).map((item) => (

                  <Button
                    key={item}
                    variant={
                      provider === item
                        ? "primary"
                        : "secondary"
                    }
                    onClick={() =>
                      setProvider(item)
                    }
                    className={`
                      h-12
                      rounded-2xl
                      border

                      ${
                        provider === item
                          ? "border-blue-500/20 bg-blue-600"
                          : "border-white/10 bg-[#181818]"
                      }
                    `}
                  >
                    {item}
                  </Button>
                ))}
              </div>

              <Button
                className="
                  h-12
                  w-full
                  rounded-2xl
                  bg-blue-600
                  font-semibold
                  hover:bg-blue-700
                "
                onClick={
                  createDeposit
                }
              >
                Create Payment
              </Button>
            </div>
          </Card>

          {/* WITHDRAW */}

          <Card
            className="
              rounded-[32px]
              border
              border-white/5
              bg-[#101010]
              p-6
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-yellow-500/10
                  text-yellow-400
                "
              >
                <ArrowDownCircle
                  size={22}
                />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Withdraw Funds
                </h2>

                <p className="text-sm text-zinc-400">
                  Transfer winnings securely
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">

              <Input
                type="number"
                min={100}
                value={
                  withdrawAmount
                }
                onChange={(
                  event: any
                ) =>
                  setWithdrawAmount(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="
                  h-12
                  border-white/10
                  bg-[#181818]
                "
              />

              <Input
                placeholder="upi@bank"
                value={upi}
                onChange={(
                  event: any
                ) =>
                  setUpi(
                    event.target.value
                  )
                }
                className="
                  h-12
                  border-white/10
                  bg-[#181818]
                "
              />

              <Button
                variant="secondary"
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border-white/10
                  bg-[#181818]
                  hover:bg-[#1f1f1f]
                "
                onClick={withdraw}
              >
                Request Withdrawal
              </Button>
            </div>
          </Card>
        </div>

        {/* TRANSACTION HISTORY */}

        <Card
          className="
            rounded-[32px]
            border
            border-white/5
            bg-[#101010]
            p-6
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-blue-500/10
                text-blue-400
              "
            >
              <History size={22} />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                Transaction History
              </h2>

              <p className="text-sm text-zinc-400">
                Payment activity & records
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-4">

            {(data?.transactions ??
              []).map((txn) => (

              <div
                key={txn.id}
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-3xl
                  border
                  border-white/5
                  bg-[#181818]
                  p-4
                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                "
              >

                <div>

                  <div className="text-lg font-bold text-white">
                    {txn.type.replace(
                      "_",
                      " "
                    )}
                  </div>

                  <div className="mt-1 text-sm text-zinc-500">
                    {new Date(
                      txn.createdAt
                    ).toLocaleString()}
                  </div>

                  {txn.provider && (
                    <div className="mt-1 text-xs uppercase tracking-[0.2em] text-blue-400">
                      {
                        txn.provider
                      }
                    </div>
                  )}
                </div>

                <div className="text-left xl:text-right">

                  <div className="text-2xl font-black text-white">
                    {formatMoney(
                      txn.amount
                    )}
                  </div>

                  <div className="mt-1">

                    <Badge
                      tone={
                        txn.status ===
                        "SUCCESS"
                          ? "green"
                          : txn.status ===
                            "PENDING"
                          ? "amber"
                          : "pink"
                      }
                    >
                      {txn.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickCard({
  icon: Icon,
  label,
  value
}: {
  icon: any;
  label: string;
  value: string;
}) {

  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-black/30
        p-4
        backdrop-blur-xl
      "
    >

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-blue-500/10
          text-blue-400
        "
      >
        <Icon size={22} />
      </div>

      <div className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>

      <div className="mt-1 text-2xl font-black text-white">
        {value}
      </div>
    </div>
  );
}

function loadScript(src: string) {

  return new Promise<void>(
    (resolve, reject) => {

      if (
        document.querySelector(
          `script[src="${src}"]`
        )
      ) {

        return resolve();
      }

      const script =
        document.createElement(
          "script"
        );

      script.src = src;

      script.onload = () =>
        resolve();

      script.onerror = () =>
        reject(
          new Error(
            "Payment SDK failed to load"
          )
        );

      document.body.appendChild(
        script
      );
    }
  );
}