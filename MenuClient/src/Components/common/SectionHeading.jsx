import './SectionHeading.css';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  reveal = 'up',
  delay = 0,
}) {
  return (
    <div
      className={`section-heading section-heading--${align}`}
      data-reveal={reveal}
      style={delay ? { '--reveal-delay': `${delay}ms` } : undefined}
    >
      <span className="section-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
