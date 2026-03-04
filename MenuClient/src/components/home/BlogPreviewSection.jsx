import { Link } from 'react-router-dom';
import { Reveal } from '../common/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './BlogPreviewSection.css';

export function BlogPreviewSection({ posts, theme }) {
  const cards = Array.isArray(posts) ? posts.slice(0, 3) : [];

  return (
    <section className="blog-preview section-space container">
      <SectionHeading eyebrow={theme?.blogEyebrow} title={theme?.blogTitle} />
      {theme?.blogDescription ? <p className="blog-preview__description">{theme.blogDescription}</p> : null}

      <div className="blog-preview__grid">
        {cards.map((post, index) => (
          <Reveal className="blog-preview__card" delay={index * 80} key={post.id ?? `${post.title}-${index}`}>
            <img alt={post.title} src={post.imageUrl} />
            <div>
              <small>{post.category}</small>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <Link to={post.href}>{theme?.blogReadMoreLabel ?? 'Read Story'}</Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
