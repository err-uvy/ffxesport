"use client";

import {
  useEffect,
  useState
} from "react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Textarea
} from "@/ui";

import {
  Headset,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRound,
  XCircle
} from "lucide-react";

import { PageHeader } from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

type Ticket = {
  id: string;

  subject: string;

  status: string;

  priority: string;

  user: {
    username: string;

    email: string;
  };

  replies: {
    id: string;

    body: string;

    internal: boolean;

    user: {
      username: string;
    };
  }[];
};

export default function AdminSupportPage() {

  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [reply, setReply] =
    useState("");

  useEffect(() => {
    load();
  }, []);

  function load() {

    api
      .get("/admin/tickets")

      .then((response) =>
        setTickets(
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
        `/admin/tickets/${id}`,
        {
          status,

          reply:
            reply || undefined
        }
      );

      toast.success(
        "Ticket updated"
      );

      setReply("");

      load();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (

    <div>

      {/* =======================================================
          HEADER
      ======================================================= */}

      <PageHeader
        eyebrow="Support Tower"
        title="Player Tickets"
      />

      {/* =======================================================
          REPLY BOX
      ======================================================= */}

      <Card
        className="
        mb-6

        overflow-hidden

        border-white/10

        bg-[#081120]/80

        p-6

        backdrop-blur-2xl
      "
      >

        <div className="mb-5 flex items-center gap-3">

          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-2xl

            border
            border-white/5

            bg-cyan-400/[0.08]

            text-cyan-200
          "
          >
            <Headset size={20} />
          </div>

          <div>

            <div className="text-lg font-black text-white">
              Support Response Console
            </div>

            <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">
              Live Moderator Reply System
            </div>
          </div>
        </div>

        <Textarea
          placeholder="Write an admin response..."

          value={reply}

          onChange={(event: any) =>
            setReply(
              event.target.value
            )
          }

          className="
          min-h-[140px]

          border-cyan-400/10

          bg-[#020817]/70

          focus:border-cyan-400/40
        "
        />
      </Card>

      {/* =======================================================
          TICKETS
      ======================================================= */}

      <div className="space-y-5">

        {tickets.map((ticket) => (

          <Card
            key={ticket.id}

            className="
            group

            relative

            overflow-hidden

            border-white/10

            bg-[#081120]/80

            p-6

            backdrop-blur-2xl

            transition-all
            duration-300

            hover:border-white/5
          "
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.08),transparent_30%)] opacity-0 transition duration-500 group-hover:opacity-100" />

            <div className="relative z-10">

              {/* TOP */}

              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                <div>

                  <div className="mb-3 flex flex-wrap gap-2">

                    <Badge
                      tone={
                        ticket.status ===
                        "RESOLVED"
                          ? "green"
                          : ticket.status ===
                            "CLOSED"
                          ? "pink"
                          : "blue"
                      }
                    >
                      {ticket.status}
                    </Badge>

                    <Badge tone="amber">
                      {
                        ticket.priority
                      }
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-black text-white">
                    {ticket.subject}
                  </h2>

                  <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-slate-400">

                    <span className="flex items-center gap-2">

                      <UserRound
                        size={16}
                        className="text-cyan-200"
                      />

                      {
                        ticket.user
                          .username
                      }
                    </span>

                    <span className="text-slate-500">
                      {
                        ticket.user.email
                      }
                    </span>
                  </div>
                </div>

                <div
                  className="
                  rounded-2xl

                  border
                  border-cyan-400/10

                  bg-cyan-400/[0.05]

                  px-4
                  py-3
                "
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-200">

                    <Sparkles size={14} />

                    Ticket Activity
                  </div>

                  <div className="mt-1 text-2xl font-black text-white">
                    {
                      ticket.replies
                        .length
                    }
                  </div>
                </div>
              </div>

              {/* REPLIES */}

              <div className="mt-4 space-y-3">

                {ticket.replies.map(
                  (item) => (

                    <div
                      key={item.id}

                      className={`
                        rounded-2xl
                        border
                        p-4
                        text-sm
                        leading-7

                        ${
                          item.internal
                            ? "border-pink-400/10 bg-pink-500/[0.05]"
                            : "border-cyan-400/10 bg-cyan-400/[0.05]"
                        }
                      `}
                    >

                      <div className="mb-2 flex items-center gap-2">

                        {item.internal ? (

                          <ShieldAlert
                            size={15}
                            className="text-pink-300"
                          />

                        ) : (

                          <ShieldCheck
                            size={15}
                            className="text-white"
                          />
                        )}

                        <span
                          className={`
                            text-xs
                            font-bold
                            uppercase
                            tracking-[0.22em]

                            ${
                              item.internal
                                ? "text-pink-200"
                                : "text-cyan-200"
                            }
                          `}
                        >
                          {
                            item.user
                              .username
                          }
                        </span>
                      </div>

                      <div className="text-slate-200">
                        {item.body}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* ACTIONS */}

              <div className="mt-4 flex flex-wrap gap-3">

                <Button
                  variant="secondary"

                  onClick={() =>
                    update(
                      ticket.id,
                      "PENDING_USER"
                    )
                  }
                >
                  <Headset size={17} />

                  Reply
                </Button>

                <Button
                  onClick={() =>
                    update(
                      ticket.id,
                      "RESOLVED"
                    )
                  }
                >
                  <ShieldCheck size={17} />

                  Resolve
                </Button>

                <Button
                  variant="danger"

                  onClick={() =>
                    update(
                      ticket.id,
                      "CLOSED"
                    )
                  }
                >
                  <XCircle size={17} />

                  Close
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}