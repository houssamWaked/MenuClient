import { Reveal } from '../common/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './AboutDetailsSection.css';

export function AboutDetailsSection({ about, team }) {
  const detailParagraphs = Array.isArray(about?.detailParagraphs) ? about.detailParagraphs : [];
  const storyParagraphs = Array.isArray(about?.storyParagraphs) ? about.storyParagraphs : [];
  const values = Array.isArray(about?.values) ? about.values : [];
  const process = Array.isArray(about?.process) ? about.process : [];
  const stats = Array.isArray(about?.stats) ? about.stats : [];
  const members = Array.isArray(team) ? team : [];

  return (
    <section className="about-details section-space container">
      <div className="about-details__intro-grid">
        <Reveal className="about-details__panel">
          <SectionHeading align="left" eyebrow={about?.detailEyebrow} title={about?.detailTitle} />
          {detailParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal className="about-details__panel" delay={90}>
          <SectionHeading align="left" eyebrow={about?.storyEyebrow} title={about?.storyTitle} />
          {storyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {about?.storyImage ? <img alt={about.storyTitle ?? 'Story'} src={about.storyImage} /> : null}
        </Reveal>
      </div>

      {stats.length ? (
        <div className="about-details__stats">
          {stats.map((stat) => (
            <Reveal className="about-details__stat" key={`${stat.label}-${stat.value}`}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </Reveal>
          ))}
        </div>
      ) : null}

      {values.length ? (
        <div className="about-details__group">
          <SectionHeading align="left" eyebrow={about?.valuesEyebrow} title={about?.valuesTitle} />
          <div className="about-details__cards">
            {values.map((value, index) => (
              <Reveal className="about-details__card" delay={index * 70} key={value.title}>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}

      {process.length ? (
        <div className="about-details__group">
          <SectionHeading align="left" eyebrow={about?.processEyebrow} title={about?.processTitle} />
          <div className="about-details__process">
            {process.map((step, index) => (
              <Reveal className="about-details__process-step" delay={index * 80} key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}

      {members.length ? (
        <div className="about-details__group">
          <SectionHeading align="left" eyebrow={about?.teamEyebrow} title={about?.teamTitle} />
          <div className="about-details__team">
            {members.map((member, index) => (
              <Reveal className="about-details__member" delay={index * 60} key={member.id ?? member.name}>
                <img alt={member.name} src={member.imageUrl} />
                <div>
                  <h3>{member.name}</h3>
                  <small>{member.role}</small>
                  <p>{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
