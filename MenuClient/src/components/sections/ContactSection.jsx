import { SectionHeading } from '../common/SectionHeading.jsx';

export function ContactSection({ contact, contactForm, onContactFormChange, onContactSubmit, contactStatus }) {
  const changeField = (field) => (event) => onContactFormChange(field, event.target.value);

  return (
    <section className="content-shell section contact-layout" id="contact">
      <div className="contact-panel">
        <SectionHeading eyebrow={contact.eyebrow} title={contact.title} sideText={contact.description} />
        <form className="contact-form" onSubmit={onContactSubmit}>
          <input type="text" value={contactForm.name} onChange={changeField('name')} placeholder={contact.namePlaceholder} required />
          <input
            type="email"
            value={contactForm.email}
            onChange={changeField('email')}
            placeholder={contact.emailPlaceholder}
            required
          />
          <input
            type="text"
            value={contactForm.phone}
            onChange={changeField('phone')}
            placeholder={contact.phonePlaceholder}
          />
          <input
            type="text"
            value={contactForm.subject}
            onChange={changeField('subject')}
            placeholder={contact.subjectPlaceholder}
            required
          />
          <textarea
            rows={5}
            value={contactForm.message}
            onChange={changeField('message')}
            placeholder={contact.messagePlaceholder}
            required
          />
          <button type="submit" className="btn-primary">
            {contact.submitButton}
          </button>
          {contactStatus.message ? <p className={`form-state ${contactStatus.type}`}>{contactStatus.message}</p> : null}
        </form>
      </div>
    </section>
  );
}
