import { mediaLibrary, siteCopy } from '../../constants/string.js';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './AboutSection.css';

export function AboutSection() {
  return (
    <section
      className="paper-section paper-section--tight about-section"
      id="about"
    >
      <div className="container about-grid">
        <div className="about-collage" data-reveal="left">
          <img
            className="about-collage__primary"
            src={mediaLibrary.aboutPrimary}
            alt="Portrait of a chef"
            loading="lazy"
          />
        </div>

        <div className="about-copy" data-reveal="right">
          <SectionHeading
            eyebrow={siteCopy.aboutEyebrow}
            title={siteCopy.aboutTitle}
            align="left"
          />
          <p className="about-copy__text">{siteCopy.aboutDescription}</p>
          <p className="about-copy__signature">{siteCopy.aboutSignature}</p>
        </div>
      </div>
    </section>
  );
}
