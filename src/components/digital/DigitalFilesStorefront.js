"use client";

import { useState } from "react";

function formatPrice(priceCents, currency) {
  return `${(priceCents / 100).toFixed(2)} ${String(currency || "usd").toUpperCase()}`;
}

export default function DigitalFilesStorefront({
  user,
  products,
  ownedProductIds,
  stripeEnabled,
  checkoutStatus,
}) {
  const [loadingProductId, setLoadingProductId] = useState("");
  const [error, setError] = useState("");

  async function startCheckout(productId) {
    if (!user?.email) {
      window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent("/digital-files")}`;
      return;
    }
    if (!stripeEnabled) {
      setError("Betalning är inte tillgänglig ännu. Kontakta administratören.");
      return;
    }

    setError("");
    setLoadingProductId(productId);
    const response = await fetch("/api/digital/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const json = await response.json();
    setLoadingProductId("");

    if (!response.ok || !json?.ok || !json?.url) {
      setError(json?.error || "Det gick inte att starta betalningen.");
      return;
    }

    window.location.href = json.url;
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-16 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Digitala filer</h1>
        <p className="text-gray-600 mt-2">
          Köp och ladda ner digitala produkter direkt i portalen.
        </p>
      </div>

      {checkoutStatus === "success" ? (
        <p className="text-green-700">Betalningen registrerades. Din fil är nu upplåst.</p>
      ) : null}
      {checkoutStatus === "cancel" ? (
        <p className="text-yellow-700">Betalningen avbröts. Ingen debitering gjordes.</p>
      ) : null}
      {error ? <p className="text-red-600">{error}</p> : null}

      <div className="grid md:grid-cols-2 gap-6">
        {products.map((product) => {
          const owned = ownedProductIds.includes(product.id);
          const loading = loadingProductId === product.id;
          return (
            <article key={product.id} className="border rounded-lg p-5 space-y-3 bg-white">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              {product.description ? <p className="text-gray-700">{product.description}</p> : null}
              <p className="text-gray-800 font-semibold">
                Pris: {formatPrice(product.priceCents, product.currency)}
              </p>

              {owned ? (
                <a
                  href={`/api/digital/download?productId=${encodeURIComponent(product.id)}`}
                  className="inline-block px-4 py-2 rounded bg-teal-700 text-white hover:bg-teal-600"
                >
                  Ladda ner
                </a>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => startCheckout(product.id)}
                  className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  {loading ? "Skickar till Stripe..." : "Köp fil"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
