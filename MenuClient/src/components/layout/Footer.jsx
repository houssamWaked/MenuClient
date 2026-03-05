function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M7 17L17 7" />
      <path d="M10 7H17V14" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
      <path d="M8 10.5V16" />
      <path d="M8 8.2h0.01" />
      <path d="M11.5 16V12.8c0-1.3 0.9-2.3 2.1-2.3s2.1 1 2.1 2.3V16" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M12 3.5a8.5 8.5 0 0 0-3.1 16.4l1-3.8c-.2-.4-.4-1.1-.4-1.8 0-1.7 1-3 2.2-3 1 0 1.5.7 1.5 1.6 0 1-.6 2.4-.9 3.8-.3 1.1.6 2 1.8 2 2.2 0 3.7-2.9 3.7-5.8 0-2.4-1.6-4.2-4.6-4.2-3.3 0-5.4 2.5-5.4 5.3 0 1 .3 1.8.8 2.4.2.2.2.4.1.7l-.3 1.1c-.1.4-.4.5-.8.4-1.2-.5-1.8-2-1.8-3.7 0-3 2.3-6.5 7.4-6.5 4.2 0 7 3 7 6.2 0 4.3-2.4 7.5-5.9 7.5-1.2 0-2.2-.6-2.6-1.3l-.7 2.7c-.3 1-.8 1.9-1.3 2.6" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M13.8 8.5h1.5V6.2h-1.8c-2.2 0-3.6 1.3-3.6 3.8v1.5H8v2.3h1.9V18h2.6v-4.2h2.3l.4-2.3h-2.7v-1.2c0-1 .4-1.8 1.3-1.8z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation">
      <path d="M4 4L20 20" />
      <path d="M20 4L4 20" />
    </svg>
  );
}

const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  pinterest: PinterestIcon,
  facebook: FacebookIcon,
  x: XIcon,
  twitter: XIcon,
};

function LinkButton({ label, onClick }) {
  return (
    <button type="button" className="footer-link-btn" onClick={onClick}>
      <span>{label}</span>
      <span className="footer-link-icon" aria-hidden="true">
        <ArrowIcon />
      </span>
    </button>
  );
}

export function Footer({
  footer,
  onNavigate,
  onScrollToReservation,
  newsletterEmail,
  onNewsletterEmailChange,
  onNewsletterSubmit,
  newsletterStatus,
  socialLinks = [],
}) {
  const quickLinks = Array.isArray(footer.quickLinks) ? footer.quickLinks : [];
  const utilityLinks = Array.isArray(footer.utilityLinks) ? footer.utilityLinks : [];

  function getLinkHandler(entry) {
    if (entry.action === 'reservation') {
      return onScrollToReservation;
    }
    return () => onNavigate(entry.href);
  }

  return (
    <footer className="footer">
      <div className="content-shell footer-grid">
        <section>
          <h4 className="footer-title">{footer.quickLinksTitle}</h4>
          <div className="footer-link-list">
            {quickLinks.map((entry) => (
              <LinkButton
                key={entry.label}
                label={entry.label}
                onClick={getLinkHandler(entry)}
              />
            ))}
          </div>
        </section>

        <section>
          <h4 className="footer-title">{footer.utilityLinksTitle}</h4>
          <div className="footer-link-list">
            {utilityLinks.map((entry) => (
              <LinkButton
                key={entry.label}
                label={entry.label}
                onClick={getLinkHandler(entry)}
              />
            ))}
          </div>
        </section>

        <section>
          <h4 className="footer-title">{footer.stayConnectedTitle}</h4>
          <p className="footer-news-copy">{footer.stayConnectedText}</p>
          <form className="newsletter-form" onSubmit={onNewsletterSubmit}>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(event) => onNewsletterEmailChange(event.target.value)}
              placeholder={footer.emailPlaceholder}
              required
            />
            <button
              type="submit"
              className="newsletter-submit"
              aria-label="Submit newsletter"
            >
              <ArrowIcon />
            </button>
          </form>
          {newsletterStatus.message ? (
            <p className={`form-state ${newsletterStatus.type}`}>
              {newsletterStatus.message}
            </p>
          ) : null}

          <div className="footer-socials">
            {socialLinks.map((entry) => {
              const Icon = SOCIAL_ICONS[entry.platform] || XIcon;
              return (
                <a
                  key={`${entry.platform}-${entry.href}`}
                  className="footer-social-btn"
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={entry.label}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        </section>
      </div>

      <div className="footer-bottom content-shell">
        <span>{footer.copyright}</span>
        <span>
          {footer.creditPrefix} {footer.creditBrand} {footer.creditHandle}
        </span>
      </div>
    </footer>
  );
}
