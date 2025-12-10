import { Metadata } from 'next';
import DefaultHeader from "@/components/common/DefaultHeader";
import MobileMenu from "@/components/common/mobile-menu";
import Footer from "@/components/home/home-v4/footer";
import Image from "next/image";
import Link from "next/link";
import { sanityClient, urlFor } from '@/lib/sanity/client';
import { allPostsQuery } from '@/lib/sanity/queries';
import type { Post } from '@/lib/sanity/types';

export const metadata: Metadata = {
  title: 'Blog | Rack - Property Insights & Industry News',
  description: 'Stay updated with the latest property market insights, rental appraisal tips, and industry news from Rack. Expert advice for buyer agents and property investors.',
  openGraph: {
    title: 'Blog | Rack - Property Insights & Industry News',
    description: 'Stay updated with the latest property market insights, rental appraisal tips, and industry news.',
    type: 'website',
  },
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default async function BlogPage() {
  let posts: Post[] = [];

  try {
    posts = await sanityClient.fetch(allPostsQuery);
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  return (
    <>
      <DefaultHeader />
      <MobileMenu />

      {/* Blog Header */}
      <section className="pt100 pb50 bgc-f7">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="title mb20" style={{ fontSize: 48, fontWeight: 700 }}>
                Blog
              </h1>
              <p className="text fz18">
                Property insights, market analysis, and expert tips for buyer agents and investors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="pt60 pb100">
        <div className="container">
          {posts.length === 0 ? (
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="p60 bgc-white bdrs12" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <i className="fas fa-newspaper fz60 mb30" style={{ color: '#ddd' }} />
                  <h3 className="mb15">No posts yet</h3>
                  <p className="text">Check back soon for our latest property insights and industry news.</p>
                </div>
              </div>
            </div>
          ) : (
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
                          src={urlFor(post.mainImage).width(600).height(400).url()}
                          alt={post.mainImage.alt || post.title}
                          width={600}
                          height={400}
                          className="w-100"
                          style={{ objectFit: 'cover', height: 220 }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center bgc-f7"
                          style={{ height: 220 }}
                        >
                          <i className="fas fa-image fz40" style={{ color: '#ddd' }} />
                        </div>
                      )}
                    </Link>
                    <div className="p25 flex-grow-1 d-flex flex-column">
                      {post.categories && post.categories.length > 0 && (
                        <div className="mb10">
                          {post.categories.map((category) => (
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
                        <p className="text fz14 mb15 flex-grow-1" style={{ lineHeight: 1.6 }}>
                          {post.excerpt}
                        </p>
                      )}
                      <div className="d-flex align-items-center justify-content-between mt-auto pt15 border-top">
                        {post.author && (
                          <div className="d-flex align-items-center">
                            {post.author.image && (
                              <Image
                                src={urlFor(post.author.image).width(32).height(32).url()}
                                alt={post.author.name}
                                width={32}
                                height={32}
                                className="bdrs50 me-2"
                              />
                            )}
                            <span className="text fz13">{post.author.name}</span>
                          </div>
                        )}
                        <span className="text fz13">
                          {formatDate(post.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="footer-style1 at-home4 pt60 pb-0">
        <Footer />
      </section>
    </>
  );
}
