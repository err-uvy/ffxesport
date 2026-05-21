"use client";

import {
  useEffect,
  useState
} from "react";

import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Wallet,
  XCircle,
  IndianRupee,
  ShieldCheck
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card
} from "@ffx/ui";

import {
  formatMoney
} from "@ffx/utils";

import {
  PageHeader
} from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

type Withdrawal = {
  id: string;

  amount: string;

  status: string;

  createdAt: string;

  user: {
    username: string;
    email: string;
  };

  transaction: {
    reference: string;
  };
};

export default function AdminWalletPage() {

  const [withdrawals, setWithdrawals] =
    useState<Withdrawal[]>([]);

  useEffect(() => {
    load();
  }, []);

  function load() {

    api
      .get("/admin/withdrawals")

      .then((response) =>
        setWithdrawals(
          response.data.data
        )
      );
  }

  async function update(
    id: string,
    status: string
  ) {

    try {

      await api.patch(
        `/admin/withdrawals/${id}`,
        { status }
      );

      toast.success(
        "Withdrawal updated"
      );

      load();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (

    <div>

      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <PageHeader
        eyebrow="Finance Control"
        title="Wallet & Withdrawals"
      />

      {/* ============================= */}
      {/* TOP STATS */}
      {/* ============================= */}

      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={Wallet}
          label="Total Requests"
          value={String(
            withdrawals.length
          )}
        />

        <StatCard
          icon={Clock3}
          label="Pending"

          value={String(
            withdrawals.filter(
              (w) =>
                w.status ===
                "PENDING"
            ).length
          )}
        />

        <StatCard
          icon={CheckCircle2}
          label="Paid"

          value={String(
            withdrawals.filter(
              (w) =>
                w.status ===
                "PAID"
            ).length
          )}
        />

        <StatCard
          icon={IndianRupee}
          label="Total Volume"

          value={formatMoney(
            withdrawals.reduce(
              (acc, item) =>
                acc +
                Number(
                  item.amount
                ),
              0
            )
          )}
        />
      </div>

      {/* ============================= */}
      {/* WITHDRAWALS */}
      {/* ============================= */}

      <Card
        className="
        overflow-hidden

        border-white/10

        bg-[#081120]/90

        backdrop-blur-2xl
      "
      >

        <div className="divide-y divide-white/5">

          {withdrawals.map(
            (withdrawal) => (

              <div
                key={withdrawal.id}

                className="
                group

                relative

                overflow-hidden

                p-4

                transition-all
                duration-300

                hover:bg-white/[0.02]
              "
              >

                {/* Glow Effect */}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,.05),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,0,128,.05),transparent_30%)] opacity-0 transition duration-500 group-hover:opacity-100" />

                <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-center">

                  {/* LEFT */}

                  <div>

                    <div className="flex items-start gap-4">

                      {/* Avatar */}

                      <div
                        className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center

                        rounded-2xl

                        bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

                        text-lg
                        font-black
                        text-white

                        shadow-[0_0_30px_rgba(0,229,255,.25)]
                      "
                      >
                        {withdrawal.user.username
                          ?.slice(0, 2)
                          .toUpperCase()}
                      </div>

                      {/* Content */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-lg font-black text-white">
                            {
                              withdrawal.user
                                .username
                            }
                          </h2>

                          <Badge
                            tone={
                              withdrawal.status ===
                              "PAID"
                                ? "green"
                                : withdrawal.status ===
                                  "REJECTED"
                                ? "pink"
                                : "amber"
                            }
                          >
                            {
                              withdrawal.status
                            }
                          </Badge>
                        </div>

                        <div className="mt-1 text-sm text-slate-400">
                          {
                            withdrawal.user
                              .email
                          }
                        </div>

                        {/* Money */}

                        <div className="mt-4 flex flex-wrap gap-3">

                          <div
                            className="
                            flex
                            items-center
                            gap-2

                            rounded-2xl

                            border
                            border-cyan-400/15

                            bg-cyan-400/[0.05]

                            px-4
                            py-2

                            text-cyan-100
                          "
                          >
                            <IndianRupee
                              size={16}
                            />

                            <span className="font-bold">
                              {formatMoney(
                                withdrawal.amount
                              )}
                            </span>
                          </div>

                          <div
                            className="
                            flex
                            items-center
                            gap-2

                            rounded-2xl

                            border
                            border-pink-400/15

                            bg-pink-500/[0.05]

                            px-4
                            py-2

                            text-pink-100
                          "
                          >
                            <ArrowUpRight
                              size={16}
                            />

                            {
                              withdrawal
                                .transaction
                                .reference
                            }
                          </div>

                          <div
                            className="
                            flex
                            items-center
                            gap-2

                            rounded-2xl

                            border
                            border-white/10

                            bg-white/[0.03]

                            px-4
                            py-2

                            text-slate-300
                          "
                          >
                            <Clock3
                              size={15}
                            />

                            {new Date(
                              withdrawal.createdAt
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-3">

                    <Button
                      variant="secondary"

                      className="
                      border-emerald-400/20

                      bg-emerald-500/[0.08]

                      text-emerald-100

                      hover:bg-emerald-500/[0.18]
                    "

                      onClick={() =>
                        update(
                          withdrawal.id,
                          "APPROVED"
                        )
                      }
                    >
                      <ShieldCheck
                        size={16}
                      />

                      Approve
                    </Button>

                    <Button
                      className="
                      bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

                      shadow-[0_0_28px_rgba(0,229,255,.25)]
                    "

                      onClick={() =>
                        update(
                          withdrawal.id,
                          "PAID"
                        )
                      }
                    >
                      <CheckCircle2
                        size={16}
                      />

                      Paid
                    </Button>

                    <Button
                      variant="danger"

                      className="
                      border-rose-400/20

                      bg-rose-500/[0.08]

                      text-rose-100

                      hover:bg-rose-500/[0.18]
                    "

                      onClick={() =>
                        update(
                          withdrawal.id,
                          "REJECTED"
                        )
                      }
                    >
                      <XCircle
                        size={16}
                      />

                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  );
}

/* ======================================= */
/* STAT CARD */
/* ======================================= */

function StatCard({
  icon: Icon,
  label,
  value
}: {
  icon: any;

  label: string;

  value: string;
}) {

  return (

    <Card
      className="
      relative

      overflow-hidden

      border-white/10

      bg-[#081120]/90

      p-4

      backdrop-blur-xl
    "
    >

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,.06),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,0,128,.05),transparent_30%)]" />

      <div className="relative z-10 flex items-center justify-between">

        <div>

          <div className="text-sm font-semibold text-slate-400">
            {label}
          </div>

          <div className="mt-1 text-2xl font-black text-white">
            {value}
          </div>
        </div>

        <div
          className="
          flex
          h-14
          w-14
          items-center
          justify-center

          rounded-2xl

          bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

          text-white

          shadow-[0_0_28px_rgba(0,229,255,.25)]
        "
        >
          <Icon size={24} />
        </div>
      </div>
    </Card>
  );
}