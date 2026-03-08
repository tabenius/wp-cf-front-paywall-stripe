/**
 * editorBlocks sub-fragment, included only when the WPGraphQL Content Blocks
 * plugin is available.  Set NEXT_PUBLIC_WORDPRESS_EDITOR_BLOCKS=1 to enable.
 */
const enabled =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_WORDPRESS_EDITOR_BLOCKS === "1";

export const editorBlocksFragment = enabled
  ? `editorBlocks(flat: false) {
      name
      renderedHtml
      attributesJSON
      innerBlocks {
        name
        renderedHtml
        attributesJSON
        innerBlocks {
          name
          renderedHtml
          attributesJSON
        }
      }
    }`
  : "";
