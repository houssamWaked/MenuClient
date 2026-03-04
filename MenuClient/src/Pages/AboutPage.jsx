import { SiteFooter } from '../Components/layout/SiteFooter.jsx';
import { SiteHeader } from '../Components/layout/SiteHeader.jsx';
import { useSiteData } from '../context/site-data-context.js';
import { asArray, asTextArray } from '../utils/site-content.js';
import './AboutPage.css';

export function AboutPage() {
  const { siteContent, team } = useSiteData();
  const about = siteContent?.about ?? {};
  const theme = siteContent?.theme ?? {};
  const detailParagraphs = asTextArray(about.detailParagraphs);
  const storyParagraphs = asTextArray(about.storyParagraphs);
  const stats = asArray(about.stats);
  const values = asArray(about.values);
  const process = asArray(about.process);
  const bannerImage = theme.pageBanners?.about ?? '';
  const pageTitle = theme.pageTitles?.about ?? 'ABOUT';

  return (
    <div className="site-shell about-page-shell">
      <header
        className="about-page-hero"
        style={{ '--about-banner-image': `url(${bannerImage})` }}
      >
        <div className="about-page-hero__overlay" />
        <div className="container about-page-hero__container">
          <SiteHeader />
          <div className="about-page-hero__body" data-reveal="up">
            <h1>{pageTitle}</h1>
          </div>
        </div>
      </header>

      <main>
        <section className="paper-section about-detail-section">
          <div className="container about-detail-grid">
            <div className="about-detail-copy" data-reveal="left">
              <span className="section-eyebrow">{about.detailEyebrow ?? ''}</span>
              <h2>{about.detailTitle ?? ''}</h2>
              {detailParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="about-stats-panel" data-stagger>
              {stats.map((stat) => (
                <article key={`${stat.label}-${stat.value}`} className="about-stat-card" data-reveal="up">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="paper-section paper-section--tight about-story-section">
          <div className="container about-story-grid">
            <div className="about-story-visual" data-reveal="left">
              <img src={about.storyImage ?? about.primaryImage ?? ''} alt="Chef working service" loading="lazy" />
            </div>

            <div className="about-story-copy" data-reveal="right">
              <span className="section-eyebrow">{about.storyEyebrow ?? ''}</span>
              <h2>{about.storyTitle ?? ''}</h2>
              {storyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        {values.length > 0 ? (
          <section className="paper-section paper-section--tight about-values-section">
            <div className="container">
              <div className="about-values-heading">
                <span className="section-eyebrow">{about.valuesEyebrow ?? ''}</span>
                <h2>{about.valuesTitle ?? ''}</h2>
              </div>

              <div className="about-values-grid" data-stagger>
                {values.map((value) => (
                  <article key={value.title} className="about-value-card" data-reveal="up">
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {process.length > 0 ? (
          <section className="paper-section paper-section--tight about-process-section">
            <div className="container">
              <div className="about-values-heading about-values-heading--left">
                <span className="section-eyebrow">{about.processEyebrow ?? ''}</span>
                <h2>{about.processTitle ?? ''}</h2>
              </div>

              <div className="about-process-grid" data-stagger>
                {process.map((step, index) => (
                  <article key={step.title} className="about-process-card" data-reveal="up">
                    <span className="about-process-card__index">{`0${index + 1}`}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {team.length > 0 ? (
          <section className="paper-section paper-section--tight team-section">
            <div className="container">
              <div className="about-values-heading">
                <span className="section-eyebrow">{about.teamEyebrow ?? ''}</span>
                <h2>{about.teamTitle ?? ''}</h2>
              </div>

              <div className="team-grid" data-stagger>
                {team.map((member) => (
                  <article key={member.id} className="team-card" data-reveal="up">
                    <img src={member.imageUrl} alt={member.name} loading="lazy" />
                    <div className="team-card__body">
                      <span>{member.role}</span>
                      <h3>{member.name}</h3>
                      <p>{member.bio}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
