import type { LucideIcon } from "lucide-react";
import { Card } from "@ffx/ui";

export function EmptyState({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <Card className="flex min-h-48 flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-3 text-cyan-100">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-black text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{body}</p>
    </Card>
  );
}
