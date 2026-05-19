import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button, Card } from "@ffx/ui";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070B14] admin-grid px-4">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-pink-400/20 bg-pink-500/10 text-pink-100">
          <ShieldX size={28} />
        </div>
        <h1 className="text-3xl font-black">403 Unauthorized</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Admin privileges are required for this surface.</p>
        <Button className="mt-6" variant="secondary">
          <Link href="/login">Back to login</Link>
        </Button>
      </Card>
    </main>
  );
}
