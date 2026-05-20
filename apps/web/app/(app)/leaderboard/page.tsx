"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { Button, Card, Badge } from "@ffx/ui";
import { formatMoney } from "@ffx/utils";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";

type Row = {
  id?: string;
  uid?: string;
  handle?: string;
  kdRatio?: string;
  earnings?: string;
  user?: { username?: string; avatarUrl?: string };
  team?: { name?: string };
  name?: string;
  tag?: string;
  score?: number;
  kills?: number;
  _sum?: { kills?: number; score?: number };
};

const views = ["global", "earnings", "kills", "clans"] as const;

export default function LeaderboardPage() {
  const [view, setView] = useState<(typeof views)[number]>("global");
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    api.get(`/leaderboard/${view}`).then((response) => setRows(response.data.data));
  }, [view]);

  return (
    <div>
      <PageHeader eyebrow="Rankings" title="Leaderboards">
        <div className="flex flex-wrap gap-2">
          {views.map((item) => (
            <Button key={item} variant={view === item ? "primary" : "secondary"} onClick={() => setView(item)}>
              {item}
            </Button>
          ))}
        </div>
      </PageHeader>
      <Card className="overflow-hidden">
        {rows.length ? (
          <div className="divide-y divide-white/10">
            {rows.map((row, index) => (
              <div key={row.id ?? row.uid ?? `${view}-${index}`} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-300/10 font-black text-blue-100">
                  {index + 1}
                </div>
                <div>
                  <div className="font-black">{row.user?.username ?? row.name ?? row.handle ?? "Player"}</div>
                  <div className="text-sm text-slate-400">{row.tag ?? row.uid ?? `Score ${row.score ?? row._sum?.score ?? 0}`}</div>
                </div>
                <Badge tone={index === 0 ? "pink" : "blue"}>
                  {row.earnings ? formatMoney(row.earnings) : `${row.kills ?? row._sum?.kills ?? row.score ?? 0} pts`}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Crown} title="Leaderboard empty" body="Verified results will appear here once matches are completed." />
        )}
      </Card>
    </div>
  );
}
