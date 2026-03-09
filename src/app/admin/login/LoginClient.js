"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@/lib/i18n";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError(t("authErrors.invalidEmail"));
      return;
    }
    if (!password.trim()) {
      setError(t("authErrors.passwordRequired"));
      return;
    }

    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    const json = await response.json();
    setLoading(false);
    if (!response.ok || !json?.ok) {
      setError(json?.error || t("authErrors.loginFailed"));
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">{t("adminLogin.title")}</h1>
      <p className="text-gray-600 mb-8">{t("adminLogin.subtitle")}</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("adminLogin.emailPlaceholder")}
          className="w-full border rounded px-3 py-2"
          autoComplete="email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={t("adminLogin.passwordPlaceholder")}
          className="w-full border rounded px-3 py-2"
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          className="w-full bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? t("auth.signingIn") : t("common.signIn")}
        </button>
      </form>
      {error ? <p className="mt-4 text-red-600">{error}</p> : null}
    </section>
  );
}
