import './SocialIcon.css';

export function SocialIcon({ icon }) {
  return (
    <a
      className="social-link"
      href={icon.href}
      aria-label={icon.label}
      target="_blank"
      rel="noreferrer"
    >
      <svg viewBox={icon.viewBox} aria-hidden="true">
        <path d={icon.path} />
      </svg>
    </a>
  );
}
