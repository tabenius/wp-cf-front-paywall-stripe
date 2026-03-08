import { editorBlocksFragment } from "./editorBlocks";

export const SingleEventFragment = `
fragment SingleEventFragment on Event {
    __typename
    id
    uri
    title
    content
    ${editorBlocksFragment}
    eventFields {
      date
      startTime
      endTime
    }
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
    location {
      edges {
        node {
          name
        }
      }
    }
  }
`;
