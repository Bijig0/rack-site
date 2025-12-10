import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
}

export interface Author {
  _id?: string;
  name: string;
  image?: SanityImage;
  bio?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description?: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  mainImage?: SanityImage;
  body?: PortableTextBlock[];
  publishedAt: string;
  _updatedAt?: string;
  author?: Author;
  categories?: Category[];
  relatedPosts?: Post[];
}
