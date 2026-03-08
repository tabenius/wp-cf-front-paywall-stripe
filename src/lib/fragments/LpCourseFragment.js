import { hasGraphQLType } from "@/lib/client";
import { editorBlocksFragment } from "./editorBlocks";

/**
 * LearnPress Course fragment — included only when LpCourse exists in WPGraphQL.
 * Auto-detected via schema introspection (cached).
 */
export async function getLpCourseFragment() {
  const exists = await hasGraphQLType("LpCourse");
  if (!exists) return "";
  return `
fragment LpCourseFragment on LpCourse {
    __typename
    id
    databaseId
    uri
    title
    content
    ${editorBlocksFragment}
    price
    priceRendered
    duration
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
  }
`;
}
