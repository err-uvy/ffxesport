"use client";

import { useEffect, useState } from "react";
import { Headphones } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, Textarea } from "@ffx/ui";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

type Ticket = {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  replies: { id: string; body: string; createdAt: string; internal: boolean }[];
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Tournament");

  useEffect(() => {
    loadTickets();
  }, []);

  function loadTickets() {
    api.get("/tickets").then((response) => setTickets(response.data.data));
  }

  async function createTicket() {
    try {
      await api.post("/tickets", { subject, body, category, priority: "MEDIUM" });
      toast.success("Ticket created");
      setSubject("");
      setBody("");
      loadTickets();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Support" title="Tickets" />
      <div className="grid gap-5 xl:grid-cols-[.75fr_1.25fr]">
        <Card className="p-5">
          <h2 className="text-xl font-black">Create ticket</h2>
          <div className="mt-4 space-y-3">
            <Input placeholder="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
            <select className="h-11 w-full rounded-lg border border-white/10 bg-[#070B14] px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
              {["Tournament", "Wallet", "Match", "Account", "Fraud"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <Textarea placeholder="Message" value={body} onChange={(event) => setBody(event.target.value)} />
            <Button className="w-full" onClick={createTicket}>Submit</Button>
          </div>
        </Card>
        {tickets.length ? (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black">{ticket.subject}</h2>
                    <p className="text-sm text-slate-400">{ticket.category}</p>
                  </div>
                  <Badge tone={ticket.status === "RESOLVED" ? "green" : "cyan"}>{ticket.status}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {ticket.replies.filter((reply) => !reply.internal).map((reply) => (
                    <div key={reply.id} className="rounded-lg border border-white/10 bg-white/[0.05] p-3 text-sm text-slate-300">
                      {reply.body}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState icon={Headphones} title="No support tickets" body="Create a ticket when you need wallet, match, or tournament help." />
        )}
      </div>
    </div>
  );
}
