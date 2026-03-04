import { useSiteData } from '../../context/site-data-context.js';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './AboutSection.css';

export function AboutSection() {
  const { siteContent } = useSiteData();
  const about = siteContent?.about ?? {};

  return (
    <section
      className="paper-section paper-section--tight about-section"
      id="about"
    >
      <div className="container about-grid">
        <div className="about-collage" data-reveal="left">
          <img
            className="about-collage__primary"
            src={about.primaryImage ?? ''}
            alt="Portrait of a chef"
            loading="lazy"
          />
        </div>

        <div className="about-copy" data-reveal="right">
          <SectionHeading
            eyebrow={about.eyebrow ?? ''}
            title={about.title ?? ''}
            align="left"
          />
          <p className="about-copy__text">{about.description ?? ''}</p>
          <p className="about-copy__signature">{about.signature ?? ''}</p>
        </div>
      </div>
    </section>
  );
}
