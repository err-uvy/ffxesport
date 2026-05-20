"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Textarea } from "@ffx/ui";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  user: { username: string; email: string };
  replies: { id: string; body: string; internal: boolean; user: { username: string } }[];
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    load();
  }, []);

  function load() {
    api.get("/admin/tickets").then((response) => setTickets(response.data.data));
  }

  async function update(id: string, status: string) {
    try {
      await api.patch(`/admin/tickets/${id}`, { status, reply: reply || undefined });
      toast.success("Ticket updated");
      setReply("");
      load();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Support desk" title="Tickets" />
      <Card className="mb-6 p-5">
        <Textarea placeholder="Admin reply" value={reply} onChange={(event) => setReply(event.target.value)} />
      </Card>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-black">{ticket.subject}</h2>
                <p className="text-sm text-slate-400">{ticket.user.username} / {ticket.user.email}</p>
              </div>
              <Badge tone={ticket.status === "RESOLVED" ? "green" : "blue"}>{ticket.status}</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {ticket.replies.map((item) => (
                <div key={item.id} className="rounded-lg border border-white/10 bg-[#0F172A] p-3 text-sm text-slate-300">
                  {item.body}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => update(ticket.id, "PENDING_USER")}>Reply</Button>
              <Button onClick={() => update(ticket.id, "RESOLVED")}>Resolve</Button>
              <Button variant="danger" onClick={() => update(ticket.id, "CLOSED")}>Close</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
