import './Styles/layout.css';
import './Styles/actions.css';
import { AboutPage } from './Pages/AboutPage.jsx';
import { BlogPage } from './Pages/BlogPage.jsx';
import { ContactPage } from './Pages/ContactPage.jsx';
import { HomePage } from './Pages/HomePage.jsx';
import { MenuPage } from './Pages/MenuPage.jsx';
import { CartDrawer } from './Components/layout/CartDrawer.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { useRevealMotion } from './hooks/useRevealMotion.js';

function App() {
  useRevealMotion();
  const path = window.location.pathname.toLowerCase();
  let page = <HomePage />;

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
    <CartProvider>
      {page}
      <CartDrawer />
    </CartProvider>
  );
}

export default App;
