"use client";

import { useEffect, useState } from "react";
import { Badge, Card } from "@ffx/ui";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";

type AuditLog = {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  createdAt: string;
  actor?: { username?: string; email?: string };
};

type FraudLog = {
  id: string;
  severity: string;
  reason: string;
  createdAt: string;
  user?: { username?: string; email?: string };
};

export default function AdminAuditPage() {
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [fraud, setFraud] = useState<FraudLog[]>([]);

  useEffect(() => {
    Promise.all([api.get("/admin/audit-logs"), api.get("/admin/fraud-logs")]).then(([auditRes, fraudRes]) => {
      setAudit(auditRes.data.data);
      setFraud(fraudRes.data.data);
    });
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Security" title="Audit Logs" />
      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="border-b border-white/10 p-4 text-lg font-black">Admin and API Audit</div>
          <div className="divide-y divide-white/10">
            {audit.map((log) => (
              <div key={log.id} className="p-4">
                <div className="font-bold">{log.action}</div>
                <div className="text-sm text-slate-400">{log.resource} / {log.actor?.username ?? "system"} / {new Date(log.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="border-b border-white/10 p-4 text-lg font-black">Fraud Signals</div>
          <div className="divide-y divide-white/10">
            {fraud.map((log) => (
              <div key={log.id} className="p-4">
                <Badge tone={log.severity === "CRITICAL" ? "pink" : "amber"}>{log.severity}</Badge>
                <div className="mt-2 font-bold">{log.reason}</div>
                <div className="text-sm text-slate-400">{log.user?.username ?? "unknown"} / {new Date(log.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
