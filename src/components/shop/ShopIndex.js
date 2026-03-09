"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { t } from "@/lib/i18n";

function formatPrice(priceCents, currency) {
  return `${(priceCents / 100).toFixed(2)} ${String(currency || "SEK").toUpperCase()}`;
}

export default function ShopIndex({
  user,
  products,
  ownedProductIds,
  stripeEnabled,
  checkoutStatus,
}) {
  const [loadingProductId, setLoadingProductId] = useState("");
  const [error, setError] = useState("");

  async function startCheckout(productSlug) {
    if (!user?.email) {
      window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent("/shop")}`;
      return;
    }
    if (!stripeEnabled) {
      setError(t("shop.paymentNotAvailable"));
      return;
    }

    setError("");
    setLoadingProductId(productSlug);
    const response = await fetch("/api/digital/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug }),
    });
    const json = await response.json();
    setLoadingProductId("");

    if (!response.ok || !json?.ok || !json?.url) {
      setError(json?.error || t("shop.checkoutFailed"));
      return;
    }

    window.location.href = json.url;
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-16 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("shop.title")}</h1>
        <p className="text-gray-600 mt-2">{t("shop.subtitle")}</p>
      </div>

      {checkoutStatus === "success" ? (
        <p className="text-green-700">{t("shop.paymentSuccess")}</p>
      ) : null}
      {checkoutStatus === "cancel" ? (
        <p className="text-yellow-700">{t("shop.paymentCancelled")}</p>
      ) : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const owned = ownedProductIds.includes(product.id);
          const loading = loadingProductId === product.slug;
          return (
            <article key={product.id} className="border rounded-lg bg-white overflow-hidden">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={1200}
                  height={600}
                  unoptimized
                  className="w-full h-44 object-cover"
                />
              ) : null}
              <div className="p-5 space-y-3">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                {product.description ? (
                  <p className="text-gray-700 line-clamp-3">{product.description}</p>
                ) : null}
                <p className="text-sm text-gray-500">
                  {t("shop.typeLabel")}: {product.type === "course" ? t("shop.typeCourse") : t("shop.typeDigitalFile")}
                </p>
                <p className="text-gray-800 font-semibold">
                  {t("common.price")}: {formatPrice(product.priceCents, product.currency)}
                </p>

                <div className="flex gap-2 items-center">
                  <Link
                    href={`/shop/${encodeURIComponent(product.slug)}`}
                    className="px-3 py-2 rounded border hover:bg-gray-50"
                  >
                    {t("common.view")}
                  </Link>
                  {owned ? (
                    <span className="text-green-700 text-sm font-semibold">{t("shop.purchased")}</span>
                  ) : (
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => startCheckout(product.slug)}
                      className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                      {loading ? t("shop.sending") : t("common.buy")}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
