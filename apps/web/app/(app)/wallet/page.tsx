"use client";

import {
  useEffect,
  useState
} from "react";

import {
  ArrowDownCircle,
  CircleDollarSign,
  CreditCard,
  History,
  IndianRupee,
  ShieldCheck,
  WalletCards
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input
} from "@/ui";

import {
  MetricCard
} from "@/components/metric-card";

import {
  PageHeader
} from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

import {
  formatMoney
} from "@/utils";

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
            "Wallet Deposit",

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
    <div className="space-y-6 pb-10">

      {/* HEADER */}

      <PageHeader
        eyebrow="FFX PAYMENTS"
        title="Wallet"
      >

        <div
          className="
            rounded-2xl
            border
            border-border
            bg-card
            px-5
            py-3
          "
        >

          <div
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              text-muted
            "
          >
            Available Balance
          </div>

          <div
            className="
              mt-1
              text-2xl
              font-bold
              text-white
            "
          >
            {formatMoney(
              wallet?.balance ?? 0
            )}
          </div>
        </div>
      </PageHeader>

      {/* HERO */}

      <section
        className="
          rounded-[32px]
          border
          border-border
          bg-card
          p-6
          lg:p-8
        "
      >

        <div
          className="
            grid
            gap-8
            xl:grid-cols-[1fr_340px]
          "
        >

          {/* LEFT */}

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-border
                bg-background-secondary
                px-4
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-muted
              "
            >
              Secure Payment System
            </div>

            <h1
              className="
                mt-6
                max-w-4xl
                text-4xl
                font-bold
                tracking-tight
                text-white
                xl:text-5xl
              "
            >
              Manage your esports
              wallet securely.
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                text-base
                leading-8
                text-muted
              "
            >
              Deposit tournament funds,
              withdraw winnings,
              and manage secure payment
              transactions inside the
              FFX ESPORTS ecosystem.
            </p>

            <div
              className="
                mt-8
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >

              <QuickCard
                icon={IndianRupee}
                label="Instant Deposits"
                value="Fast"
              />

              <QuickCard
                icon={ShieldCheck}
                label="Protected"
                value="Secure"
              />

              <QuickCard
                icon={WalletCards}
                label="Wallet System"
                value="Live"
              />

              <QuickCard
                icon={ArrowDownCircle}
                label="Withdrawals"
                value="24/7"
              />
            </div>
          </div>

          {/* RIGHT */}

          <Card
            className="
              rounded-[28px]
              border
              border-border
              bg-background-secondary
              p-6
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <div
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-muted
                  "
                >
                  Total Wallet
                </div>

                <div
                  className="
                    mt-2
                    text-4xl
                    font-bold
                    text-white
                  "
                >
                  {formatMoney(
                    wallet?.balance ?? 0
                  )}
                </div>
              </div>

              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-3xl
                  bg-primary/10
                  text-primary
                "
              >
                <WalletCards size={30} />
              </div>
            </div>

            <div className="mt-8 space-y-4">

              <WalletRow
                label="Winning Balance"
                value={formatMoney(
                  wallet?.winningBalance ??
                    0
                )}
              />

              <WalletRow
                label="Bonus Balance"
                value={formatMoney(
                  wallet?.bonusBalance ??
                    0
                )}
              />

              <WalletRow
                label="Locked Balance"
                value={formatMoney(
                  wallet?.lockedBalance ??
                    0
                )}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* METRICS */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <MetricCard
          icon={WalletCards}
          label="Deposit Balance"
          value={formatMoney(
            wallet?.balance ?? 0
          )}
          detail="Available tournament balance"
        />

        <MetricCard
          icon={CircleDollarSign}
          label="Winning Balance"
          value={formatMoney(
            wallet?.winningBalance ??
              0
          )}
          detail="Withdrawable rewards"
        />

        <MetricCard
          icon={CreditCard}
          label="Bonus Balance"
          value={formatMoney(
            wallet?.bonusBalance ??
              0
          )}
          detail="Promotional credits"
        />

        <MetricCard
          icon={History}
          label="Locked Funds"
          value={formatMoney(
            wallet?.lockedBalance ??
              0
          )}
          detail="Tournament locked amount"
        />
      </div>

      {/* GRID */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[0.8fr_1.2fr]
        "
      >

        {/* LEFT */}

        <div className="space-y-6">

          {/* DEPOSIT */}

          <Card
            className="
              rounded-[30px]
              border
              border-border
              bg-card
              p-6
            "
          >

            <SectionHeader
              icon={CircleDollarSign}
              title="Deposit Funds"
              subtitle="Add money instantly"
            />

            <div className="mt-6 space-y-4">

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-muted
                  "
                >
                  Deposit Amount
                </label>

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
                    rounded-2xl
                    border-border
                    bg-background-secondary
                  "
                />
              </div>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                "
              >

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
                    className="
                      h-12
                      rounded-2xl
                    "
                  >
                    {item}
                  </Button>
                ))}
              </div>

              <Button
                onClick={
                  createDeposit
                }
                className="
                  h-12
                  w-full
                  rounded-2xl
                  bg-white
                  font-semibold
                  text-black
                  hover:bg-zinc-200
                "
              >
                Create Payment
              </Button>
            </div>
          </Card>

          {/* WITHDRAW */}

          <Card
            className="
              rounded-[30px]
              border
              border-border
              bg-card
              p-6
            "
          >

            <SectionHeader
              icon={ArrowDownCircle}
              title="Withdraw Funds"
              subtitle="Transfer winnings securely"
            />

            <div className="mt-6 space-y-4">

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-muted
                  "
                >
                  Withdrawal Amount
                </label>

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
                    rounded-2xl
                    border-border
                    bg-background-secondary
                  "
                />
              </div>

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-muted
                  "
                >
                  UPI ID
                </label>

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
                    rounded-2xl
                    border-border
                    bg-background-secondary
                  "
                />
              </div>

              <Button
                onClick={withdraw}
                variant="secondary"
                className="
                  h-12
                  w-full
                  rounded-2xl
                "
              >
                Request Withdrawal
              </Button>
            </div>
          </Card>
        </div>

        {/* TRANSACTIONS */}

        <Card
          className="
            rounded-[30px]
            border
            border-border
            bg-card
            p-6
          "
        >

          <SectionHeader
            icon={History}
            title="Transaction History"
            subtitle="Payment activity & records"
          />

          <div className="mt-6 space-y-4">

            {(data?.transactions ??
              []).map((txn) => (

              <div
                key={txn.id}
                className="
                  flex
                  flex-col
                  gap-4
                  rounded-2xl
                  border
                  border-border
                  bg-background-secondary
                  p-5
                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                "
              >

                <div>

                  <div
                    className="
                      text-lg
                      font-semibold
                      text-white
                    "
                  >
                    {txn.type.replace(
                      "_",
                      " "
                    )}
                  </div>

                  <div
                    className="
                      mt-2
                      text-sm
                      text-muted
                    "
                  >
                    {new Date(
                      txn.createdAt
                    ).toLocaleString()}
                  </div>

                  {txn.provider && (

                    <div
                      className="
                        mt-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.25em]
                        text-primary
                      "
                    >
                      {
                        txn.provider
                      }
                    </div>
                  )}
                </div>

                <div className="xl:text-right">

                  <div
                    className="
                      text-2xl
                      font-bold
                      text-white
                    "
                  >
                    {formatMoney(
                      txn.amount
                    )}
                  </div>

                  <div className="mt-2">

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

            {!data?.transactions
              ?.length && (

              <div
                className="
                  rounded-2xl
                  border
                  border-border
                  bg-background-secondary
                  p-10
                  text-center
                "
              >

                <div
                  className="
                    text-lg
                    font-semibold
                    text-white
                  "
                >
                  No transactions found
                </div>

                <p
                  className="
                    mt-2
                    text-sm
                    text-muted
                  "
                >
                  Your wallet activity
                  will appear here.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {

  return (
    <div className="flex items-center gap-4">

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-primary/10
          text-primary
        "
      >
        <Icon size={20} />
      </div>

      <div>

        <h2
          className="
            text-xl
            font-bold
            text-white
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-muted
          "
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function WalletRow({
  label,
  value
}: {
  label: string;
  value: string;
}) {

  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-border
        bg-card
        px-4
        py-4
      "
    >

      <div
        className="
          text-sm
          text-muted
        "
      >
        {label}
      </div>

      <div
        className="
          text-lg
          font-bold
          text-white
        "
      >
        {value}
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
        rounded-2xl
        border
        border-border
        bg-background-secondary
        p-4
      "
    >

      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-primary/10
          text-primary
        "
      >
        <Icon size={20} />
      </div>

      <div
        className="
          mt-4
          text-xs
          font-semibold
          uppercase
          tracking-[0.25em]
          text-muted
        "
      >
        {label}
      </div>

      <div
        className="
          mt-2
          text-lg
          font-bold
          text-white
        "
      >
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

