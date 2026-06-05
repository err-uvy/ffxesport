"use client";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Bell,
  CheckCheck,
  Trophy,
  Wallet,
  ShieldAlert,
  Sparkles,
  Clock3,
  ArrowUpRight
} from "lucide-react";

import {
  Button,
  Card
} from "@/ui";

import {
  EmptyState
} from "@/components/empty-state";

import {
  PageHeader
} from "@/components/page-header";

import {
  api
} from "@/lib/api";

type Notification = {
  id: string;

  type: string;

  title: string;

  body: string;

  readAt?: string | null;

  createdAt: string;
};

export default function NotificationsPage() {

  const [
    notifications,
    setNotifications
  ] = useState<
    Notification[]
  >([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  function loadNotifications() {

    api
      .get("/notifications")
      .then((response) =>
        setNotifications(
          response.data.data
        )
      );
  }

  async function readAll() {

    await api.patch(
      "/notifications/read-all"
    );

    loadNotifications();
  }

  const unreadCount =
    useMemo(
      () =>
        notifications.filter(
          (
            notification
          ) =>
            !notification.readAt
        ).length,
      [notifications]
    );

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}

      <PageHeader
        eyebrow="Realtime Signals"
        title="Notifications"
      >

        <div className="flex items-center gap-3">

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
              Unread
            </div>

            <div
              className="
                mt-1
                text-2xl
                font-bold
                text-white
              "
            >
              {unreadCount}
            </div>
          </div>

          <Button
            onClick={readAll}
            className="
              h-12
              rounded-2xl
              bg-primary
              px-5
              font-semibold
            "
          >

            <CheckCheck
              className="
                mr-2
                h-4
                w-4
              "
            />

            Mark All Read
          </Button>
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

              <Sparkles
                size={14}
              />

              FFX ALERT CENTER
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
              Tournament,
              wallet &
              operational
              alerts in
              realtime.
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
              Stay updated with
              tournament registrations,
              room unlocks,
              withdrawals,
              payouts,
              and security activities
              across your FFX account.
            </p>

            {/* STATS */}

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
                icon={Bell}
                label="Alerts"
                value={String(
                  notifications.length
                )}
              />

              <QuickCard
                icon={Clock3}
                label="Realtime"
                value="Live"
              />

              <QuickCard
                icon={ShieldAlert}
                label="Security"
                value="Protected"
              />

              <QuickCard
                icon={Sparkles}
                label="Updates"
                value="Instant"
              />
            </div>
          </div>

          {/* RIGHT */}

          <div
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
                  Notification Status
                </div>

                <div
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-white
                  "
                >
                  Active
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

                <Bell size={30} />
              </div>
            </div>

            <div className="mt-8 space-y-4">

              <InfoRow
                icon={Trophy}
                title="Tournament Updates"
              />

              <InfoRow
                icon={Wallet}
                title="Wallet Activity"
              />

              <InfoRow
                icon={ShieldAlert}
                title="Security Signals"
              />

              <InfoRow
                icon={ArrowUpRight}
                title="Realtime Sync"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS */}

      {notifications.length ? (

        <div className="space-y-4">

          {notifications.map(
            (
              notification
            ) => (

              <Card
                key={
                  notification.id
                }
                className={`
                  rounded-[30px]
                  border
                  p-6
                  transition-all
                  duration-200

                  ${
                    !notification.readAt
                      ? `
                        border-primary/20
                        bg-card
                      `
                      : `
                        border-border
                        bg-card
                      `
                  }
                `}
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    xl:flex-row
                    xl:items-start
                    xl:justify-between
                  "
                >

                  {/* LEFT */}

                  <div className="flex gap-4">

                    {/* ICON */}

                    <div
                      className={`
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl

                        ${
                          !notification.readAt
                            ? `
                              bg-primary/10
                              text-primary
                            `
                            : `
                              bg-background-secondary
                              text-muted
                            `
                        }
                      `}
                    >

                      {notification.type ===
                      "TOURNAMENT" ? (

                        <Trophy
                          className="
                            h-6
                            w-6
                          "
                        />

                      ) : notification.type ===
                        "WALLET" ? (

                        <Wallet
                          className="
                            h-6
                            w-6
                          "
                        />

                      ) : (

                        <ShieldAlert
                          className="
                            h-6
                            w-6
                          "
                        />

                      )}
                    </div>

                    {/* CONTENT */}

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h2
                          className="
                            text-xl
                            font-bold
                            text-white
                          "
                        >
                          {
                            notification.title
                          }
                        </h2>

                        {!notification.readAt && (

                          <div
                            className="
                              rounded-full
                              border
                              border-primary/20
                              bg-primary/10
                              px-3
                              py-1
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-[0.25em]
                              text-primary
                            "
                          >
                            New
                          </div>
                        )}
                      </div>

                      <p
                        className="
                          mt-4
                          max-w-4xl
                          text-sm
                          leading-7
                          text-muted
                        "
                      >
                        {
                          notification.body
                        }
                      </p>

                      {/* FOOTER */}

                      <div
                        className="
                          mt-5
                          flex
                          flex-wrap
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            rounded-full
                            border
                            border-border
                            bg-background-secondary
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-muted
                          "
                        >
                          {
                            notification.type
                          }
                        </div>

                        <div
                          className="
                            h-1
                            w-1
                            rounded-full
                            bg-border
                          "
                        />

                        <div
                          className="
                            text-xs
                            text-muted
                          "
                        >
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div>

                    <div
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]

                        ${
                          notification.readAt
                            ? `
                              border-green-500/20
                              bg-green-500/10
                              text-green-400
                            `
                            : `
                              border-primary/20
                              bg-primary/10
                              text-primary
                            `
                        }
                      `}
                    >

                      {notification.readAt
                        ? "Read"
                        : "Unread"}
                    </div>
                  </div>
                </div>
              </Card>
            )
          )}
        </div>

      ) : (

        <EmptyState
          icon={Bell}
          title="No Notifications"
          body="Tournament alerts, wallet updates, and operational signals will appear here."
        />
      )}
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
        border-border
        bg-background-secondary
        p-4
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
          tracking-[0.25em]
          text-muted
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1
          text-2xl
          font-bold
          text-white
        "
      >
        {value}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  title
}: {
  icon: any;
  title: string;
}) {

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-border
        bg-card
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

        <Icon size={18} />
      </div>

      <div
        className="
          text-sm
          font-medium
          text-white
        "
      >
        {title}
      </div>
    </div>
  );
}
