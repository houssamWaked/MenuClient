import './TestimonialCard.css';

export function TestimonialCard({ testimonial }) {
  return (
    <article className="testimonial-card" data-reveal="up">
      <p>{testimonial.quote}</p>
      <strong>{testimonial.name}</strong>
    </article>
  );
}
