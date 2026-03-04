import { BlogListSection } from '../components/home/BlogListSection.jsx';
import { PageHero } from '../components/layout/PageHero.jsx';
import { useSiteDataContext } from '../context/SiteDataContext.jsx';

export function BlogPage() {
  const { data } = useSiteDataContext();
  const theme = data?.siteContent?.theme ?? {};
  const posts = data?.siteContent?.blogPosts ?? [];

  return (
    <>
      <PageHero imageUrl={theme.pageBanners?.blog} title={theme.pageTitles?.blog ?? 'Blog'} />
      <BlogListSection posts={posts} theme={theme} />
    </>
  );
}
