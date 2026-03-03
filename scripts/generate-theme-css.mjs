import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const themeJsonPath = path.join(rootDir, "theme.json");
const outCssPath = path.join(rootDir, "src", "app", "theme.generated.css");

function toSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getThemeItems(theme) {
  const palette = theme?.settings?.color?.palette ?? [];
  const fontFamilies = theme?.settings?.typography?.fontFamilies ?? [];

  return {
    colors: palette
      .map((item) => ({
        slug: toSlug(item?.slug || item?.name),
        value: String(item?.color || "").trim(),
      }))
      .filter((item) => item.slug && item.value),
    fonts: fontFamilies
      .map((item) => ({
        slug: toSlug(item?.slug || item?.name),
        value: String(item?.fontFamily || "").trim(),
      }))
      .filter((item) => item.slug && item.value),
  };
}

function buildCss({ colors, fonts }) {
  const lines = [];

  lines.push("/* Auto-generated from theme.json. Do not edit manually. */");
  lines.push(":root {");

  for (const color of colors) {
    lines.push(`  --color-${color.slug}: ${color.value};`);
  }

  for (const font of fonts) {
    lines.push(`  --font-${font.slug}: ${font.value};`);
  }

  const background = colors.find((item) => item.slug === "background");
  const foreground = colors.find((item) => item.slug === "foreground");

  if (background) lines.push(`  --background: var(--color-${background.slug});`);
  if (foreground) lines.push(`  --foreground: var(--color-${foreground.slug});`);

  lines.push("}");
  lines.push("");

  for (const color of colors) {
    lines.push(`.has-${color.slug}-color { color: var(--color-${color.slug}); }`);
    lines.push(
      `.has-${color.slug}-background-color { background-color: var(--color-${color.slug}); }`,
    );
  }

  if (colors.length > 0) lines.push("");

  for (const font of fonts) {
    lines.push(`.font-${font.slug} { font-family: var(--font-${font.slug}); }`);
  }

  lines.push("");
  return `${lines.join("\n")}`;
}

async function main() {
  const themeText = await fs.readFile(themeJsonPath, "utf8");
  const theme = JSON.parse(themeText);
  const css = buildCss(getThemeItems(theme));

  await fs.mkdir(path.dirname(outCssPath), { recursive: true });
  await fs.writeFile(outCssPath, css, "utf8");
  process.stdout.write(`Generated ${path.relative(rootDir, outCssPath)}\n`);
}

main().catch((error) => {
  process.stderr.write(`Failed to generate theme CSS: ${error.message}\n`);
  process.exit(1);
});
