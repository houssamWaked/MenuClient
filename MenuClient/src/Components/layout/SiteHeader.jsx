import { buildSocialIcons } from '../../constants/icons.js';
import { useCart } from '../../context/cart-context.js';
import { useSiteData } from '../../context/site-data-context.js';
import { SocialIcon } from '../common/SocialIcon.jsx';
import './SiteHeader.css';

export function SiteHeader() {
  const { tenant, navigation, socialLinks, primaryLocation, siteContent } = useSiteData();
  const { itemCount, toggleCart } = useCart();
  const theme = siteContent?.theme ?? {};
  const tenantName = tenant?.name ?? '';
  const brandText = tenantName
    ? tenantName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .join(' ')
    : '';
  const socialIcons = buildSocialIcons(socialLinks);
  const phone = primaryLocation?.phone ?? '';
  const currentPath = window.location.pathname.toLowerCase();
  const currentHash = window.location.hash.toLowerCase();
  const currentRoute = `${currentPath}${currentHash}`;

  const isLinkActive = (link) => {
    const targets = (link.matchPaths?.length ? link.matchPaths : [link.href]).map((target) =>
      target.toLowerCase()
    );

    return targets.some((target) => {
      if (target === '/') {
        return currentPath === '/' && !currentHash;
      }

      if (target.startsWith('/#')) {
        return currentPath === '/' && currentHash === target.slice(1);
      }

      if (target === '/blog') {
        return currentPath === '/blog' || currentPath.startsWith('/blog/');
      }

      return currentPath === target || currentRoute === target;
    });
  };

  return (
    <div className="topbar">
      <div className="topbar__inner">
        <nav className="nav">
          {navigation.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={isLinkActive(link) ? 'is-active' : undefined}
            >
              {link.label}
              {link.hasCaret ? <span className="nav__caret">v</span> : null}
            </a>
          ))}
        </nav>

        <a
          className="brand-badge"
          href="/"
          aria-label={`${tenantName || 'Home'} home`}
        >
          <span className="brand-badge__bun" />
          <span className="brand-badge__eyebrow">{theme.brandEyebrow ?? ''}</span>
          <span className="brand-badge__text">{brandText}</span>
        </a>

        <div className="topbar__actions">
          <div className="social-links">
            {socialIcons.map((icon) => (
              <SocialIcon key={icon.label} icon={icon} />
            ))}
          </div>
          <button
            className="cart-chip"
            type="button"
            aria-label={`Open cart with ${itemCount} item${itemCount === 1 ? '' : 's'}`}
            onClick={toggleCart}
          >
            <span className="cart-chip__icon" aria-hidden="true" />
            <span className="cart-chip__label">{theme.cartLabel ?? ''}</span>
            <span className="cart-chip__count">{itemCount}</span>
          </button>
          {phone ? <a className="phone-chip" href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a> : null}
        </div>
      </div>
    </div>
  );
}
