"use client";

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig
} from "axios";

import { getDeviceFingerprint } from "./device";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is missing"
  );
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

let csrfToken: string | null = null;
let refreshing: Promise<void> | null = null;

api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ) => {

    config.headers.set(
      "x-device-fingerprint",
      getDeviceFingerprint()
    );

    if (config.data instanceof FormData) {
      config.headers.delete(
        "Content-Type"
      );
    }

    const method =
      config.method?.toUpperCase() ?? "GET";

    if (
      !["GET", "HEAD", "OPTIONS"].includes(
        method
      )
    ) {

      csrfToken ??=
        await getCsrfToken();

      if (csrfToken) {

        config.headers.set(
          "x-csrf-token",
          csrfToken
        );
      }
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {

    const config =
      error.config as
        | (InternalAxiosRequestConfig & {
            _retry?: boolean;
          })
        | undefined;

    if (
      error.response?.status === 401 &&
      config &&
      !config._retry &&
      !config.url?.includes(
        "/auth/refresh"
      )
    ) {

      config._retry = true;

      refreshing ??=
        api
          .post("/auth/refresh")
          .then(() => undefined)
          .finally(() => {
            refreshing = null;
          });

      await refreshing;

      return api.request(config);
    }

    return Promise.reject(error);
  }
);

async function getCsrfToken() {

  const response =
    await axios.get(
      `${baseURL}/auth/csrf`,
      {
        withCredentials: true
      }
    );

  return (
    response.data?.data?.csrfToken ??
    null
  ) as string | null;
}

export function apiMessage(
  error: unknown
) {

  if (axios.isAxiosError(error)) {

    return (
      (error.response?.data as {
        message?: string;
      })?.message ??
      error.message
    );
  }

  return error instanceof Error
    ? error.message
    : "Something went wrong";
}