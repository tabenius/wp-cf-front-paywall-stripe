"use client";

import { useState } from "react";
import { t } from "@/lib/i18n";

export default function Paywall({
  courseUri,
  courseTitle,
  userEmail,
  priceCents,
  currency,
  stripeEnabled,
  contentKind = "course",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setError("");
    if (!stripeEnabled) {
      setError(t("paywall.paymentNotAvailable"));
      return;
    }
    setLoading(true);
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentUri: courseUri,
        contentTitle: courseTitle,
        contentKind,
      }),
    });
    const json = await response.json();
    setLoading(false);
    if (!response.ok || !json?.ok || !json?.url) {
      setError(json?.error || t("paywall.checkoutFailed"));
      return;
    }
    window.location.href = json.url;
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-24 space-y-6 text-center">
      <h1 className="text-4xl font-bold">{courseTitle || t("paywall.content")}</h1>
      <p className="text-gray-700">
        {t("paywall.loggedInAs", { email: userEmail, contentKind: contentKind === "event" ? t("common.event").toLowerCase() : t("common.course").toLowerCase() })}
      </p>
      <p className="text-gray-700">
        {t("paywall.fee")}:{" "}
        <strong>
          {(priceCents / 100).toFixed(2)} {currency.toUpperCase()}
        </strong>
      </p>
      <button
        type="button"
        onClick={checkout}
        disabled={loading}
        className="px-8 py-3 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
      >
        {loading
          ? t("paywall.redirectingToStripe")
          : contentKind === "event" ? t("paywall.payAndUnlockEvent") : t("paywall.payAndUnlockCourse")}
      </button>
      {error ? <p className="text-red-600">{error}</p> : null}
    </section>
  );
}
