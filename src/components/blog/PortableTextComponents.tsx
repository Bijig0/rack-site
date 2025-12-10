'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/client';

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-4">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || 'Blog image'}
            width={800}
            height={450}
            className="w-100 bdrs8"
            style={{ objectFit: 'cover' }}
          />
          {value.caption && (
            <figcaption className="text-center text fz14 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => (
      <pre className="p20 bgc-dark bdrs8 my-4 overflow-auto">
        <code className="text-white fz14" style={{ fontFamily: 'monospace' }}>
          {value.code}
        </code>
      </pre>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mt-5 mb-3" style={{ fontSize: 28, fontWeight: 600 }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-4 mb-3" style={{ fontSize: 22, fontWeight: 600 }}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-4 mb-2" style={{ fontSize: 18, fontWeight: 600 }}>
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="text mb-4" style={{ fontSize: 16, lineHeight: 1.8 }}>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-4 ps-4"
        style={{
          borderLeft: '4px solid #eb6753',
          fontStyle: 'italic',
          color: '#666',
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 ps-4" style={{ lineHeight: 1.8 }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 ps-4" style={{ lineHeight: 1.8 }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="mb-2">{children}</li>,
    number: ({ children }) => <li className="mb-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    'strike-through': ({ children }) => <s>{children}</s>,
    code: ({ children }) => (
      <code
        className="px-1 py-1 bgc-f7 bdrs4"
        style={{ fontFamily: 'monospace', fontSize: 14 }}
      >
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const rel = value?.blank ? 'noopener noreferrer' : undefined;
      const target = value?.blank ? '_blank' : undefined;
      return (
        <Link
          href={value?.href || '#'}
          rel={rel}
          target={target}
          style={{ color: '#eb6753', textDecoration: 'underline' }}
        >
          {children}
        </Link>
      );
    },
  },
};
