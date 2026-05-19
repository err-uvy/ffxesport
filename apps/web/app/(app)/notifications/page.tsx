"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Badge, Button, Card } from "@ffx/ui";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  function loadNotifications() {
    api.get("/notifications").then((response) => setNotifications(response.data.data));
  }

  async function readAll() {
    await api.patch("/notifications/read-all");
    loadNotifications();
  }

  return (
    <div>
      <PageHeader eyebrow="Signals" title="Notifications">
        <Button variant="secondary" onClick={readAll}>Mark read</Button>
      </PageHeader>
      {notifications.length ? (
        <Card className="divide-y divide-white/10 overflow-hidden">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-black">{notification.title}</h2>
                <Badge tone={notification.readAt ? "green" : "pink"}>{notification.type}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-300">{notification.body}</p>
              <div className="mt-2 text-xs text-slate-500">{new Date(notification.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </Card>
      ) : (
        <EmptyState icon={Bell} title="No notifications" body="Tournament reminders, wallet updates, and room releases land here." />
      )}
    </div>
  );
}
