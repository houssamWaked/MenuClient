import { SiteFooter } from '../Components/layout/SiteFooter.jsx';
import { SiteHeader } from '../Components/layout/SiteHeader.jsx';
import { useSiteData } from '../context/site-data-context.js';
import './BlogPage.css';

export function BlogPage() {
  const { blogPosts, siteContent } = useSiteData();
  const theme = siteContent?.theme ?? {};
  const path = window.location.pathname.toLowerCase();
  const currentPost =
    path.startsWith('/blog/')
      ? blogPosts.find(
          (post) => `/blog/${String(post.id).toLowerCase()}` === path || post.href?.toLowerCase() === path
        )
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
            <SiteHeader />
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
                {theme.blogBackLabel ?? ''}
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
        style={{ '--blog-banner-image': `url(${theme.pageBanners?.blog ?? ''})` }}
      >
        <div className="blog-page-hero__overlay" />
        <div className="container blog-page-hero__container">
          <SiteHeader />
          <div className="blog-page-hero__body" data-reveal="up">
            <h1>{theme.pageTitles?.blog ?? 'BLOG'}</h1>
          </div>
        </div>
      </header>

      <main>
        <section className="paper-section blog-section">
          <div className="container">
            <div className="blog-section__heading" data-reveal="up">
              <span className="section-eyebrow">{theme.blogEyebrow ?? ''}</span>
              <h2>{theme.blogTitle ?? ''}</h2>
              <p>{theme.blogDescription ?? ''}</p>
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
                      {theme.blogReadMoreLabel ?? ''}
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
