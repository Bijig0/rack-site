import Image from 'next/image';
import Link from 'next/link';
import { sanityClient, urlFor } from '@/lib/sanity/client';
import { recentPostsQuery } from '@/lib/sanity/queries';
import type { Post } from '@/lib/sanity/types';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export default async function BlogSection() {
  let posts: Post[] = [];

  try {
    posts = await sanityClient.fetch(recentPostsQuery);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return null; // Don't render section if fetch fails
  }

  // Don't render section if no posts
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="pt100 pb100">
      <div className="container">
        <div className="row justify-content-center mb60">
          <div className="col-lg-8 text-center">
            <h2 className="title mb20" style={{ fontSize: 40, fontWeight: 700 }}>
              Latest from Our Blog
            </h2>
            <p className="text fz16">
              Property insights, market analysis, and expert tips to help you make
              smarter investment decisions.
            </p>
          </div>
        </div>
        <div className="row">
          {posts.map((post) => (
            <div key={post._id} className="col-md-6 col-lg-4 mb30">
              <article
                className="bgc-white bdrs12 overflow-hidden h-100 d-flex flex-column"
                style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              >
                <Link href={`/blog/${post.slug.current}`} className="d-block position-relative">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).width(400).height(250).url()}
                      alt={post.mainImage.alt || post.title}
                      width={400}
                      height={250}
                      className="w-100"
                      style={{ objectFit: 'cover', height: 200 }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bgc-f7"
                      style={{ height: 200 }}
                    >
                      <i className="fas fa-image fz40" style={{ color: '#ddd' }} />
                    </div>
                  )}
                </Link>
                <div className="p25 flex-grow-1 d-flex flex-column">
                  {post.categories && post.categories.length > 0 && (
                    <div className="mb10">
                      {post.categories.slice(0, 2).map((category) => (
                        <span
                          key={category._id}
                          className="badge me-1"
                          style={{
                            backgroundColor: '#eb6753',
                            color: 'white',
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                        >
                          {category.title}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="mb10" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className="text-dark"
                      style={{ textDecoration: 'none' }}
                    >
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p
                      className="text fz14 mb15 flex-grow-1"
                      style={{
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.excerpt}
                    </p>
                  )}
                  <div className="d-flex align-items-center justify-content-between mt-auto pt15 border-top">
                    {post.author && (
                      <div className="d-flex align-items-center">
                        {post.author.image && (
                          <Image
                            src={urlFor(post.author.image).width(28).height(28).url()}
                            alt={post.author.name}
                            width={28}
                            height={28}
                            className="bdrs50 me-2"
                          />
                        )}
                        <span className="text fz13">{post.author.name}</span>
                      </div>
                    )}
                    <span className="text fz13">{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
        <div className="row mt20">
          <div className="col-12 text-center">
            <Link href="/blog" className="ud-btn btn-thm">
              View All Articles
              <i className="fal fa-arrow-right-long ms-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
