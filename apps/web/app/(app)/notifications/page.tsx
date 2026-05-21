"use client";

import { useEffect, useState } from "react";

import {
  Bell,
  CheckCheck,
  Trophy,
  Wallet,
  ShieldAlert,
} from "lucide-react";

import {
  Button,
  Card,
} from "@ffx/ui";

import { EmptyState } from "@/components/empty-state";
import { api } from "@/lib/api";

type Notification = {
  id: string;

  type: string;

  title: string;

  body: string;

  readAt?: string | null;

  createdAt: string;
};

export default function NotificationsPage() {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  function loadNotifications() {
    api
      .get("/notifications")
      .then((response) =>
        setNotifications(response.data.data)
      );
  }

  async function readAll() {
    await api.patch(
      "/notifications/read-all"
    );

    loadNotifications();
  }

  return (
    <div className="main-container">

      {/* HEADER */}

      <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
            Signals Center
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight text-white">
            Notifications
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Stay updated with tournament alerts,
            wallet activity, room unlocks, and
            esports operations.
          </p>
        </div>

        <Button
          onClick={readAll}
          className="
            h-12
            rounded-2xl
            bg-blue-600
            px-5
            text-sm
            font-semibold
            hover:bg-blue-700
          "
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      {/* CONTENT */}

      {notifications.length ? (

        <div className="space-y-4">

          {notifications.map(
            (notification) => (

              <Card
                key={notification.id}
                className="
                  premium-card
                  overflow-hidden
                  border
                  border-white/5
                  bg-[#101010]
                  p-6
                  transition-all
                  duration-200
                  hover:border-blue-500/20
                "
              >

                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

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
                              bg-blue-500/10
                              text-blue-400
                            `
                            : `
                              bg-zinc-800
                              text-zinc-400
                            `
                        }
                      `}
                    >
                      {notification.type ===
                      "TOURNAMENT" ? (

                        <Trophy className="h-6 w-6" />

                      ) : notification.type ===
                        "WALLET" ? (

                        <Wallet className="h-6 w-6" />

                      ) : (

                        <ShieldAlert className="h-6 w-6" />

                      )}
                    </div>

                    {/* TEXT */}

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-lg font-bold text-white">
                          {notification.title}
                        </h2>

                        {!notification.readAt && (

                          <div
                            className="
                              rounded-full
                              border
                              border-blue-500/20
                              bg-blue-500/10
                              px-3
                              py-1
                              text-[10px]
                              font-semibold
                              uppercase
                              tracking-[0.2em]
                              text-blue-400
                            "
                          >
                            New
                          </div>
                        )}
                      </div>

                      <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                        {notification.body}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">

                        <div
                          className="
                            rounded-full
                            border
                            border-white/5
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
                          {notification.type}
                        </div>

                        <div className="h-1 w-1 rounded-full bg-zinc-700" />

                        <p className="text-xs text-zinc-500">
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </p>
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
                              border-blue-500/20
                              bg-blue-500/10
                              text-blue-400
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
          body="Tournament reminders, room releases, payout alerts, and wallet updates will appear here."
        />
      )}
    </div>
  );
}