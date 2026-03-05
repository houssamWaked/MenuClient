import { FALLBACK_IMAGES, getSafeImageUrl } from '../../utils/imageUtils.js';

export function BlogGrid({ posts }) {
  return (
    <div className="blog-grid">
      {posts.map((post) => (
        <article className="blog-card" key={post.id || post.title}>
          <div className="blog-card-head">
            <h3>{post.title}</h3>
            <span className="blog-card-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M7 17L17 7" />
                <path d="M8.5 7H17V15.5" />
              </svg>
            </span>
          </div>
          <div className="meta-row">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>
          <img
            src={getSafeImageUrl(post?.imageUrl, FALLBACK_IMAGES.blog)}
            alt={post.title}
            loading="lazy"
          />
        </article>
      ))}
    </div>
  );
}
