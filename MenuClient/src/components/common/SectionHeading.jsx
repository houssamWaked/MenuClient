import './SectionHeading.css';

export function SectionHeading({ eyebrow, title, align = 'center' }) {
  return (
    <header className={`section-heading section-heading--${align}`}>
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
      {title ? <h2 className="section-heading__title">{title}</h2> : null}
    </header>
  );
}
