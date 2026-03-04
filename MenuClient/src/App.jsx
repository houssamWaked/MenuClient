import './App.css';
import { Route, Routes } from 'react-router-dom';
import { CartDrawer } from './components/cart/CartDrawer.jsx';
import { SiteFooter } from './components/layout/SiteFooter.jsx';
import { SiteHeader } from './components/layout/SiteHeader.jsx';
import { useSiteDataContext } from './context/SiteDataContext.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { BlogPage } from './pages/BlogPage.jsx';
import { BlogPostPage } from './pages/BlogPostPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { MenuPage } from './pages/MenuPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

function App() {
  const { data, error, isLoading } = useSiteDataContext();

  if (isLoading && !data) {
    return (
      <div className="app-loader">
        <div className="app-loader__dot" />
      </div>
    );
  }

  if (!data) {
    return (
      <section className="app-error container section-space">
        <h1>Unable to load website data.</h1>
        <p>{error?.message ?? 'Please check API connection and tenant slug.'}</p>
      </section>
    );
  }

  return (
    <>
      <SiteHeader />
      <main>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<MenuPage />} path="/menu" />
          <Route element={<AboutPage />} path="/about" />
          <Route element={<BlogPage />} path="/blog" />
          <Route element={<BlogPostPage />} path="/blog/:slug" />
          <Route element={<ContactPage />} path="/contact" />
          <Route element={<NotFoundPage />} path="*" />
        </Routes>
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}

export default App;
