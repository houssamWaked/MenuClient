import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSiteDataContext } from '../../context/SiteDataContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import './SiteHeader.css';

function socialBadge(platform) {
  switch (platform) {
    case 'instagram':
      return 'IG';
    case 'twitter':
      return 'X';
    case 'facebook':
      return 'f';
    case 'google':
      return 'G+';
    default:
      return 'o';
  }
}

export function SiteHeader() {
  const { data } = useSiteDataContext();
  const { toggleCart, totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = useMemo(() => data?.siteContent?.theme?.navigation ?? [], [data]);
  const socialLinks = useMemo(() => data?.siteContent?.socialLinks ?? [], [data]);
  const phone = data?.locations?.[0]?.phone ?? '';
  const brandEyebrow = data?.siteContent?.theme?.brandEyebrow ?? 'Stone Fired';

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const close = () => setIsMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [isMenuOpen]);

  return (
    <header className={`site-header ${isScrolled ? 'site-header--solid' : ''}`}>
      <div className="site-header__inner container">
        <button className="site-header__toggle" onClick={() => setIsMenuOpen((value) => !value)} type="button">
          Menu
        </button>

        <nav className={`site-header__nav ${isMenuOpen ? 'site-header__nav--open' : ''}`}>
          {navigation.map((link) => (
            <NavLink
              key={`${link.href}-${link.label}`}
              className={({ isActive }) => `site-header__link ${isActive ? 'is-active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
              to={link.href}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link aria-label="Home" className="brand-badge" to="/">
          <span className="brand-badge__icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-badge__label">Pizza</span>
          <small>{brandEyebrow}</small>
        </Link>

        <div className="site-header__right">
          <div className="site-header__socials" aria-label="Social media links">
            {socialLinks.map((social) => (
              <a
                className="site-header__social-link"
                href={social.href}
                key={`${social.platform}-${social.href}`}
                rel="noreferrer"
                target="_blank"
              >
                {socialBadge(social.platform)}
              </a>
            ))}
          </div>

          {phone ? <a className="site-header__phone" href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a> : null}

          <button className="site-header__cart" onClick={toggleCart} type="button">
            Cart
            {totalItems > 0 ? <span>{totalItems}</span> : null}
          </button>
        </div>
      </div>
    </header>
  );
}
