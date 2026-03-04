import { Link } from 'react-router-dom';
import { Reveal } from '../common/Reveal.jsx';
import './BlogListSection.css';

export function BlogListSection({ posts, theme }) {
  const entries = Array.isArray(posts) ? posts : [];

  return (
    <section className="blog-list section-space container">
      <div className="blog-list__grid">
        {entries.map((post, index) => (
          <Reveal className="blog-list__card" delay={index * 60} key={post.id ?? post.href}>
            <img alt={post.title} src={post.imageUrl} />
            <div>
              <small>{post.category}</small>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <Link to={post.href}>{theme?.blogReadMoreLabel ?? 'Read Story'}</Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
