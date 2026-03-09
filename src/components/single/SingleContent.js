import { FeaturedImage } from "@/components/image/FeaturedImage";
import BlocksRenderer from "@/components/blocks/BlocksRenderer";
import site from "@/lib/site";

/**
 * Transform WordPress HTML content:
 * - Add mailto: prefix to bare email links
 * - Strip site hostname from internal links
 */
function transformContent(html) {
  if (!html) return html;

  // Add mailto: to email links missing it (href="someone@example.com")
  let result = html.replace(
    /href="([^"@\s]+@[^"@\s]+\.[^"\s]+)"/g,
    (match, email) => {
      if (email.startsWith("mailto:") || email.startsWith("http")) return match;
      return `href="mailto:${email}"`;
    },
  );

  // Strip site URL from internal links to make them relative
  const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || "").replace(/\/+$/, "");
  const siteUrl = (site.url || "").replace(/\/+$/, "");
  const origins = [wpUrl, siteUrl].filter(Boolean);
  for (const origin of origins) {
    if (!origin) continue;
    // Escape special regex chars in the URL
    const escaped = origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(
      new RegExp(`href="${escaped}(/[^"]*)"`, "g"),
      'href="$1"',
    );
    result = result.replace(
      new RegExp(`href="${escaped}"`, "g"),
      'href="/"',
    );
  }

  return result;
}

export default function SingleContent({
  data,
  title,
  meta = null,
  footer = null,
  featuredImageClassNames = "h-48 my-9 relative opacity-80 hover:opacity-100 transition-opacity ease-in-out",
}) {
  const safeData = data && typeof data === "object" ? data : {};
  const resolvedTitle =
    typeof title === "string" && title.trim() !== ""
      ? title
      : typeof safeData.title === "string"
        ? safeData.title
        : "";
  const content =
    typeof safeData.content === "string" ? transformContent(safeData.content) : "";
  const editorBlocks = Array.isArray(safeData.editorBlocks)
    ? safeData.editorBlocks
    : [];
  const hasBlocks = editorBlocks.length > 0;

  return (
    <article className="max-w-2xl px-6 py-24 mx-auto space-y-12">
      <div className="w-full mx-auto space-y-4 text-center">
        <h1 className="text-4xl font-bold leading-tight md:text-5xl">
          {resolvedTitle}
        </h1>
        {meta}
        <FeaturedImage
          post={safeData}
          title={resolvedTitle}
          classNames={featuredImageClassNames}
        />
      </div>
      <div className="text-gray-800 prose prose-p:my-4 max-w-none wp-content text-xl">
        {hasBlocks ? (
          <BlocksRenderer blocks={editorBlocks} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </div>
      {footer}
    </article>
  );
}
