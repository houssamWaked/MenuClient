import { Reveal } from '../common/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './TestimonialsSection.css';

export function TestimonialsSection({ testimonials, theme }) {
  const entries = Array.isArray(testimonials) ? testimonials : [];

  if (!entries.length) {
    return null;
  }

  return (
    <section className="testimonials section-space container">
      <SectionHeading eyebrow={theme?.testimonialsEyebrow} title={theme?.testimonialsTitle} />
      <div className="testimonials__grid">
        {entries.map((entry, index) => (
          <Reveal className="testimonials__card" delay={index * 70} key={`${entry.name}-${index}`}>
            <p>"{entry.quote}"</p>
            <strong>{entry.name}</strong>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
