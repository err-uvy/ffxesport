export type RoleName = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "SUPPORT" | "USER";

export type GameKey = "FREE_FIRE" | "BGMI" | "CODM" | "VALORANT" | "BATTLE_ROYALE";

export type TournamentMode = "SOLO" | "DUO" | "SQUAD" | "CLASH_SQUAD" | "BATTLE_ROYALE";

export type TournamentStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "REGISTRATION_OPEN"
  | "REGISTRATION_CLOSED"
  | "LIVE"
  | "COMPLETED"
  | "CANCELLED";

export type MatchStatus =
  | "SCHEDULED"
  | "ROOM_LOCKED"
  | "ROOM_RELEASED"
  | "LIVE"
  | "RESULT_PENDING"
  | "COMPLETED"
  | "CANCELLED";

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED" | "CANCELLED";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type Paginated<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type SafeUser = {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string | null;
  roles: RoleName[];
  emailVerified: boolean;
  gamingUid?: string | null;
};

export type WalletBalance = {
  balance: string;
  winningBalance: string;
  bonusBalance: string;
  lockedBalance: string;
};

export type SocketNotificationPayload = {
  id: string;
  title: string;
  body: string;
  type: string;
  createdAt: string;
};
