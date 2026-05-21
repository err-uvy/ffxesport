"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Activity,
  AlertTriangle,
  ShieldAlert
} from "lucide-react";

import {
  Badge,
  Card
} from "@/ui";

import { PageHeader } from "@/components/page-header";

import { api } from "@/lib/api";

type AuditLog = {
  id: string;
  action: string;
  resource: string;
  resourceId?: string;
  createdAt: string;

  actor?: {
    username?: string;
    email?: string;
  };
};

type FraudLog = {
  id: string;

  severity: string;

  reason: string;

  createdAt: string;

  user?: {
    username?: string;
    email?: string;
  };
};

export default function AdminAuditPage() {

  const [audit, setAudit] =
    useState<AuditLog[]>([]);

  const [fraud, setFraud] =
    useState<FraudLog[]>([]);

  useEffect(() => {

    Promise.all([
      api.get("/admin/audit-logs"),
      api.get("/admin/fraud-logs")
    ])

      .then(([auditRes, fraudRes]) => {

        setAudit(auditRes.data.data);

        setFraud(fraudRes.data.data);
      });

  }, []);

  return (

    <div>

      <PageHeader
        eyebrow="Security"
        title="Audit & Threat Center"
      />

      <div className="grid gap-6 xl:grid-cols-2">

        {/* =======================================================
            AUDIT LOGS
        ======================================================= */}

        <Card
          className="
          overflow-hidden

          border-white/10

          bg-[#081120]/80

          backdrop-blur-2xl
        "
        >

          {/* HEADER */}

          <div
            className="
            relative

            flex
            items-center
            justify-between

            border-b
            border-white/10

            px-5
            py-4
          "
          >

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,.08),transparent)]" />

            <div className="relative z-10 flex items-center gap-3">

              <div
                className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-2xl

                border
                border-cyan-400/20

                bg-cyan-400/[0.08]

                text-cyan-200
              "
              >
                <Activity size={20} />
              </div>

              <div>

                <div className="text-lg font-black text-white">
                  Audit Activity
                </div>

                <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                  Admin + API Logs
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}

          <div className="divide-y divide-white/5">

            {audit.map((log) => (

              <div
                key={log.id}

                className="
                group

                relative

                overflow-hidden

                px-5
                py-4

                transition-all
                duration-300

                hover:bg-white/[0.03]
              "
              >

                <div className="absolute inset-y-0 left-0 w-[2px] bg-cyan-400/0 transition-all duration-300 group-hover:bg-cyan-400/80" />

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <Badge tone="blue">
                        {log.resource}
                      </Badge>

                      {log.resourceId && (

                        <div className="text-xs text-slate-500">
                          #{log.resourceId}
                        </div>
                      )}
                    </div>

                    <div
                      className="
                      mt-3

                      text-base
                      font-black

                      text-white
                    "
                    >
                      {log.action}
                    </div>

                    <div
                      className="
                      mt-1

                      text-sm
                      text-slate-400
                    "
                    >
                      {log.actor?.username ??
                        "System"}

                      {" • "}

                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* =======================================================
            FRAUD LOGS
        ======================================================= */}

        <Card
          className="
          overflow-hidden

          border-white/10

          bg-[#081120]/80

          backdrop-blur-2xl
        "
        >

          {/* HEADER */}

          <div
            className="
            relative

            flex
            items-center
            justify-between

            border-b
            border-white/10

            px-5
            py-4
          "
          >

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,63,94,.08),transparent)]" />

            <div className="relative z-10 flex items-center gap-3">

              <div
                className="
                flex
                h-11
                w-11
                items-center
                justify-center

                rounded-2xl

                border
                border-rose-400/20

                bg-rose-500/[0.08]

                text-rose-200
              "
              >
                <ShieldAlert size={20} />
              </div>

              <div>

                <div className="text-lg font-black text-white">
                  Fraud Signals
                </div>

                <div className="text-xs uppercase tracking-[0.22em] text-rose-200">
                  Threat Detection
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}

          <div className="divide-y divide-white/5">

            {fraud.map((log) => (

              <div
                key={log.id}

                className="
                group

                relative

                overflow-hidden

                px-5
                py-4

                transition-all
                duration-300

                hover:bg-white/[0.03]
              "
              >

                <div
                  className="
                  absolute
                  inset-y-0
                  left-0

                  w-[2px]

                  bg-rose-400/0

                  transition-all
                  duration-300

                  group-hover:bg-rose-400
                "
                />

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0 flex-1">

                    <div className="flex items-center gap-2">

                      <Badge
                        tone={
                          log.severity ===
                          "CRITICAL"
                            ? "pink"
                            : "amber"
                        }
                      >
                        {log.severity}
                      </Badge>

                      <AlertTriangle
                        size={14}
                        className="text-rose-300"
                      />
                    </div>

                    <div
                      className="
                      mt-3

                      text-base
                      font-black

                      leading-7

                      text-white
                    "
                    >
                      {log.reason}
                    </div>

                    <div
                      className="
                      mt-1

                      text-sm
                      text-slate-400
                    "
                    >
                      {log.user?.username ??
                        "Unknown User"}

                      {" • "}

                      {new Date(
                        log.createdAt
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}