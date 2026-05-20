"use client";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Camera,
  Crosshair,
  Trophy
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input,
  Textarea
} from "@ffx/ui";

import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

type Profile = {
  user: {
    username: string;
    email: string;
    avatarUrl?: string;
    bio?: string;

    gameProfiles: {
      id: string;
      game: string;
      uid: string;
      handle?: string;
      kdRatio: string;
      verified: boolean;
    }[];
  };

  stats: {
    tournamentsPlayed: number;
    wins: number;
    kills: number;
    kdRatio: string;
  };

  achievements: string[];
};

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [bio, setBio] = useState("");

  const [game, setGame] =
    useState("FREE_FIRE");

  const [uid, setUid] = useState("");

  const [handle, setHandle] =
    useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  function loadProfile() {
    api.get("/profile").then((response) => {
      setProfile(response.data.data);

      setBio(
        response.data.data.user.bio ?? ""
      );
    });
  }

  async function saveBio() {
    try {
      await api.patch("/profile", {
        bio
      });

      toast.success("Profile updated");

      loadProfile();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  async function uploadAvatar(event: any) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const body = new FormData();

    body.append("avatar", file);

    try {
      await api.post(
        "/profile/avatar",
        body,
        {
          headers: {
            "content-type":
              "multipart/form-data"
          }
        }
      );

      toast.success("Avatar updated");

      loadProfile();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  async function addGameProfile() {
    try {
      await api.post(
        "/profile/game-profiles",
        {
          game,
          uid,
          handle
        }
      );

      toast.success("Gaming UID linked");

      setUid("");
      setHandle("");

      loadProfile();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Identity"
        title="Profile"
      />

      <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <div
              className="h-20 w-20 rounded-xl bg-cover bg-center shadow-neon"
              style={{
                backgroundImage: `url(${profile?.user.avatarUrl ?? "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80"})`
              }}
            />

            <div>
              <h2 className="text-2xl font-black">
                {profile?.user.username}
              </h2>

              <p className="text-sm text-slate-400">
                {profile?.user.email}
              </p>

              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-300/25 px-3 py-2 text-sm font-bold text-blue-100">
                <Camera size={16} />

                Avatar

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadAvatar}
                />
              </label>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat
              icon={Trophy}
              value={String(
                profile?.stats.wins ?? 0
              )}
              label="Wins"
            />

            <Stat
              icon={Crosshair}
              value={String(
                profile?.stats.kills ?? 0
              )}
              label="Kills"
            />

            <Stat
              icon={BadgeCheck}
              value={
                profile?.stats.kdRatio ??
                "0.00"
              }
              label="KD"
            />
          </div>

          <Textarea
            className="mt-5"
            value={bio}
            onChange={(event: any) =>
              setBio(event.target.value)
            }
            placeholder="Bio"
          />

          <Button
            className="mt-3 w-full"
            onClick={saveBio}
          >
            Save profile
          </Button>
        </Card>

        <Card className="p-5">
          <h2 className="text-xl font-black">
            Gaming Profiles
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <select
              className="h-11 rounded-lg border border-white/10 bg-[#020817] px-3 text-sm"
              value={game}
              onChange={(event: any) =>
                setGame(event.target.value)
              }
            >
              <option value="FREE_FIRE">
                Free Fire
              </option>

              <option value="BGMI">
                BGMI
              </option>

              <option value="COD_MOBILE">
                COD Mobile
              </option>
            </select>

            <Input
              placeholder="Gaming UID"
              value={uid}
              onChange={(event: any) =>
                setUid(event.target.value)
              }
            />

            <Input
              placeholder="Handle"
              value={handle}
              onChange={(event: any) =>
                setHandle(event.target.value)
              }
            />
          </div>

          <Button
            className="mt-3"
            onClick={addGameProfile}
          >
            Link UID
          </Button>

          <div className="mt-6 space-y-3">
            {profile?.user.gameProfiles.map(
              (entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-black text-white">
                        {entry.game.replace(
                          "_",
                          " "
                        )}
                      </div>

                      <div className="mt-1 text-sm text-slate-400">
                        UID: {entry.uid}
                      </div>
                    </div>

                    <Badge
                      tone={
                        entry.verified
                          ? "green"
                          : "blue"
                      }
                    >
                      {entry.verified
                        ? "Verified"
                        : "Pending"}
                    </Badge>
                  </div>

                  <div className="mt-3 text-sm text-slate-300">
                    Handle: {entry.handle ?? "-"}
                  </div>

                  <div className="mt-1 text-sm text-slate-300">
                    KD Ratio: {entry.kdRatio}
                  </div>
                </div>
              )
            )}
          </div>

          {!!profile?.achievements.length && (
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-black">
                Achievements
              </h3>

              <div className="flex flex-wrap gap-2">
                {profile.achievements.map(
                  (achievement) => (
                    <Badge
                      key={achievement}
                      tone="blue"
                    >
                      {achievement}
                    </Badge>
                  )
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label
}: {
  icon: any;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
      <Icon className="mx-auto mb-2" size={18} />

      <div className="text-xl font-black text-white">
        {value}
      </div>

      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
        {label}
      </div>
    </div>
  );
}