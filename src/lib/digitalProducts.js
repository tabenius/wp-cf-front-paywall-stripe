import path from "node:path";

const PRODUCT_FILE = "config/digital-products.json";

function normalizeCurrency(currency) {
  return typeof currency === "string" && currency.trim()
    ? currency.trim().toLowerCase()
    : "usd";
}

function sanitizeProduct(product) {
  const id = typeof product?.id === "string" ? product.id.trim() : "";
  const title = typeof product?.title === "string" ? product.title.trim() : "";
  const description =
    typeof product?.description === "string" ? product.description.trim() : "";
  const priceCents =
    typeof product?.priceCents === "number"
      ? Math.max(0, Math.floor(product.priceCents))
      : Number.parseInt(String(product?.priceCents || "0"), 10) || 0;
  const fileUrl = typeof product?.fileUrl === "string" ? product.fileUrl.trim() : "";
  const active = product?.active !== false;

  if (!id || !title || !fileUrl) return null;

  try {
    const parsedUrl = new URL(fileUrl);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) return null;
  } catch {
    return null;
  }

  return {
    id,
    title,
    description,
    priceCents,
    currency: normalizeCurrency(product?.currency),
    fileUrl,
    active,
  };
}

async function readProductFile() {
  const [{ promises: fs }] = await Promise.all([import("node:fs")]);
  const fullPath = path.join(process.cwd(), PRODUCT_FILE);
  const raw = await fs.readFile(fullPath, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function listDigitalProducts({ includeInactive = false } = {}) {
  try {
    const rawProducts = await readProductFile();
    const products = rawProducts.map(sanitizeProduct).filter(Boolean);
    return includeInactive ? products : products.filter((product) => product.active);
  } catch (error) {
    console.error("Failed to read digital product catalog:", error);
    return [];
  }
}

export async function getDigitalProductById(productId) {
  const normalizedId = typeof productId === "string" ? productId.trim() : "";
  if (!normalizedId) return null;
  const products = await listDigitalProducts({ includeInactive: true });
  return products.find((product) => product.id === normalizedId) || null;
}
