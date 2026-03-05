import { BlogGrid } from '../common/BlogGrid.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';

export function BlogSection({ theme, posts, showAll }) {
  return (
    <section className="content-shell section">
      <SectionHeading eyebrow={theme.blogEyebrow} title={theme.blogTitle} sideText={theme.blogDescription} />
      <BlogGrid posts={posts.slice(0, showAll ? posts.length : 6)} />
    </section>
  );
}
