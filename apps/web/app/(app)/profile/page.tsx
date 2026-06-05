"use client";

import {
  useEffect,
  useState
} from "react";

import {
  BadgeCheck,
  Camera,
  Crosshair,
  Gamepad2,
  ShieldCheck,
  Trophy,
  User2,
  Sparkles,
  Swords,
  Activity
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input,
  Textarea
} from "@/ui";

import {
  PageHeader
} from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

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

  const [
    profile,
    setProfile
  ] = useState<
    Profile | null
  >(null);

  const [bio, setBio] =
    useState("");

  const [game, setGame] =
    useState("FREE_FIRE");

  const [uid, setUid] =
    useState("");

  const [
    handle,
    setHandle
  ] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  function loadProfile() {

    api
      .get("/profile")
      .then((response) => {

        setProfile(
          response.data.data
        );

        setBio(
          response.data.data
            .user.bio ?? ""
        );
      });
  }

  async function saveBio() {

    try {

      await api.patch(
        "/profile",
        {
          bio
        }
      );

      toast.success(
        "Profile updated successfully"
      );

      loadProfile();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  async function uploadAvatar(
    event: any
  ) {

    const file =
      event.target.files?.[0];

    if (!file) return;

    const body =
      new FormData();

    body.append(
      "avatar",
      file
    );

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

      toast.error(
        apiMessage(error)
      );
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

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}

      <PageHeader
        eyebrow="Identity Center"
        title="Player Profile"
      >

        <div
          className="
            rounded-2xl
            border
            border-border
            bg-card
            px-5
            py-3
          "
        >

          <div
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              text-muted
            "
          >
            Status
          </div>

          <div
            className="
              mt-1
              flex
              items-center
              gap-2
              text-lg
              font-bold
              text-white
            "
          >

            <ShieldCheck
              size={18}
              className="
                text-primary
              "
            />

            Verified
          </div>
        </div>
      </PageHeader>

      {/* HERO */}

      <section
        className="
          rounded-[32px]
          border
          border-border
          bg-card
          p-6
          lg:p-8
        "
      >

        <div
          className="
            grid
            gap-8
            xl:grid-cols-[340px_1fr]
          "
        >

          {/* LEFT */}

          <div>

            {/* AVATAR */}

            <div className="relative w-fit">

              <div
                className="
                  h-32
                  w-32
                  rounded-[28px]
                  border
                  border-border
                  bg-cover
                  bg-center
                "
                style={{
                  backgroundImage: `url(${
                    profile?.user
                      .avatarUrl ??
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
                  h-11
                  w-11
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-border
                  bg-background-secondary
                  text-white
                  transition-all
                  hover:bg-card
                "
              >

                <Camera
                  size={18}
                />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={
                    uploadAvatar
                  }
                />
              </label>
            </div>

            {/* USER */}

            <div className="mt-6">

              <div className="flex items-center gap-2">

                <h2
                  className="
                    text-3xl
                    font-bold
                    text-white
                  "
                >
                  {
                    profile?.user
                      .username
                  }
                </h2>

                <ShieldCheck
                  size={20}
                  className="
                    text-primary
                  "
                />
              </div>

              <p
                className="
                  mt-2
                  text-muted
                "
              >
                {
                  profile?.user
                    .email
                }
              </p>

              <div className="mt-5 flex flex-wrap gap-2">

                <Badge tone="blue">
                  Pro Player
                </Badge>

                <Badge tone="green">
                  Verified
                </Badge>
              </div>
            </div>

            {/* STATS */}

            <div className="mt-8 grid grid-cols-2 gap-4">

              <StatCard
                icon={Trophy}
                value={String(
                  profile?.stats
                    .wins ?? 0
                )}
                label="Wins"
              />

              <StatCard
                icon={Crosshair}
                value={String(
                  profile?.stats
                    .kills ?? 0
                )}
                label="Kills"
              />

              <StatCard
                icon={Activity}
                value={
                  profile?.stats
                    .kdRatio ??
                  "0.00"
                }
                label="KD Ratio"
              />

              <StatCard
                icon={Swords}
                value={String(
                  profile?.stats
                    .tournamentsPlayed ??
                    0
                )}
                label="Matches"
              />
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* BIO */}

            <Card
              className="
                rounded-[28px]
                border
                border-border
                bg-background-secondary
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
                    bg-primary/10
                    text-primary
                  "
                >

                  <User2
                    size={22}
                  />
                </div>

                <div>

                  <h3
                    className="
                      text-2xl
                      font-bold
                      text-white
                    "
                  >
                    Player Bio
                  </h3>

                  <p
                    className="
                      text-sm
                      text-muted
                    "
                  >
                    Public esports identity
                  </p>
                </div>
              </div>

              <Textarea
                value={bio}
                onChange={(
                  event: any
                ) =>
                  setBio(
                    event.target
                      .value
                  )
                }
                placeholder="Tell the esports community about yourself..."
                className="
                  mt-5
                  min-h-[160px]
                  border-border
                  bg-card
                  text-white
                "
              />

              <Button
                className="
                  mt-5
                  h-12
                  rounded-2xl
                  bg-primary
                  px-6
                  font-semibold
                "
                onClick={saveBio}
              >
                Save Profile
              </Button>
            </Card>

            {/* GAME PROFILE */}

            <Card
              className="
                rounded-[28px]
                border
                border-border
                bg-background-secondary
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
                    bg-primary/10
                    text-primary
                  "
                >

                  <Gamepad2
                    size={22}
                  />
                </div>

                <div>

                  <h3
                    className="
                      text-2xl
                      font-bold
                      text-white
                    "
                  >
                    Gaming Profiles
                  </h3>

                  <p
                    className="
                      text-sm
                      text-muted
                    "
                  >
                    Link your gaming IDs
                  </p>
                </div>
              </div>

              {/* FORM */}

              <div
                className="
                  mt-6
                  grid
                  gap-4
                  lg:grid-cols-3
                "
              >

                <select
                  className="
                    h-12
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    px-4
                    text-sm
                    text-white
                    outline-none
                  "
                  value={game}
                  onChange={(
                    event: any
                  ) =>
                    setGame(
                      event.target
                        .value
                    )
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
                  onChange={(
                    event: any
                  ) =>
                    setUid(
                      event.target
                        .value
                    )
                  }
                  className="
                    h-12
                    border-border
                    bg-card
                  "
                />

                <Input
                  placeholder="Player Handle"
                  value={handle}
                  onChange={(
                    event: any
                  ) =>
                    setHandle(
                      event.target
                        .value
                    )
                  }
                  className="
                    h-12
                    border-border
                    bg-card
                  "
                />
              </div>

              <Button
                className="
                  mt-5
                  h-12
                  rounded-2xl
                  bg-primary
                  px-6
                  font-semibold
                "
                onClick={
                  addGameProfile
                }
              >
                Link Gaming Profile
              </Button>

              {/* LIST */}

              <div className="mt-8 space-y-4">

                {profile?.user.gameProfiles.map(
                  (entry) => (

                    <div
                      key={entry.id}
                      className="
                        rounded-3xl
                        border
                        border-border
                        bg-card
                        p-5
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-4
                          lg:flex-row
                          lg:items-center
                          lg:justify-between
                        "
                      >

                        <div>

                          <div className="flex items-center gap-2">

                            <h4
                              className="
                                text-lg
                                font-bold
                                text-white
                              "
                            >
                              {entry.game.replace(
                                "_",
                                " "
                              )}
                            </h4>

                            {entry.verified && (

                              <ShieldCheck
                                size={18}
                                className="
                                  text-primary
                                "
                              />
                            )}
                          </div>

                          <div
                            className="
                              mt-3
                              space-y-1
                              text-sm
                              text-muted
                            "
                          >

                            <p>
                              UID:
                              {" "}
                              {entry.uid}
                            </p>

                            <p>
                              Handle:
                              {" "}
                              {entry.handle ??
                                "-"}
                            </p>

                            <p>
                              KD Ratio:
                              {" "}
                              {entry.kdRatio}
                            </p>
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
                    </div>
                  )
                )}
              </div>
            </Card>

            {/* ACHIEVEMENTS */}

            {!!profile?.achievements
              .length && (

              <Card
                className="
                  rounded-[28px]
                  border
                  border-border
                  bg-background-secondary
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
                      bg-primary/10
                      text-primary
                    "
                  >

                    <Sparkles
                      size={20}
                    />
                  </div>

                  <div>

                    <h3
                      className="
                        text-2xl
                        font-bold
                        text-white
                      "
                    >
                      Achievements
                    </h3>

                    <p
                      className="
                        text-sm
                        text-muted
                      "
                    >
                      Competitive milestones
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">

                  {profile.achievements.map(
                    (
                      achievement
                    ) => (

                      <div
                        key={
                          achievement
                        }
                        className="
                          rounded-2xl
                          border
                          border-border
                          bg-card
                          px-5
                          py-3
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        {
                          achievement
                        }
                      </div>
                    )
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({
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
        border-border
        bg-background-secondary
        p-4
      "
    >

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-primary/10
          text-primary
        "
      >

        <Icon size={22} />
      </div>

      <div
        className="
          mt-4
          text-2xl
          font-bold
          text-white
        "
      >
        {value}
      </div>

      <div
        className="
          mt-1
          text-xs
          font-semibold
          uppercase
          tracking-[0.25em]
          text-muted
        "
      >
        {label}
      </div>
    </div>
  );
}

