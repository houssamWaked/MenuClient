import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="section-space container">
      <h1>Page not found.</h1>
      <p>This page does not exist.</p>
      <Link to="/">Go back home</Link>
    </section>
  );
}
