import { useState } from 'react';
import { api } from '../../api/api.js';
import { useSiteDataContext } from '../../context/SiteDataContext.jsx';
import { Reveal } from '../common/Reveal.jsx';
import { SectionHeading } from '../common/SectionHeading.jsx';
import './ContactSection.css';

export function ContactSection({ contact }) {
  const { tenantSlug, data } = useSiteDataContext();
  const [status, setStatus] = useState('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const locations = data?.locations ?? [];

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    try {
      await api.submitContact(tenantSlug, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="contact-section section-space container">
      <div className="contact-section__left">
        <SectionHeading align="left" eyebrow={contact?.eyebrow} title={contact?.title} />
        <p>{contact?.description}</p>

        <div className="contact-section__locations">
          {locations.map((location) => (
            <Reveal className="contact-section__location-card" key={location.id}>
              <h3>{location.name}</h3>
              <p>{location.address}</p>
              {location.phone ? <a href={`tel:${location.phone.replace(/\s+/g, '')}`}>{location.phone}</a> : null}
              {location.email ? <a href={`mailto:${location.email}`}>{location.email}</a> : null}
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal as="form" className="contact-section__form" onSubmit={onSubmit}>
        <input
          onChange={(event) => setForm((state) => ({ ...state, name: event.target.value }))}
          placeholder={contact?.namePlaceholder ?? 'Your name'}
          required
          type="text"
          value={form.name}
        />
        <input
          onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))}
          placeholder={contact?.emailPlaceholder ?? 'Your email'}
          required
          type="email"
          value={form.email}
        />
        <input
          onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))}
          placeholder="Phone"
          type="text"
          value={form.phone}
        />
        <input
          onChange={(event) => setForm((state) => ({ ...state, subject: event.target.value }))}
          placeholder={contact?.subjectPlaceholder ?? 'Subject'}
          required
          type="text"
          value={form.subject}
        />
        <textarea
          minLength={10}
          onChange={(event) => setForm((state) => ({ ...state, message: event.target.value }))}
          placeholder={contact?.messagePlaceholder ?? 'Write your message'}
          required
          rows={6}
          value={form.message}
        />
        <button disabled={status === 'loading'} type="submit">
          {status === 'loading' ? 'Sending...' : contact?.submitButton ?? 'Send Message'}
        </button>
        {status === 'success' ? <small>Message sent successfully.</small> : null}
        {status === 'error' ? <small>Could not send your message.</small> : null}
      </Reveal>
    </section>
  );
}
