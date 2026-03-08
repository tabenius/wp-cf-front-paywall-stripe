import { editorBlocksFragment } from "./editorBlocks";

export const SinglePageFragment = `
  fragment SinglePageFragment on Page {
    __typename
    id
    uri
    title
    content
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
    ${editorBlocksFragment}
  }
`;
