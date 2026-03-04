import { Reveal } from '../common/Reveal.jsx';
import './AboutPreviewSection.css';

export function AboutPreviewSection({ about }) {
  return (
    <section className="about-preview section-space container">
      <div className="about-preview__media">
        {about?.primaryImage ? <img alt={about?.title ?? 'About'} className="about-preview__primary" src={about.primaryImage} /> : null}
        {about?.secondaryImage ? <img alt={about?.eyebrow ?? 'Kitchen'} className="about-preview__secondary" src={about.secondaryImage} /> : null}
      </div>

      <Reveal as="article" className="about-preview__content">
        <p>{about?.eyebrow}</p>
        <h2>{about?.title}</h2>
        <div>{about?.description}</div>
        {about?.signature ? <span>{about.signature}</span> : null}
      </Reveal>
    </section>
  );
}
