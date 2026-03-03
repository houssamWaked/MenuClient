import { SiteFooter } from '../Components/layout/SiteFooter.jsx';
import { SiteHeader } from '../Components/layout/SiteHeader.jsx';
import { blogPosts, mediaLibrary, siteCopy } from '../constants/string.js';
import { useLandingData } from '../hooks/useLandingData.js';
import './BlogPage.css';

export function BlogPage() {
  const pageData = useLandingData();
  const tenantName = pageData.tenant?.name ?? 'Burger Bachelor';
  const path = window.location.pathname.toLowerCase();
  const currentPost = path.startsWith('/blog/')
    ? blogPosts.find((post) => `/blog/${post.id}` === path)
    : null;

  if (currentPost) {
    return (
      <div className="site-shell blog-page-shell">
        <header
          className="blog-page-hero blog-page-hero--post"
          style={{ '--blog-banner-image': `url(${currentPost.imageUrl})` }}
        >
          <div className="blog-page-hero__overlay" />
          <div className="container blog-page-hero__container">
            <SiteHeader tenantName={tenantName} />
            <div className="blog-page-hero__body blog-page-hero__body--post" data-reveal="up">
              <span className="blog-post-hero__category">{currentPost.category}</span>
              <h1>{currentPost.title}</h1>
            </div>
          </div>
        </header>

        <main>
          <section className="paper-section blog-post-section">
            <div className="container blog-post-shell" data-stagger>
              <a className="blog-post-back" href="/blog" data-reveal="up">
                Back To Blog
              </a>
              <div className="blog-post-card" data-reveal="up">
                <p className="blog-post-lead">{currentPost.excerpt}</p>
                {currentPost.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="site-shell blog-page-shell">
      <header
        className="blog-page-hero"
        style={{ '--blog-banner-image': `url(${mediaLibrary.blogBanner})` }}
      >
        <div className="blog-page-hero__overlay" />
        <div className="container blog-page-hero__container">
          <SiteHeader tenantName={tenantName} />
          <div className="blog-page-hero__body" data-reveal="up">
            <h1>{siteCopy.blogPageHeroTitle}</h1>
          </div>
        </div>
      </header>

      <main>
        <section className="paper-section blog-section">
          <div className="container">
            <div className="blog-section__heading" data-reveal="up">
              <span className="section-eyebrow">{siteCopy.blogEyebrow}</span>
              <h2>{siteCopy.blogTitle}</h2>
              <p>{siteCopy.blogDescription}</p>
            </div>

            <div className="blog-grid" data-stagger>
              {blogPosts.map((post) => (
                <article key={post.id} className="blog-card" data-reveal="up">
                  <a className="blog-card__media" href={post.href} aria-label={post.title}>
                    <img src={post.imageUrl} alt={post.title} loading="lazy" />
                  </a>
                  <div className="blog-card__body">
                    <span className="blog-card__category">{post.category}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <a className="blog-card__link" href={post.href}>
                      Read Story
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
