export function LegalPolicySection({ eyebrow, intro, sections }) {
  if (!Array.isArray(sections) || !sections.length) return null;

  return (
    <section className="content-shell section legal-page-wrap">
      <div className="legal-page-intro">
        <span className="eyebrow">{eyebrow}</span>
        <p>{intro}</p>
      </div>

      <div className="legal-page-grid">
        {sections.map((section) => (
          <article className="legal-card" key={section.title}>
            <h2>{section.title}</h2>
            <div className="legal-card-copy">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
