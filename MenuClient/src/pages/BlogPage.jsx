import { BlogGrid } from '../components/common/BlogGrid.jsx';
import { BlogPageHero } from '../components/sections/BlogPageHero.jsx';
import { ReservationSection } from '../components/sections/ReservationSection.jsx';

export function BlogPage({
  bannerImage,
  pageTitle,
  bannerDescription,
  view,
  reservationProps,
}) {
  const blogTitle = view.theme.blogTitle || pageTitle;
  const blogDescription = view.theme.blogDescription || bannerDescription;

  return (
    <>
      <BlogPageHero
        imageUrl={bannerImage}
        title={blogTitle}
        subtitle={blogDescription}
      />

      <section className="content-shell section blog-page-posts">
        <BlogGrid posts={view.blogPosts} />
      </section>

      <ReservationSection {...reservationProps} />
    </>
  );
}
