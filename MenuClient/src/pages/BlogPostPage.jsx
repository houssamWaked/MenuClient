import { Link, useParams } from 'react-router-dom';
import { PageHero } from '../components/layout/PageHero.jsx';
import { useSiteDataContext } from '../context/SiteDataContext.jsx';
import './BlogPostPage.css';

export function BlogPostPage() {
  const { slug } = useParams();
  const { data } = useSiteDataContext();
  const theme = data?.siteContent?.theme ?? {};
  const posts = data?.siteContent?.blogPosts ?? [];

  const post = posts.find((entry) => {
    if (entry?.id === slug) {
      return true;
    }

    if (typeof entry?.href === 'string') {
      return entry.href.endsWith(`/${slug}`);
    }

    return false;
  });

  if (!post) {
    return (
      <>
        <PageHero imageUrl={theme.pageBanners?.blog} title={theme.pageTitles?.blog ?? 'Blog'} />
        <section className="section-space container blog-post-page">
          <h2>Post not found.</h2>
          <Link to="/blog">{theme.blogBackLabel ?? 'Back To Blog'}</Link>
        </section>
      </>
    );
  }

  const contentLines = Array.isArray(post.content) ? post.content : [post.content].filter(Boolean);

  return (
    <>
      <PageHero imageUrl={post.imageUrl || theme.pageBanners?.blog} title={post.title} />
      <article className="section-space container blog-post-page">
        <small>{post.category}</small>
        <h2>{post.title}</h2>
        {post.excerpt ? <p className="blog-post-page__lead">{post.excerpt}</p> : null}
        {contentLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <Link to="/blog">{theme.blogBackLabel ?? 'Back To Blog'}</Link>
      </article>
    </>
  );
}
