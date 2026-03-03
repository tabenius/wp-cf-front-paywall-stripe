import { NextResponse } from "next/server";
import { listDigitalProducts } from "@/lib/digitalProducts";

export async function GET() {
  const products = await listDigitalProducts();
  return NextResponse.json({
    ok: true,
    products: products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      priceCents: product.priceCents,
      currency: product.currency,
      active: product.active,
    })),
  });
}
