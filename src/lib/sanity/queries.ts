import { groq } from 'next-sanity';

// Get all published blog posts
export const allPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author->{
      name,
      image,
      bio
    },
    categories[]->{
      _id,
      title,
      slug
    }
  }
`;

// Get recent posts for homepage
export const recentPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author->{
      name,
      image
    },
    categories[]->{
      _id,
      title,
      slug
    }
  }
`;

// Get a single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    publishedAt,
    _updatedAt,
    author->{
      name,
      image,
      bio
    },
    categories[]->{
      _id,
      title,
      slug
    },
    "relatedPosts": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc)[0...3] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt
    }
  }
`;

// Get all post slugs for static generation
export const postSlugsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**"))].slug.current
`;

// Get all categories
export const allCategoriesQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`;

// Get posts by category
export const postsByCategoryQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**")) && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    author->{
      name,
      image
    },
    categories[]->{
      _id,
      title,
      slug
    }
  }
`;
