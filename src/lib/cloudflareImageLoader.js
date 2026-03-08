export default function cloudflareImageLoader({ src, width, quality }) {
  if (!src) return "";
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;

  // Keep local/relative assets untouched.
  if (src.startsWith("/") && !src.startsWith("//")) {
    return src;
  }

  // In local dev, Cloudflare Image Resizing is not available.
  if (process.env.NODE_ENV === "development") {
    return src;
  }

  // Image Resizing via /cdn-cgi/image/ only works on Cloudflare zones with
  // the feature enabled (Pro+ plan with a custom domain routed through CF).
  // On workers.dev subdomains the path doesn't resolve.
  //
  // CLOUDFLARE_IMAGE_RESIZING_DOMAIN can be set to the zone domain that has
  // Image Resizing enabled. When set, external images are proxied through
  // that domain's /cdn-cgi/image/ endpoint.
  // When not set, external (absolute) URLs are returned as-is to avoid
  // broken images.
  const resizingDomain = process.env.CLOUDFLARE_IMAGE_RESIZING_DOMAIN;

  const requestedQuality = quality || 75;
  const params = `width=${width},quality=${requestedQuality},format=auto,fit=scale-down,sharpen=1`;

  if (resizingDomain) {
    // Proxy through the zone that has Image Resizing enabled
    return `https://${resizingDomain}/cdn-cgi/image/${params}/${src}`;
  }

  // No resizing domain configured — return original URL unchanged
  return src;
}
