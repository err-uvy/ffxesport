"use client";

import { useEffect, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Headphones,
  MessageSquare,
  ShieldAlert,
  Wallet,
  Trophy
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input,
  Textarea
} from "@/ui";

import { EmptyState } from "@/components/empty-state";
import { api, apiMessage } from "@/lib/api";

type Ticket = {
  id: string;

  subject: string;

  category: string;

  status: string;

  priority: string;

  replies: {
    id: string;
    body: string;
    createdAt: string;
    internal: boolean;
  }[];
};

export default function SupportPage() {

  const [tickets, setTickets] =
    useState<Ticket[]>([]);

  const [subject, setSubject] =
    useState("");

  const [body, setBody] =
    useState("");

  const [category, setCategory] =
    useState("Tournament");

  useEffect(() => {
    loadTickets();
  }, []);

  function loadTickets() {

    api
      .get("/tickets")
      .then((response) =>
        setTickets(response.data.data)
      );
  }

  async function createTicket() {

    try {

      await api.post("/tickets", {
        subject,
        body,
        category,
        priority: "MEDIUM"
      });

      toast.success(
        "Support ticket created"
      );

      setSubject("");
      setBody("");

      loadTickets();

    } catch (error) {

      toast.error(apiMessage(error));
    }
  }

  return (
    <div className="main-container">

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
          FFX Help Center
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-white">
          Support Tickets
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Contact tournament operations,
          wallet support,
          match officials,
          and fraud monitoring teams.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">

        {/* LEFT SIDE */}

        <Card
          className="
            premium-card
            border
            border-white/5
            bg-[#101010]
            p-6
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-blue-500/10
                text-blue-400
              "
            >
              <Headphones size={26} />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                Create Ticket
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Reach the FFX support team
              </p>
            </div>
          </div>

          {/* FORM */}

          <div className="mt-8 space-y-5">

            <Input
              placeholder="Ticket subject"
              value={subject}
              onChange={(event: any) =>
                setSubject(
                  event.target.value
                )
              }
              className="
                h-12
                border-white/10
                bg-[#181818]
              "
            />

            <select
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-white/10
                bg-[#181818]
                px-4
                text-sm
                text-white
                outline-none
              "
              value={category}
              onChange={(event: any) =>
                setCategory(
                  event.target.value
                )
              }
            >

              {[
                "Tournament",
                "Wallet",
                "Match",
                "Account",
                "Fraud"
              ].map((item) => (

                <option key={item}>
                  {item}
                </option>
              ))}
            </select>

            <Textarea
              placeholder="Describe your issue..."
              value={body}
              onChange={(event: any) =>
                setBody(
                  event.target.value
                )
              }
              className="
                min-h-[180px]
                border-white/10
                bg-[#181818]
                text-white
              "
            />

            <Button
              className="
                h-12
                w-full
                rounded-2xl
                bg-blue-600
                font-semibold
                hover:bg-blue-700
              "
              onClick={createTicket}
            >
              Submit Ticket
            </Button>
          </div>

          {/* QUICK INFO */}

          <div
            className="
              mt-8
              rounded-3xl
              border
              border-blue-500/10
              bg-blue-500/5
              p-4
            "
          >

            <div className="flex items-center gap-3">

              <ShieldAlert
                className="text-blue-400"
                size={20}
              />

              <h3 className="font-bold text-white">
                Support Priority
              </h3>
            </div>

            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Fraud reports and payment issues
              receive higher priority response
              from FFX operations staff.
            </p>
          </div>
        </Card>

        {/* RIGHT SIDE */}

        {tickets.length ? (

          <div className="space-y-5">

            {tickets.map((ticket) => (

              <Card
                key={ticket.id}
                className="
                  premium-card
                  border
                  border-white/5
                  bg-[#101010]
                  p-6
                  transition-all
                  duration-200
                  hover:border-blue-500/20
                "
              >

                {/* TOP */}

                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                  <div className="flex gap-4">

                    {/* ICON */}

                    <div
                      className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-blue-500/10
                        text-blue-400
                      "
                    >

                      {ticket.category ===
                      "Tournament" ? (

                        <Trophy size={24} />

                      ) : ticket.category ===
                        "Wallet" ? (

                        <Wallet size={24} />

                      ) : ticket.category ===
                        "Fraud" ? (

                        <AlertTriangle
                          size={24}
                        />

                      ) : (

                        <MessageSquare
                          size={24}
                        />
                      )}
                    </div>

                    {/* TEXT */}

                    <div>

                      <h2 className="text-2xl font-bold text-white">
                        {ticket.subject}
                      </h2>

                      <div className="mt-3 flex flex-wrap items-center gap-3">

                        <div
                          className="
                            rounded-full
                            border
                            border-white/10
                            bg-[#181818]
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-zinc-400
                          "
                        >
                          {ticket.category}
                        </div>

                        <div
                          className="
                            rounded-full
                            border
                            border-orange-500/20
                            bg-orange-500/10
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.15em]
                            text-orange-300
                          "
                        >
                          {ticket.priority}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS */}

                  <Badge
                    tone={
                      ticket.status ===
                      "RESOLVED"
                        ? "green"
                        : "blue"
                    }
                  >
                    {ticket.status}
                  </Badge>
                </div>

                {/* REPLIES */}

                <div className="mt-4 space-y-4">

                  {ticket.replies
                    .filter(
                      (reply) =>
                        !reply.internal
                    )
                    .map((reply) => (

                      <div
                        key={reply.id}
                        className="
                          rounded-3xl
                          border
                          border-white/5
                          bg-[#181818]
                          p-4
                        "
                      >

                        <div className="flex items-start gap-3">

                          <div
                            className="
                              mt-1
                              flex
                              h-10
                              w-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-xl
                              bg-blue-500/10
                              text-blue-400
                            "
                          >
                            <MessageSquare
                              size={18}
                            />
                          </div>

                          <div className="flex-1">

                            <p className="text-sm leading-7 text-zinc-300">
                              {reply.body}
                            </p>

                            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">

                              <CheckCircle2
                                size={14}
                              />

                              {new Date(
                                reply.createdAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </Card>
            ))}
          </div>

        ) : (

          <EmptyState
            icon={Headphones}
            title="No support tickets"
            body="Create a ticket whenever you need tournament, wallet, or account assistance."
          />
        )}
      </div>
    </div>
  );
}