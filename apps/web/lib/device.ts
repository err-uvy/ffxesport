"use client";

export function getDeviceFingerprint() {
  const key = "ffx_device_fingerprint";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  localStorage.setItem(key, value);
  return value;
}
