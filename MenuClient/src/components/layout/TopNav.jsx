import { normalizePath } from '../../siteHelpers.js';

const NAV_ENTRIES = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
];

export function TopNav({
  tenantName,
  pathname,
  onNavigate,
  onBook,
  isHome,
  cartCount = 0,
}) {
  return (
    <header className={`top-nav ${isHome ? 'top-nav-home' : ''}`}>
      <button type="button" className="brand" onClick={() => onNavigate('/')}>
        {tenantName.toUpperCase()}
      </button>
      <nav className="top-nav-links">
        {NAV_ENTRIES.map((entry) => (
          <button
            key={entry.href + entry.label}
            type="button"
            className={`top-nav-link ${normalizePath(entry.href) === pathname ? 'active' : ''}`}
            onClick={() => onNavigate(entry.href)}
          >
            {entry.label}
          </button>
        ))}
      </nav>
      <div className="top-nav-actions">
        <button
          type="button"
          className={`cart-nav-btn ${pathname === '/cart' ? 'active' : ''}`}
          onClick={() => onNavigate('/cart')}
          aria-label="Open cart"
        >
          <svg viewBox="0 0 24 24" role="presentation">
            <path d="M4 6H6L8.4 15.2H18.1L20.5 8H7.1" />
            <circle cx="9.5" cy="18.2" r="1.2" />
            <circle cx="17" cy="18.2" r="1.2" />
          </svg>
          {cartCount > 0 ? (
            <span className="cart-nav-count">{cartCount}</span>
          ) : null}
        </button>

        <button type="button" className="book-btn" onClick={onBook}>
          <span className="book-btn-label">Book A Table</span>
          <span className="book-btn-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M7 17L17 7" />
              <path d="M10 7H17V14" />
            </svg>
          </span>
        </button>
      </div>
    </header>
  );
}
