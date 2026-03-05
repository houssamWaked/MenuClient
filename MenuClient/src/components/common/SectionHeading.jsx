export function SectionHeading({ eyebrow, title, sideText }) {
  return (
    <div className="section-heading">
      <div className="section-heading-main">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      <p>{sideText}</p>
    </div>
  );
}
