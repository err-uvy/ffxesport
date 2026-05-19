import type { LucideIcon } from "lucide-react";
import { Card } from "@ffx/ui";

export function MetricCard({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-400">{label}</div>
          <div className="mt-2 text-3xl font-black text-white">{value}</div>
          <div className="mt-2 text-xs text-cyan-100">{detail}</div>
        </div>
        <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}
