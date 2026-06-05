"use client";

import {
  useEffect,
  useState
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Headphones,
  MessageSquare,
  ShieldAlert,
  Wallet,
  Trophy,
  Sparkles,
  Clock3,
  ArrowRight
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input,
  Textarea
} from "@/ui";

import {
  EmptyState
} from "@/components/empty-state";

import {
  PageHeader
} from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

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

  const [
    tickets,
    setTickets
  ] = useState<Ticket[]>([]);

  const [
    subject,
    setSubject
  ] = useState("");

  const [body, setBody] =
    useState("");

  const [
    category,
    setCategory
  ] = useState("Tournament");

  useEffect(() => {
    loadTickets();
  }, []);

  function loadTickets() {

    api
      .get("/tickets")
      .then((response) =>
        setTickets(
          response.data.data
        )
      );
  }

  async function createTicket() {

    try {

      await api.post(
        "/tickets",
        {
          subject,
          body,
          category,
          priority:
            "MEDIUM"
        }
      );

      toast.success(
        "Support ticket created"
      );

      setSubject("");
      setBody("");

      loadTickets();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}

      <PageHeader
        eyebrow="FFX Support Center"
        title="Support Tickets"
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
            Avg Response
          </div>

          <div
            className="
              mt-1
              flex
              items-center
              gap-2
              text-lg
              font-bold
              text-white
            "
          >

            <Clock3
              size={18}
              className="
                text-primary
              "
            />

            Under 15 Min
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
            gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          <HeroCard
            icon={Headphones}
            title="24/7 Support"
            value="Live"
          />

          <HeroCard
            icon={Wallet}
            title="Wallet Issues"
            value="Priority"
          />

          <HeroCard
            icon={ShieldAlert}
            title="Fraud Reports"
            value="Fast Track"
          />

          <HeroCard
            icon={Sparkles}
            title="Tournament Ops"
            value="Active"
          />
        </div>
      </section>

      {/* GRID */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[420px_1fr]
        "
      >

        {/* LEFT */}

        <Card
          className="
            rounded-[32px]
            border
            border-border
            bg-card
            p-6
            h-fit
            sticky
            top-6
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-3xl
                bg-primary/10
                text-primary
              "
            >

              <Headphones
                size={26}
              />
            </div>

            <div>

              <h2
                className="
                  text-2xl
                  font-bold
                  text-white
                "
              >
                Create Ticket
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted
                "
              >
                Contact FFX operations
              </p>
            </div>
          </div>

          {/* FORM */}

          <div className="mt-8 space-y-5">

            <div>

              <p
                className="
                  mb-2
                  text-sm
                  font-medium
                  text-muted
                "
              >
                Subject
              </p>

              <Input
                placeholder="Ticket subject"
                value={subject}
                onChange={(
                  event: any
                ) =>
                  setSubject(
                    event.target
                      .value
                  )
                }
                className="
                  h-12
                  border-border
                  bg-background-secondary
                "
              />
            </div>

            <div>

              <p
                className="
                  mb-2
                  text-sm
                  font-medium
                  text-muted
                "
              >
                Category
              </p>

              <select
                className="
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-background-secondary
                  px-4
                  text-sm
                  text-white
                  outline-none
                "
                value={category}
                onChange={(
                  event: any
                ) =>
                  setCategory(
                    event.target
                      .value
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

                  <option
                    key={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>

              <p
                className="
                  mb-2
                  text-sm
                  font-medium
                  text-muted
                "
              >
                Description
              </p>

              <Textarea
                placeholder="Describe your issue..."
                value={body}
                onChange={(
                  event: any
                ) =>
                  setBody(
                    event.target
                      .value
                  )
                }
                className="
                  min-h-[200px]
                  border-border
                  bg-background-secondary
                  text-white
                "
              />
            </div>

            <Button
              className="
                h-12
                w-full
                rounded-2xl
                bg-primary
                font-semibold
              "
              onClick={
                createTicket
              }
            >

              Submit Ticket

              <ArrowRight
                size={18}
              />
            </Button>
          </div>

          {/* INFO */}

          <div
            className="
              mt-8
              rounded-3xl
              border
              border-border
              bg-background-secondary
              p-5
            "
          >

            <div className="flex items-center gap-3">

              <ShieldAlert
                size={20}
                className="
                  text-primary
                "
              />

              <h3
                className="
                  font-bold
                  text-white
                "
              >
                Priority Escalation
              </h3>
            </div>

            <p
              className="
                mt-3
                text-sm
                leading-7
                text-muted
              "
            >
              Wallet failures, fraud reports,
              payment disputes, and tournament
              fairness issues are escalated
              directly to operations staff.
            </p>
          </div>
        </Card>

        {/* RIGHT */}

        <div className="space-y-5">

          {tickets.length ? (

            tickets.map(
              (ticket) => (

                <Card
                  key={ticket.id}
                  className="
                    rounded-[32px]
                    border
                    border-border
                    bg-card
                    p-6
                    transition-all
                    duration-300
                    hover:border-primary/20
                  "
                >

                  {/* TOP */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      lg:flex-row
                      lg:items-start
                      lg:justify-between
                    "
                  >

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
                          rounded-3xl
                          bg-primary/10
                          text-primary
                        "
                      >

                        {ticket.category ===
                        "Tournament" ? (

                          <Trophy
                            size={24}
                          />

                        ) : ticket.category ===
                          "Wallet" ? (

                          <Wallet
                            size={24}
                          />

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

                      {/* CONTENT */}

                      <div>

                        <h2
                          className="
                            text-2xl
                            font-bold
                            text-white
                          "
                        >
                          {
                            ticket.subject
                          }
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">

                          <Badge tone="black">
                            {
                              ticket.category
                            }
                          </Badge>

                          <Badge tone="amber">
                            {
                              ticket.priority
                            }
                          </Badge>
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
                      {
                        ticket.status
                      }
                    </Badge>
                  </div>

                  {/* REPLIES */}

                  <div className="mt-6 space-y-4">

                    {ticket.replies
                      .filter(
                        (
                          reply
                        ) =>
                          !reply.internal
                      )
                      .map(
                        (
                          reply
                        ) => (

                          <div
                            key={
                              reply.id
                            }
                            className="
                              rounded-3xl
                              border
                              border-border
                              bg-background-secondary
                              p-5
                            "
                          >

                            <div className="flex gap-4">

                              <div
                                className="
                                  flex
                                  h-11
                                  w-11
                                  shrink-0
                                  items-center
                                  justify-center
                                  rounded-2xl
                                  bg-primary/10
                                  text-primary
                                "
                              >

                                <MessageSquare
                                  size={18}
                                />
                              </div>

                              <div className="flex-1">

                                <p
                                  className="
                                    text-sm
                                    leading-7
                                    text-zinc-300
                                  "
                                >
                                  {
                                    reply.body
                                  }
                                </p>

                                <div
                                  className="
                                    mt-4
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    text-muted
                                  "
                                >

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
                        )
                      )}
                  </div>
                </Card>
              )
            )

          ) : (

            <EmptyState
              icon={Headphones}
              title="No Support Tickets"
              body="Create a ticket whenever you need tournament, wallet, fraud, or account assistance."
            />
          )}
        </div>
      </div>
    </div>
  );
}

function HeroCard({
  icon: Icon,
  title,
  value
}: {
  icon: any;
  title: string;
  value: string;
}) {

  return (
    <div
      className="
        rounded-3xl
        border
        border-border
        bg-background-secondary
        p-5
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
          bg-primary/10
          text-primary
        "
      >

        <Icon size={22} />
      </div>

      <div
        className="
          mt-4
          text-xs
          font-semibold
          uppercase
          tracking-[0.2em]
          text-muted
        "
      >
        {title}
      </div>

      <div
        className="
          mt-1
          text-2xl
          font-black
          text-white
        "
      >
        {value}
      </div>
    </div>
  );
}

