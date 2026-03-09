import { NextResponse } from "next/server";
import { getAdminSessionFromCookieHeader } from "@/auth";
import { listDigitalProducts, saveDigitalProducts } from "@/lib/digitalProducts";
import { t } from "@/lib/i18n";

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: t("apiErrors.adminLoginRequired") },
    { status: 401 },
  );
}

export async function GET(request) {
  const session = getAdminSessionFromCookieHeader(request.headers.get("cookie") || "");
  if (!session) return unauthorized();

  const products = await listDigitalProducts({ includeInactive: true });
  return NextResponse.json({ ok: true, products });
}

export async function PUT(request) {
  const session = getAdminSessionFromCookieHeader(request.headers.get("cookie") || "");
  if (!session) return unauthorized();

  try {
    const body = await request.json();
    const products = Array.isArray(body?.products) ? body.products : [];
    const saved = await saveDigitalProducts(products);
    return NextResponse.json({ ok: true, products: saved });
  } catch (error) {
    console.error("Admin product save failed:", error);
    return NextResponse.json(
      { ok: false, error: t("apiErrors.saveProductsFailed") },
      { status: 400 },
    );
  }
}
