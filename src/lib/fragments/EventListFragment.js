/**
 * Event list fragment — only available when the Event CPT is registered in WPGraphQL.
 * Set NEXT_PUBLIC_WORDPRESS_EVENT_CPT=1 to enable.
 */
const enabled =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_WORDPRESS_EVENT_CPT === "1";

export const EventListFragment = enabled
  ? `
fragment EventListFragment on Event {
    id
    title
    uri
    content
    location {
  	  edges {
  	    node {
  	     	name
  	    }
  	  }
  	}
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    author {
      node {
        name
        avatar {
          url
        }
      }
    }
    eventFields {
      date
      startTime
      endTime
    }
  }
`
  : "";
