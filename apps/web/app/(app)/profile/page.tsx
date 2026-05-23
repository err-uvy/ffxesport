"use client";

import { useEffect, useState } from "react";

import {
  BadgeCheck,
  Camera,
  Crosshair,
  Gamepad2,
  ShieldCheck,
  Trophy,
  User2
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input,
  Textarea
} from "@/ui";

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

      toast.success(
        "Profile updated successfully"
      );

      loadProfile();

    } catch (error) {

      toast.error(apiMessage(error));
    }
  }

  async function uploadAvatar(
    event: any
  ) {

    const file =
      event.target.files?.[0];

    if (!file) return;

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

      toast.success(
        "Avatar updated"
      );

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

      toast.success(
        "Gaming profile linked"
      );

      setUid("");
      setHandle("");

      loadProfile();

    } catch (error) {

      toast.error(apiMessage(error));
    }
  }

  return (
    <div className="main-container">

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
          Identity Center
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-white">
          Player Profile
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Manage your esports identity,
          linked game accounts,
          tournament stats,
          and verification status.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">

        {/* LEFT PANEL */}

        <Card
          className="
            premium-card
            border
            border-white/5
            bg-[#101010]
            p-6
          "
        >

          {/* TOP */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="relative">

              <div
                className="
                  h-28
                  w-28
                  rounded-3xl
                  border
                  border-blue-500/20
                  bg-cover
                  bg-center
                  shadow-[0_0_40px_rgba(37,99,235,0.25)]
                "
                style={{
                  backgroundImage: `url(${
                    profile?.user.avatarUrl ??
                    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80"
                  })`
                }}
              />

              <label
                className="
                  absolute
                  -bottom-2
                  -right-2
                  flex
                  h-10
                  w-10
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-blue-500/20
                  bg-blue-600
                  text-white
                  transition-all
                  duration-200
                  hover:bg-blue-700
                "
              >
                <Camera size={18} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadAvatar}
                />
              </label>
            </div>

            <div className="flex-1">

              <div className="flex items-center gap-2">

                <h2 className="text-2xl font-bold text-white">
                  {profile?.user.username}
                </h2>

                <ShieldCheck
                  className="text-blue-400"
                  size={22}
                />
              </div>

              <p className="mt-1 text-zinc-400">
                {profile?.user.email}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                <div
                  className="
                    rounded-full
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-blue-400
                  "
                >
                  Pro Player
                </div>

                <div
                  className="
                    rounded-full
                    border
                    border-white/10
                    bg-[#181818]
                    px-4
                    py-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-zinc-400
                  "
                >
                  FFX Member
                </div>
              </div>
            </div>
          </div>

          {/* STATS */}

          <div className="mt-8 grid grid-cols-3 gap-4">

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

          {/* BIO */}

          <div className="mt-8">

            <div className="mb-3 flex items-center gap-2">

              <User2
                size={18}
                className="text-blue-400"
              />

              <h3 className="text-lg font-bold text-white">
                Player Bio
              </h3>
            </div>

            <Textarea
              value={bio}
              onChange={(event: any) =>
                setBio(event.target.value)
              }
              placeholder="Tell the esports community about yourself..."
              className="
                min-h-[140px]
                border-white/10
                bg-[#181818]
                text-white
              "
            />

            <Button
              className="
                mt-4
                h-12
                w-full
                rounded-2xl
                bg-blue-600
                font-semibold
                hover:bg-blue-700
              "
              onClick={saveBio}
            >
              Save Profile
            </Button>
          </div>
        </Card>

        {/* RIGHT PANEL */}

        <Card
          className="
            premium-card
            border
            border-white/5
            bg-[#101010]
            p-6
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-blue-500/10
                text-blue-400
              "
            >
              <Gamepad2 size={22} />
            </div>

            <div>

              <h2 className="text-2xl font-bold text-white">
                Gaming Profiles
              </h2>

              <p className="text-sm text-zinc-400">
                Link your in-game identities
              </p>
            </div>
          </div>

          {/* FORM */}

          <div className="mt-8 grid gap-4 md:grid-cols-3">

            <select
              className="
                h-12
                rounded-2xl
                border
                border-white/10
                bg-[#181818]
                px-4
                text-sm
                text-white
                outline-none
              "
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
              className="
                h-12
                border-white/10
                bg-[#181818]
              "
            />

            <Input
              placeholder="Player Handle"
              value={handle}
              onChange={(event: any) =>
                setHandle(event.target.value)
              }
              className="
                h-12
                border-white/10
                bg-[#181818]
              "
            />
          </div>

          <Button
            className="
              mt-4
              h-12
              rounded-2xl
              bg-blue-600
              px-6
              font-semibold
              hover:bg-blue-700
            "
            onClick={addGameProfile}
          >
            Link Gaming Profile
          </Button>

          {/* LINKED PROFILES */}

          <div className="mt-8 space-y-4">

            {profile?.user.gameProfiles.map(
              (entry) => (

                <div
                  key={entry.id}
                  className="
                    rounded-3xl
                    border
                    border-white/5
                    bg-[#181818]
                    p-4
                    transition-all
                    duration-200
                    hover:border-blue-500/20
                  "
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <div className="flex items-center gap-2">

                        <h3 className="text-lg font-bold text-white">
                          {entry.game.replace(
                            "_",
                            " "
                          )}
                        </h3>

                        {entry.verified && (
                          <ShieldCheck
                            size={18}
                            className="text-blue-400"
                          />
                        )}
                      </div>

                      <p className="mt-1 text-sm text-zinc-400">
                        UID: {entry.uid}
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        Handle: {entry.handle ?? "-"}
                      </p>

                      <p className="mt-1 text-sm text-zinc-400">
                        KD Ratio: {entry.kdRatio}
                      </p>
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
                </div>
              )
            )}
          </div>

          {!!profile?.achievements.length && (

            <div className="mt-10">

              <h3 className="mb-4 text-lg font-bold text-white">
                Achievements
              </h3>

              <div className="flex flex-wrap gap-3">

                {profile.achievements.map(
                  (achievement) => (

                    <div
                      key={achievement}
                      className="
                        rounded-2xl
                        border
                        border-blue-500/20
                        bg-blue-500/10
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-blue-300
                      "
                    >
                      {achievement}
                    </div>
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
    <div
      className="
        rounded-3xl
        border
        border-white/5
        bg-[#181818]
        p-4
        text-center
      "
    >

      <div
        className="
          mx-auto
          mb-4
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-blue-500/10
          text-blue-400
        "
      >
        <Icon size={22} />
      </div>

      <div className="text-2xl font-bold text-white">
        {value}
      </div>

      <div
        className="
          mt-1
          text-xs
          font-semibold
          uppercase
          tracking-[0.25em]
          text-zinc-500
        "
      >
        {label}
      </div>
    </div>
  );
}