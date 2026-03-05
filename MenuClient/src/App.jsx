import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { publicSiteApi } from './api/publicSite.js';
import { DEFAULT_SLUG, FALLBACK_CONTENT } from './siteData.js';
import { buildViewModel, getInitialSlug, parseError, toArray } from './siteHelpers.js';
import { PageBanner } from './components/common/PageBanner.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { TopNav } from './components/layout/TopNav.jsx';
import { ReservationSection } from './components/sections/ReservationSection.jsx';
import { useCart } from './hooks/useCart.js';
import { usePathname } from './hooks/usePathname.js';
import { useSiteLoader } from './hooks/useSiteLoader.js';
import { AboutPage } from './pages/AboutPage.jsx';
import { BlogPage } from './pages/BlogPage.jsx';
import { CartPage } from './pages/CartPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { MenuPage } from './pages/MenuPage.jsx';
import { PrivacyPage } from './pages/PrivacyPage.jsx';
import { TermsPage } from './pages/TermsPage.jsx';

function App() {
  const { pathname, navigate } = usePathname();
  const [preferredSlug, setPreferredSlug] = useState(getInitialSlug);
  const reservationRef = useRef(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState({ type: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ type: '', message: '' });
  const [orderStatus, setOrderStatus] = useState({ type: '', message: '' });

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [orderForm, setOrderForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'online',
    locationId: '',
    notes: '',
  });

  const handleSiteLoaded = useCallback((payload) => {
    setOrderForm((previous) =>
      previous.locationId ? previous : { ...previous, locationId: payload?.locations?.[0]?.id || '' }
    );
  }, []);

  const { activeSlug, siteData, loading, loadError } = useSiteLoader(preferredSlug, handleSiteLoaded);
  const view = useMemo(() => buildViewModel(siteData), [siteData]);

  const { cartItems, cartTotal, cartCount, cart, addToCart, updateCartQuantity, clearCart } = useCart(view.items);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: view.tenant.currency || 'USD',
        maximumFractionDigits: 2,
      }),
    [view.tenant.currency]
  );

  const scrollToReservation = useCallback(() => {
    if (pathname !== '/') {
      navigate('/');
      window.setTimeout(() => reservationRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
      return;
    }
    reservationRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [navigate, pathname]);

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    try {
      await publicSiteApi.subscribeNewsletter(activeSlug || preferredSlug, {
        email: newsletterEmail,
        source: 'website_footer',
      });
      setNewsletterStatus({ type: 'success', message: 'Subscribed successfully.' });
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterStatus({ type: 'error', message: parseError(error) });
    }
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    try {
      await publicSiteApi.submitContact(activeSlug || preferredSlug, contactForm);
      setContactStatus({ type: 'success', message: 'Message sent successfully.' });
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setContactStatus({ type: 'error', message: parseError(error) });
    }
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    if (!cartItems.length) {
      setOrderStatus({ type: 'error', message: 'Select at least one dish before booking.' });
      return;
    }

    try {
      const order = await publicSiteApi.createOrder(activeSlug || preferredSlug, {
        locationId: orderForm.locationId || undefined,
        type: orderForm.type,
        notes: orderForm.notes || undefined,
        customer: {
          name: orderForm.name,
          email: orderForm.email,
          phone: orderForm.phone || undefined,
        },
        items: cartItems.map((entry) => ({ itemId: entry.item.id, quantity: entry.quantity })),
      });

      setOrderStatus({
        type: 'success',
        message: `Reservation submitted. Order #${order?.orderNumber ?? 'created'} confirmed.`,
      });
      clearCart();
    } catch (error) {
      setOrderStatus({ type: 'error', message: parseError(error) });
    }
  };

  const handleContactFormChange = (field, value) => {
    setContactForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleOrderFormChange = (field, value) => {
    setOrderForm((previous) => ({ ...previous, [field]: value }));
  };

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('main section, .footer-grid > section'));
    if (!targets.length) return undefined;

    targets.forEach((element, index) => {
      element.classList.add('motion-reveal');
      element.style.setProperty('--motion-delay', `${Math.min(index * 55, 380)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('motion-reveal-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  if (loading) return <div className="status-screen">Loading website...</div>;
  if (loadError && !siteData) {
    return (
      <div className="status-screen">
        <p>{loadError}</p>
        <button type="button" className="btn-primary" onClick={() => setPreferredSlug(DEFAULT_SLUG)}>
          Retry
        </button>
      </div>
    );
  }

  const heroSlides = toArray(view.hero.slides);
  const currentSlide = heroSlides[0] || FALLBACK_CONTENT.hero.slides[0];
  const pageKey = pathname.slice(1);
  const bannerImage = view.theme.pageBanners?.[pageKey] || view.story.backgroundImage;
  const pageTitle = view.theme.pageTitles?.[pageKey] || 'Experience';
  const pageDescriptions = {
    about: view.theme.aboutDescription || view.about.description,
    blog: view.theme.blogDescription,
    contact: view.contact.description,
    cart: 'Review your selected dishes, adjust quantities, and continue to reservation in seconds.',
    terms: 'Read the rules that govern access to the website, reservations, orders, and published menu information.',
    privacy:
      'Understand what information we collect, how it is used, and the choices available to visitors.',
  };
  const bannerDescription = pageDescriptions[pageKey] || view.story.description;
  const cartPageTitle = view.theme.pageTitles?.cart || 'Your Cart';

  const menuHeroTitle = view.theme.menuPageTitle || 'Our Delicious Food Menu';
  const menuHeroSubtitle =
    view.theme.menuPageSubtitle || 'Exclusive Affair of Exceptional Flavors Where Every Bite Tells a Story,';

  const homeMenuSections = view.menuSections.slice(0, 4);
  const homeMenuDescription =
    view.theme.menuDescription ||
    'Where every bite tells a story crafted with intention, steeped in heritage, and designed to leave a lasting impression';
  const homeMenuImage =
    view.specials[0]?.imageUrl ||
    view.featuredItems[0]?.imageUrl ||
    view.items[0]?.imageUrl ||
    currentSlide;

  const signatureDishes = view.specials.length
    ? view.specials
    : view.featuredItems.map((item) => ({
        title: item.name,
        imageUrl: item.imageUrl,
      }));
  const signatureDescription =
    view.theme.specialsDescription ||
    'Savor the moment with our exquisite dishes crafted with passion and the finest ingredients.';

  const ambianceItems = view.gallery.length ? view.gallery : view.specials;
  const ambianceDescription =
    view.theme.galleryDescription ||
    'Where gilded whispers and candlelight compose an evening of warmth, elegance, and quiet allure.';

  const aboutDescription =
    view.theme.aboutDescription ||
    'Discover the story behind our passion for refined cuisine & exquisite ambiance';

  const testimonialsTitle = view.theme.testimonialsTitle || 'Dining Testimonials';
  const testimonialsDescription =
    view.theme.testimonialsDescription ||
    'Where Every Review is a Testament to Excellence, and Every Visit Becomes a Legend';

  const reservationProps = {
    reservationRef,
    orderForm,
    onOrderFormChange: handleOrderFormChange,
    locations: view.locations,
    onOrderSubmit: handleOrderSubmit,
    orderStatus,
    cartItems,
    currencyFormatter,
    cartTotal,
    onUpdateCartQuantity: updateCartQuantity,
  };

  const cartProps = {
    cartItems,
    cartTotal,
    cartCount,
    currencyFormatter,
    onUpdateCartQuantity: updateCartQuantity,
    onClearCart: clearCart,
  };

  const contactProps = {
    contact: view.contact,
    contactForm,
    onContactFormChange: handleContactFormChange,
    onContactSubmit: handleContactSubmit,
    contactStatus,
  };

  let pageContent;
  if (pathname === '/') {
    pageContent = (
      <HomePage
        currentSlide={currentSlide}
        view={view}
        homeMenuSections={homeMenuSections}
        homeMenuDescription={homeMenuDescription}
        homeMenuImage={homeMenuImage}
        signatureDishes={signatureDishes}
        signatureDescription={signatureDescription}
        ambianceItems={ambianceItems}
        ambianceDescription={ambianceDescription}
        aboutDescription={aboutDescription}
        testimonialsTitle={testimonialsTitle}
        testimonialsDescription={testimonialsDescription}
        onNavigate={navigate}
        onBook={scrollToReservation}
        reservationProps={reservationProps}
      />
    );
  } else if (pathname === '/menu') {
    pageContent = (
      <MenuPage
        bannerImage={bannerImage}
        menuHeroTitle={menuHeroTitle}
        menuHeroSubtitle={menuHeroSubtitle}
        view={view}
        signatureDishes={signatureDishes}
        signatureDescription={signatureDescription}
        ambianceItems={ambianceItems}
        ambianceDescription={ambianceDescription}
        currencyFormatter={currencyFormatter}
        onAddToCart={addToCart}
        cartQuantities={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onUpdateCartQuantity={updateCartQuantity}
        onGoToCart={() => navigate('/cart')}
        reservationProps={reservationProps}
      />
    );
  } else if (pathname === '/about') {
    pageContent = (
      <AboutPage
        bannerImage={bannerImage}
        pageTitle={pageTitle}
        bannerDescription={bannerDescription}
        view={view}
        reservationProps={reservationProps}
      />
    );
  } else if (pathname === '/blog') {
    pageContent = (
      <BlogPage
        bannerImage={bannerImage}
        pageTitle={pageTitle}
        bannerDescription={bannerDescription}
        view={view}
        reservationProps={reservationProps}
      />
    );
  } else if (pathname === '/contact') {
    pageContent = (
      <ContactPage
        bannerImage={bannerImage}
        pageTitle={pageTitle}
        bannerDescription={bannerDescription}
        reservationProps={reservationProps}
        contactProps={contactProps}
      />
    );
  } else if (pathname === '/cart') {
    pageContent = (
      <CartPage
        bannerImage={bannerImage}
        pageTitle={cartPageTitle}
        bannerDescription={bannerDescription}
        onNavigate={navigate}
        onBook={scrollToReservation}
        {...cartProps}
      />
    );
  } else if (pathname === '/terms') {
    pageContent = (
      <TermsPage
        bannerImage={bannerImage}
        pageTitle={pageTitle}
        bannerDescription={bannerDescription}
      />
    );
  } else if (pathname === '/privacy') {
    pageContent = (
      <PrivacyPage
        bannerImage={bannerImage}
        pageTitle={pageTitle}
        bannerDescription={bannerDescription}
      />
    );
  } else {
    pageContent = (
      <>
        <PageBanner title={pageTitle} description={bannerDescription} imageUrl={bannerImage} />
        <ReservationSection {...reservationProps} />
      </>
    );
  }

  const isHome = pathname === '/';

  return (
    <div className={`app ${isHome ? 'home-mode' : ''}`}>
      <TopNav
        tenantName={view.tenant.name}
        pathname={pathname}
        onNavigate={navigate}
        onBook={scrollToReservation}
        isHome={isHome}
        cartCount={cartCount}
      />

      <main>
        <div key={pathname} className="route-stage">
          {pageContent}
        </div>
      </main>

      {cartCount > 0 && pathname !== '/cart' ? (
        <button type="button" className="floating-cart-btn" onClick={() => navigate('/cart')}>
          <span>{cartCount} item{cartCount > 1 ? 's' : ''}</span>
          <strong>{currencyFormatter.format(cartTotal)}</strong>
        </button>
      ) : null}

      <Footer
        footer={view.footer}
        onNavigate={navigate}
        onScrollToReservation={scrollToReservation}
        newsletterEmail={newsletterEmail}
        onNewsletterEmailChange={setNewsletterEmail}
        onNewsletterSubmit={handleNewsletterSubmit}
        newsletterStatus={newsletterStatus}
      />
    </div>
  );
}

export default App;
