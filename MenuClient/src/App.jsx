import './Styles/layout.css';
import './Styles/actions.css';
import { AboutPage } from './Pages/AboutPage.jsx';
import { BlogPage } from './Pages/BlogPage.jsx';
import { ContactPage } from './Pages/ContactPage.jsx';
import { HomePage } from './Pages/HomePage.jsx';
import { MenuPage } from './Pages/MenuPage.jsx';
import { CartDrawer } from './Components/layout/CartDrawer.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { SiteDataProvider } from './context/SiteDataContext.jsx';
import { useRevealMotion } from './hooks/useRevealMotion.js';
import { useLandingData } from './hooks/useLandingData.js';

function SiteErrorState({ error }) {
  const body = error || 'The frontend could not reach the backend.';

  return (
    <main className="site-status is-error">
      <div className="site-status__card">
        <span className="site-status__eyebrow">Connection Error</span>
        <h1>Live website data is unavailable</h1>
        <p>{body}</p>
        <button type="button" className="site-status__button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    </main>
  );
}

function App() {
  useRevealMotion();
  const siteData = useLandingData();
  const path = window.location.pathname.toLowerCase();
  let page = <HomePage />;
  const hasLiveContent = Boolean(
    siteData.tenant ||
      siteData.navigation.length ||
      siteData.items.length ||
      siteData.locations.length ||
      siteData.siteContent
  );

  if (path.startsWith('/blog/')) {
    page = <BlogPage />;
  } else if (path === '/about') {
    page = <AboutPage />;
  } else if (path === '/menu') {
    page = <MenuPage />;
  } else if (path === '/blog') {
    page = <BlogPage />;
  } else if (path === '/contact') {
    page = <ContactPage />;
  }

  return (
    <SiteDataProvider value={siteData}>
      <CartProvider>
        {siteData.error && !hasLiveContent ? (
          <SiteErrorState error={siteData.error} />
        ) : (
          page
        )}
        <CartDrawer />
      </CartProvider>
    </SiteDataProvider>
  );
}

export default App;
