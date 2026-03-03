import { siteCopy, testimonials } from '../../constants/string.js';
import { TestimonialCard } from '../cards/TestimonialCard.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './TestimonialsSection.css';

export function TestimonialsSection() {
  return (
    <section className="paper-section paper-section--tight" id="reviews">
      <div className="container">
        <SectionHeading
          eyebrow={siteCopy.testimonialsEyebrow}
          title={siteCopy.testimonialsTitle}
        />

        <div className="testimonial-feature" data-reveal="up">
          <p>{testimonials[0].quote}</p>
          <strong>{testimonials[0].name}</strong>
          <span className="stars" aria-label="Five star rating">
            {'\u2605\u2605\u2605\u2605\u2605'}
          </span>
        </div>

        <div className="testimonial-grid" data-stagger>
          {testimonials.slice(1).map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
