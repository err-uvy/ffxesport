"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Search,
  Shield,
  UserCheck,
  UserX,
  Crown,
  Wallet
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input
} from "@/ui";

import {
  PageHeader
} from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

type UserRow = {
  id: string;

  username: string;

  email: string;

  status: string;

  roles: {
    role: {
      name: string;
    };
  }[];

  wallet?: {
    balance: string;

    winningBalance: string;
  };
};

export default function AdminUsersPage() {

  const [users, setUsers] =
    useState<UserRow[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {

    api
      .get(
        `/admin/users?search=${encodeURIComponent(
          search
        )}`
      )

      .then((response) =>
        setUsers(
          response.data.data
        )
      );
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    try {

      await api.patch(
        `/admin/users/${id}/status`,
        { status }
      );

      toast.success(
        "Status updated"
      );

      loadUsers();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  async function grantRole(
    id: string,
    role: string
  ) {
    try {

      await api.post(
        `/admin/users/${id}/roles`,
        {
          role,
          grant: true
        }
      );

      toast.success(
        "Role granted"
      );

      loadUsers();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (

    <div>

      {/* ================================ */}
      {/* HEADER */}
      {/* ================================ */}

      <PageHeader
        eyebrow="User Control"
        title="Players & Roles"
      >

        <div className="flex gap-3">

          <div className="relative">

            <Search
              size={16}

              className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2

              text-cyan-200
            "
            />

            <Input
              placeholder="Search players..."

              value={search}

              onChange={(event: any) =>
                setSearch(
                  event.target.value
                )
              }

              className="
              w-[260px]

              border-white/10

              bg-[#081120]/90

              pl-10

              backdrop-blur-xl
            "
            />
          </div>

          <Button
            onClick={loadUsers}
          >
            Search
          </Button>
        </div>
      </PageHeader>

      {/* ================================ */}
      {/* USERS LIST */}
      {/* ================================ */}

      <Card
        className="
        overflow-hidden

        border-white/10

        bg-[#081120]/90

        backdrop-blur-2xl
      "
      >

        <div className="divide-y divide-white/5">

          {users.map((user) => (

            <div
              key={user.id}

              className="
              group

              relative

              overflow-hidden

              p-4

              transition-all
              duration-300

              hover:bg-white/[0.02]
            "
            >

              {/* Glow */}

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.06),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,.05),transparent_30%)] opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_auto_auto] xl:items-center">

                {/* LEFT */}

                <div>

                  <div className="flex items-center gap-3">

                    <div
                      className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center

                      rounded-2xl

                      bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

                      font-black
                      text-white

                      shadow-[0_0_30px_rgba(0,229,255,.25)]
                    "
                    >
                      {user.username
                        ?.slice(0, 2)
                        .toUpperCase()}
                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <h2 className="text-lg font-black text-white">
                          {user.username}
                        </h2>

                        {user.roles.some(
                          (r) =>
                            r.role.name ===
                            "ADMIN"
                        ) && (

                          <Crown
                            size={18}

                            className="text-pink-300"
                          />
                        )}
                      </div>

                      <div className="text-sm text-slate-400">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* BADGES */}

                  <div className="mt-4 flex flex-wrap gap-2">

                    {user.roles.map(
                      (entry) => (

                        <Badge
                          key={
                            entry.role.name
                          }

                          tone={
                            entry.role
                              .name ===
                            "USER"
                              ? "blue"
                              : "pink"
                          }
                        >
                          {
                            entry.role.name
                          }
                        </Badge>
                      )
                    )}

                    <Badge
                      tone={
                        user.status ===
                        "ACTIVE"
                          ? "green"
                          : user.status ===
                            "BANNED"
                          ? "pink"
                          : "amber"
                      }
                    >
                      {user.status.replace(
                        "_",
                        " "
                      )}
                    </Badge>
                  </div>

                  {/* WALLET */}

                  <div className="mt-4 flex flex-wrap gap-4 text-sm">

                    <div
                      className="
                      flex
                      items-center
                      gap-2

                      rounded-xl

                      border
                      border-cyan-400/10

                      bg-cyan-400/[0.04]

                      px-4
                      py-2

                      text-cyan-100
                    "
                    >
                      <Wallet size={16} />

                      ₹
                      {Number(
                        user.wallet
                          ?.balance ?? 0
                      ) +
                        Number(
                          user.wallet
                            ?.winningBalance ??
                            0
                        )}
                    </div>

                    <div
                      className="
                      flex
                      items-center
                      gap-2

                      rounded-xl

                      border
                      border-pink-400/10

                      bg-pink-400/[0.04]

                      px-4
                      py-2

                      text-pink-100
                    "
                    >
                      <Shield size={16} />

                      {user.roles.length} Roles
                    </div>
                  </div>
                </div>

                {/* STATUS */}

                <div className="space-y-2">

                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Player Status
                  </div>

                  <select
                    className="
                    h-11
                    min-w-[220px]

                    rounded-2xl

                    border
                    border-white/10

                    bg-[#020817]/80

                    px-4

                    text-sm
                    text-white

                    outline-none

                    transition-all

                    hover:border-white/5
                  "

                    value={user.status}

                    onChange={(
                      event: any
                    ) =>
                      updateStatus(
                        user.id,
                        event.target.value
                      )
                    }
                  >

                    {[
                      "ACTIVE",

                      "PENDING_VERIFICATION",

                      "SUSPENDED",

                      "BANNED"
                    ].map((status) => (

                      <option
                        key={status}
                      >
                        {status.replace(
                          "_",
                          " "
                        )}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ROLE */}

                <div className="space-y-2">

                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    Grant Access
                  </div>

                  <select
                    className="
                    h-11
                    min-w-[220px]

                    rounded-2xl

                    border
                    border-white/10

                    bg-[#020817]/80

                    px-4

                    text-sm
                    text-white

                    outline-none

                    transition-all

                    hover:border-pink-400/20
                  "

                    onChange={(
                      event: any
                    ) =>
                      event.target
                        .value &&
                      grantRole(
                        user.id,
                        event.target.value
                      )
                    }

                    defaultValue=""
                  >

                    <option value="">
                      Grant role
                    </option>

                    {[
                      "ADMIN",

                      "MODERATOR",

                      "SUPPORT",

                      "USER"
                    ].map((role) => (

                      <option
                        key={role}
                      >
                        {role}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-2 pt-2">

                    <button
                      className="
                      flex
                      items-center
                      gap-2

                      rounded-xl

                      border
                      border-emerald-400/15

                      bg-emerald-500/[0.08]

                      px-4
                      py-2

                      text-xs
                      font-semibold
                      text-emerald-100

                      transition-all

                      hover:bg-emerald-500/[0.15]
                    "
                    >
                      <UserCheck
                        size={14}
                      />

                      Verified
                    </button>

                    <button
                      className="
                      flex
                      items-center
                      gap-2

                      rounded-xl

                      border
                      border-rose-400/15

                      bg-rose-500/[0.08]

                      px-4
                      py-2

                      text-xs
                      font-semibold
                      text-rose-100

                      transition-all

                      hover:bg-rose-500/[0.15]
                    "
                    >
                      <UserX
                        size={14}
                      />

                      Restrict
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}