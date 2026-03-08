import config from "../../site.json";

const baseUrl = (
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  config.url ||
  "https://www.xtas.nu"
).replace(/\/$/, "");

/** Resolve an asset path — local paths (/img/...) stay as-is, WP paths get prefixed */
export function wpAsset(assetPath) {
  if (assetPath.startsWith("/img/") || assetPath.startsWith("http")) {
    return assetPath;
  }
  return `${baseUrl}${assetPath}`;
}

/** Site configuration with resolved URLs */
const site = {
  ...config,
  url: baseUrl,
  logoUrl: wpAsset(config.logo.path),
  bgImageUrl: wpAsset(config.backgroundImage),
  faviconUrl: wpAsset(config.icons.favicon),
  appleIconUrl: wpAsset(config.icons.apple),
  socialLinks: Object.values(config.social),
};

export default site;
