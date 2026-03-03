import { SiteFooter } from '../Components/layout/SiteFooter.jsx';
import { SiteHeader } from '../Components/layout/SiteHeader.jsx';
import { mediaLibrary, siteCopy } from '../constants/string.js';
import { useLandingData } from '../hooks/useLandingData.js';
import './AboutPage.css';

const aboutStats = [
  { value: '12+', label: 'Signature burgers on rotation' },
  { value: '8', label: 'Years refining the grill line' },
  { value: '200+', label: 'Guests served on a busy weekend' },
];

const aboutValues = [
  {
    title: 'Flavor with structure',
    description:
      'Every burger is built for contrast: crust against melt, acid against fat, and crunch against softness.',
  },
  {
    title: 'Speed without shortcuts',
    description:
      'Our kitchen moves fast because the system is sharp, not because we lower the standard when tickets pile up.',
  },
  {
    title: 'A room people return to',
    description:
      'We care about the full experience, from the lighting and playlist to the way the tray lands on the table.',
  },
];

const kitchenSteps = [
  {
    title: 'Prep With Purpose',
    description:
      'Ingredients are selected for service performance, not just appearance. We prep for speed, consistency, and clean assembly.',
  },
  {
    title: 'Hit The Heat',
    description:
      'Our grill work is built around aggressive browning, clear seasoning, and timing that protects both crust and juice.',
  },
  {
    title: 'Build The Stack',
    description:
      'Buns, sauces, greens, cheese, and crunch are layered to keep the burger balanced from the first bite to the last.',
  },
  {
    title: 'Send With Intent',
    description:
      'Nothing leaves the pass until it looks tight, eats cleanly, and feels worth remembering after the table clears.',
  },
];

const teamMembers = [
  {
    name: 'Marco Hale',
    role: 'Head Chef',
    bio: 'Owns the grill line, final seasoning, and the burger builds that define the house signature.',
    imageUrl:
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Nina Laurent',
    role: 'Pastry And Bun Lead',
    bio: 'Focuses on bread texture, toast level, and the soft structure that keeps every burger together.',
    imageUrl:
      'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Elias Ward',
    role: 'Kitchen Operations',
    bio: 'Keeps the line disciplined during rushes and makes sure quality holds when the pace climbs.',
    imageUrl:
      'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Sofia Quinn',
    role: 'Hospitality Director',
    bio: 'Shapes the dining room energy, guest flow, and the details that make the brand feel personal.',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
  },
];

export function AboutPage() {
  const pageData = useLandingData();
  const tenantName = pageData.tenant?.name ?? 'Burger Bachelor';

  return (
    <div className="site-shell about-page-shell">
      <header
        className="about-page-hero"
        style={{ '--about-banner-image': `url(${mediaLibrary.aboutBanner})` }}
      >
        <div className="about-page-hero__overlay" />
        <div className="container about-page-hero__container">
          <SiteHeader tenantName={tenantName} />
          <div className="about-page-hero__body" data-reveal="up">
            <h1>{siteCopy.aboutPageHeroTitle}</h1>
          </div>
        </div>
      </header>

      <main>
        <section className="paper-section about-detail-section">
          <div className="container about-detail-grid">
            <div className="about-detail-copy" data-reveal="left">
              <span className="section-eyebrow">Our Philosophy</span>
              <h2>A burger house built on rhythm, heat, and hospitality</h2>
              <p>
                Burger Bachelor was built around a simple standard: if a burger is going to be the
                center of the table, it should feel deliberate. That means more than quality beef.
                It means sharper preparation, tighter layering, and a kitchen that understands how
                flavor, texture, and timing need to land together.
              </p>
              <p>
                We are not trying to make the tallest stack in the city. We are trying to make the
                most complete one. Crust matters. Melt matters. The bun matters. The room matters.
                All of those choices add up to a place that feels energetic, consistent, and easy
                to come back to.
              </p>
            </div>

            <div className="about-stats-panel" data-stagger>
              {aboutStats.map((stat) => (
                <article key={stat.label} className="about-stat-card" data-reveal="up">
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
              <img src={mediaLibrary.aboutPrimary} alt="Chef working service" loading="lazy" />
            </div>

            <div className="about-story-copy" data-reveal="right">
              <span className="section-eyebrow">Inside The Brand</span>
              <h2>What makes the kitchen feel different</h2>
              <p>
                The line is designed to move with intention. Prep stays clean, station roles stay
                clear, and every burger is built to survive real service pressure without losing
                structure. That is where consistency comes from.
              </p>
              <p>
                We also care about how the place feels beyond the plate. A burger spot should have
                atmosphere, momentum, and visual identity. We want the room, the team, and the food
                to read as one system instead of separate parts.
              </p>
            </div>
          </div>
        </section>

        <section className="paper-section paper-section--tight about-values-section">
          <div className="container">
            <div className="about-values-heading">
              <span className="section-eyebrow">Why We Stand Out</span>
              <h2>What shapes the Burger Bachelor experience</h2>
            </div>

            <div className="about-values-grid" data-stagger>
              {aboutValues.map((value) => (
                <article key={value.title} className="about-value-card" data-reveal="up">
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="paper-section paper-section--tight about-process-section">
          <div className="container">
            <div className="about-values-heading about-values-heading--left">
              <span className="section-eyebrow">Kitchen Process</span>
              <h2>How a burger moves through our line</h2>
            </div>

            <div className="about-process-grid" data-stagger>
              {kitchenSteps.map((step, index) => (
                <article key={step.title} className="about-process-card" data-reveal="up">
                  <span className="about-process-card__index">{`0${index + 1}`}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="paper-section paper-section--tight team-section">
          <div className="container">
            <div className="about-values-heading">
              <span className="section-eyebrow">Meet The Team</span>
              <h2>The people behind the pass and the dining room</h2>
            </div>

            <div className="team-grid" data-stagger>
              {teamMembers.map((member) => (
                <article key={member.name} className="team-card" data-reveal="up">
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
      </main>

      <SiteFooter />
    </div>
  );
}
