import { Game, PrismaClient, RoleName } from "@prisma/client";
import { buildTournamentCode, calculatePrizeDistribution, slugify } from "@ffx/utils";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

const permissions = [
  "users:read",
  "users:write",
  "tournaments:read",
  "tournaments:write",
  "matches:moderate",
  "wallet:write",
  "support:write",
  "analytics:read",
  "admins:write"
];

const rolePermissionMap: Record<RoleName, string[]> = {
  SUPER_ADMIN: permissions,
  ADMIN: ["users:read", "users:write", "tournaments:read", "tournaments:write", "matches:moderate", "wallet:write", "analytics:read"],
  MODERATOR: ["tournaments:read", "matches:moderate", "users:read"],
  SUPPORT: ["support:write", "users:read"],
  USER: []
};

async function main() {
  const permissionRows = await Promise.all(
    permissions.map((key) => {
      const [resource = key, action = "read"] = key.split(":");
      return prisma.permission.upsert({
        where: { key },
        create: { key, resource, action },
        update: { resource, action }
      });
    })
  );

  for (const roleName of Object.keys(rolePermissionMap) as RoleName[]) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      create: { name: roleName, description: `${roleName.replace("_", " ")} access` },
      update: {}
    });
    for (const key of rolePermissionMap[roleName]) {
      const permission = permissionRows.find((row) => row.key === key)!;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        create: { roleId: role.id, permissionId: permission.id },
        update: {}
      });
    }
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: "SUPER_ADMIN" } });
  const userRole = await prisma.role.findUniqueOrThrow({ where: { name: "USER" } });

  const admin = await prisma.user.upsert({
    where: { email: "superadmin@ffxesports.com" },
    create: {
      email: "superadmin@ffxesports.com",
      username: "ffxsuperadmin",
      passwordHash: await hashPassword("Admin@12345"),
      status: "ACTIVE",
      emailVerified: true,
      referralCode: "FFXADMIN",
      wallet: { create: { balance: 10000, winningBalance: 25000 } },
      roles: { create: { roleId: superAdminRole.id } }
    },
    update: {}
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: superAdminRole.id } },
    create: { userId: admin.id, roleId: superAdminRole.id },
    update: {}
  });

  const player = await prisma.user.upsert({
    where: { email: "player@ffxesports.com" },
    create: {
      email: "player@ffxesports.com",
      username: "neonstriker",
      passwordHash: await hashPassword("Player@12345"),
      status: "ACTIVE",
      emailVerified: true,
      referralCode: "NEON25",
      avatarUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=300&q=80",
      wallet: { create: { balance: 1500, bonusBalance: 250, winningBalance: 800 } },
      roles: { create: { roleId: userRole.id } },
      gameProfiles: {
        create: {
          game: "FREE_FIRE",
          uid: "FFX123456",
          handle: "NeonStriker",
          kdRatio: 3.4,
          earnings: 800,
          verified: true
        }
      }
    },
    update: {}
  });

  const now = Date.now();
  const tournaments = [
    {
      title: "FFX Neon Clash Free Fire",
      game: "FREE_FIRE" as Game,
      mode: "SQUAD" as const,
      entryFee: 50,
      prizePool: 5000,
      maxSlots: 48,
      minTeamSize: 4,
      maxTeamSize: 4,
      mapName: "Bermuda Remastered"
    },
    {
      title: "BGMI Midnight Royale",
      game: "BGMI" as Game,
      mode: "BATTLE_ROYALE" as const,
      entryFee: 100,
      prizePool: 10000,
      maxSlots: 64,
      minTeamSize: 4,
      maxTeamSize: 4,
      mapName: "Erangel"
    },
    {
      title: "Valorant Swift Spike Cup",
      game: "VALORANT" as Game,
      mode: "SQUAD" as const,
      entryFee: 0,
      prizePool: 3000,
      maxSlots: 16,
      minTeamSize: 5,
      maxTeamSize: 5,
      mapName: "Ascent"
    }
  ];

  for (const item of tournaments) {
    const startsAt = new Date(now + 48 * 60 * 60 * 1000);
    const slug = slugify(item.title);
    const existing = await prisma.tournament.findUnique({ where: { slug } });
    if (existing) continue;
    await prisma.tournament.create({
      data: {
        title: item.title,
        slug,
        code: buildTournamentCode(),
        game: item.game,
        mode: item.mode,
        description: `${item.title} is a competitive FFX ESPORTS tournament with verified slots, locked rooms, and automated prize distribution.`,
        rules: "Check in before the match, join the room on time, submit result screenshots, and follow fair-play rules.",
        entryFee: item.entryFee,
        prizePool: item.prizePool,
        maxSlots: item.maxSlots,
        minTeamSize: item.minTeamSize,
        maxTeamSize: item.maxTeamSize,
        status: "REGISTRATION_OPEN",
        registrationStartsAt: new Date(now - 60 * 60 * 1000),
        registrationEndsAt: new Date(now + 36 * 60 * 60 * 1000),
        startsAt,
        roomReleaseAt: new Date(startsAt.getTime() - 10 * 60 * 1000),
        createdById: admin.id,
        prizeDistributions: {
          create: calculatePrizeDistribution(item.prizePool, 3).map((entry) => ({
            rank: entry.rank,
            amount: entry.amount
          }))
        },
        matches: {
          create: {
            mapName: item.mapName,
            startsAt,
            roomUnlockAt: new Date(startsAt.getTime() - 10 * 60 * 1000),
            status: "ROOM_LOCKED",
            instructions: "Room details unlock 10 minutes before start. Upload screenshots for result verification."
          }
        }
      }
    });
  }

  await prisma.coupon.upsert({
    where: { code: "FFXLAUNCH" },
    create: {
      code: "FFXLAUNCH",
      discountType: "PERCENTAGE",
      discountValue: 20,
      maxUses: 500,
      expiresAt: new Date(now + 30 * 24 * 60 * 60 * 1000)
    },
    update: {}
  });

  console.log("Seed complete");
  console.log("Admin: superadmin@ffxesports.com / Admin@12345");
  console.log("Player: player@ffxesports.com / Player@12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
