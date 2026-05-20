import type { LucideIcon } from "lucide-react";
import { Card } from "@ffx/ui";

export function MetricCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-400">{label}</div>
          <div className="mt-2 text-3xl font-black">{value}</div>
        </div>
        <div className="rounded-lg border border-blue-300/20 bg-blue-300/10 p-3 text-blue-100">
          <Icon size={22} />
        </div>
      </div>
    </Card>
  );
}
