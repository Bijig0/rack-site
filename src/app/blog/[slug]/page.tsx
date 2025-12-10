import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/home/home-v4/footer";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from '@portabletext/react';
import { sanityClient, urlFor } from '@/lib/sanity/client';
import { postBySlugQuery, postSlugsQuery } from '@/lib/sanity/queries';
import { portableTextComponents } from '@/components/blog/PortableTextComponents';
import type { Post } from '@/lib/sanity/types';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<string[]>(postSlugsQuery);
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch<Post>(postBySlugQuery, { slug });

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rack.com.au';
  const ogImage = post.mainImage
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : `${siteUrl}/images/og-image.png`;

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on the Rack blog.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read ${post.title} on the Rack blog.`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: post.author ? [post.author.name] : undefined,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await sanityClient.fetch<Post>(postBySlugQuery, { slug });

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rack.com.au';

  // JSON-LD structured data for the article
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Rack',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <DefaultHeader />
      <MobileMenu />

      {/* Article Header */}
      <section className="pt100 pb50">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {/* Breadcrumb */}
              <nav className="mb20">
                <Link href="/" className="text fz14">
                  Home
                </Link>
                <span className="mx-2 text">/</span>
                <Link href="/blog" className="text fz14">
                  Blog
                </Link>
                <span className="mx-2 text">/</span>
                <span className="text fz14">{post.title}</span>
              </nav>

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="mb15">
                  {post.categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/blog?category=${category.slug.current}`}
                      className="badge me-2"
                      style={{
                        backgroundColor: '#eb6753',
                        color: 'white',
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: 'none',
                      }}
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="mb20" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.3 }}>
                {post.title}
              </h1>

              {/* Meta */}
              <div className="d-flex align-items-center flex-wrap gap-3 mb30">
                {post.author && (
                  <div className="d-flex align-items-center">
                    {post.author.image && (
                      <Image
                        src={urlFor(post.author.image).width(40).height(40).url()}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="bdrs50 me-2"
                      />
                    )}
                    <span className="text fz14">{post.author.name}</span>
                  </div>
                )}
                <span className="text fz14">
                  <i className="far fa-calendar-alt me-1" />
                  {formatDate(post.publishedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.mainImage && (
        <section className="pb50">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <Image
                  src={urlFor(post.mainImage).width(1200).height(600).url()}
                  alt={post.mainImage.alt || post.title}
                  width={1200}
                  height={600}
                  className="w-100 bdrs12"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="pb60">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <article className="blog-content">
                {post.body && (
                  <PortableText value={post.body} components={portableTextComponents} />
                )}
              </article>

              {/* Share buttons */}
              <div className="border-top pt30 mt30">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                  <span className="text fz14">Share this article:</span>
                  <div className="d-flex gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`${siteUrl}/blog/${slug}`)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-dark"
                    >
                      <i className="fab fa-twitter" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${siteUrl}/blog/${slug}`)}&title=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-dark"
                    >
                      <i className="fab fa-linkedin-in" />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/blog/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-dark"
                    >
                      <i className="fab fa-facebook-f" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              {post.author && post.author.bio && (
                <div className="p30 bgc-f7 bdrs12 mt30">
                  <div className="d-flex align-items-start gap-3">
                    {post.author.image && (
                      <Image
                        src={urlFor(post.author.image).width(80).height(80).url()}
                        alt={post.author.name}
                        width={80}
                        height={80}
                        className="bdrs50 flex-shrink-0"
                      />
                    )}
                    <div>
                      <h5 className="mb10" style={{ fontWeight: 600 }}>
                        {post.author.name}
                      </h5>
                      <p className="text fz14 mb-0">{post.author.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <section className="pb100 bgc-f7 pt60">
          <div className="container">
            <h3 className="mb30" style={{ fontSize: 28, fontWeight: 600 }}>
              Related Articles
            </h3>
            <div className="row">
              {post.relatedPosts.map((relatedPost) => (
                <div key={relatedPost._id} className="col-md-4 mb30">
                  <article
                    className="bgc-white bdrs12 overflow-hidden h-100"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  >
                    <Link href={`/blog/${relatedPost.slug.current}`}>
                      {relatedPost.mainImage ? (
                        <Image
                          src={urlFor(relatedPost.mainImage).width(400).height(250).url()}
                          alt={relatedPost.title}
                          width={400}
                          height={250}
                          className="w-100"
                          style={{ objectFit: 'cover', height: 180 }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center bgc-f7"
                          style={{ height: 180 }}
                        >
                          <i className="fas fa-image fz30" style={{ color: '#ddd' }} />
                        </div>
                      )}
                    </Link>
                    <div className="p20">
                      <h5
                        className="mb10"
                        style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}
                      >
                        <Link
                          href={`/blog/${relatedPost.slug.current}`}
                          className="text-dark"
                          style={{ textDecoration: 'none' }}
                        >
                          {relatedPost.title}
                        </Link>
                      </h5>
                      <span className="text fz13">
                        {formatDate(relatedPost.publishedAt)}
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="footer-style1 at-home4 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
}
