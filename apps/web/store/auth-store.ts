"use client";

import { create } from "zustand";
import type { SafeUser } from "@/types";
import { api } from "@/lib/api";
import { getDeviceFingerprint } from "@/lib/device";

type AuthState = {
  user: SafeUser | null;
  loading: boolean;
  loaded: boolean;
  loadMe: () => Promise<SafeUser | null>;
  login: (email: string, password: string, rememberMe: boolean) => Promise<SafeUser>;
  register: (input: { email: string; username: string; password: string; phone?: string; referrerCode?: string }) => Promise<SafeUser>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  loaded: false,
  async loadMe() {
    if (get().loading) return get().user;
    set({ loading: true });
    try {
      const response = await api.get("/auth/me");
      const user = response.data.data as SafeUser;
      set({ user, loading: false, loaded: true });
      return user;
    } catch {
      set({ user: null, loading: false, loaded: true });
      return null;
    }
  },
  async login(email, password, rememberMe) {
    const response = await api.post("/auth/login", {
      email,
      password,
      rememberMe,
      deviceFingerprint: getDeviceFingerprint()
    });
    const user = response.data.data as SafeUser;
    set({ user, loaded: true });
    return user;
  },
  async register(input) {
    const response = await api.post("/auth/register", {
      ...input,
      deviceFingerprint: getDeviceFingerprint()
    });
    const user = response.data.data as SafeUser;
    set({ user, loaded: true });
    return user;
  },
  async logout() {
    await api.post("/auth/logout");
    set({ user: null, loaded: true });
  }
}));
