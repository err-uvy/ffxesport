"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Input } from "@ffx/ui";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

type UserRow = {
  id: string;
  username: string;
  email: string;
  status: string;
  roles: { role: { name: string } }[];
  wallet?: { balance: string; winningBalance: string };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    api.get(`/admin/users?search=${encodeURIComponent(search)}`).then((response) => setUsers(response.data.data));
  }

  async function updateStatus(id: string, status: string) {
    try {
      await api.patch(`/admin/users/${id}/status`, { status });
      toast.success("Status updated");
      loadUsers();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  async function grantRole(id: string, role: string) {
    try {
      await api.post(`/admin/users/${id}/roles`, { role, grant: true });
      toast.success("Role granted");
      loadUsers();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="RBAC" title="Users">
        <div className="flex gap-2">
          <Input placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Button onClick={loadUsers}>Search</Button>
        </div>
      </PageHeader>
      <Card className="overflow-hidden">
        <div className="divide-y divide-white/10">
          {users.map((user) => (
            <div key={user.id} className="grid gap-4 p-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
              <div>
                <div className="font-black">{user.username}</div>
                <div className="text-sm text-slate-400">{user.email}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.roles.map((entry) => (
                    <Badge key={entry.role.name} tone={entry.role.name === "USER" ? "blue" : "pink"}>{entry.role.name}</Badge>
                  ))}
                </div>
              </div>
              <select className="h-11 rounded-lg border border-white/10 bg-[#020817] px-3 text-sm" value={user.status} onChange={(event) => updateStatus(user.id, event.target.value)}>
                {["ACTIVE", "PENDING_VERIFICATION", "SUSPENDED", "BANNED"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <select className="h-11 rounded-lg border border-white/10 bg-[#020817] px-3 text-sm" onChange={(event) => event.target.value && grantRole(user.id, event.target.value)} defaultValue="">
                <option value="">Grant role</option>
                {["ADMIN", "MODERATOR", "SUPPORT", "USER"].map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
