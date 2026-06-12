import React from 'react';

const NOTIFY_EMAIL = 'amcoto@umich.edu';

export default function HomeContactForm() {
  const [status, setStatus] = React.useState('idle');
  const [error, setError] = React.useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get('email')?.toString().trim();
    if (!email) return;

    setStatus('sending');
    setError('');

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(NOTIFY_EMAIL)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            email,
            _subject: 'MeterZero waitlist signup',
            _captcha: false,
            message: `New waitlist signup: ${email}`,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok || data.success !== 'true') {
        throw new Error(data.message || 'Submit failed');
      }

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
      setError('Could not submit right now. Please try again or email us directly.');
    }
  };

  return (
    <form className="home-section-contact-form" onSubmit={handleSubmit} noValidate>
      <label className="home-section-contact-label" htmlFor="contact-email">Email</label>
      <input
        id="contact-email"
        className="home-section-contact-input"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@company.com"
        required
        disabled={status === 'sending'}
      />
      <button
        type="submit"
        className="home-section-contact-submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? 'Sending…' : 'Join the waitlist'}
        <i className="hn hn-arrow-right home-section-contact-icon" aria-hidden="true" />
      </button>
      <p
        className={
          'home-section-contact-status'
          + (status === 'success' ? ' home-section-contact-status--success' : '')
          + (status === 'error' ? ' home-section-contact-status--error' : '')
        }
        role={status === 'success' || status === 'error' ? 'status' : undefined}
        aria-live="polite"
      >
        {status === 'success' ? "Thanks — you're on the list." : status === 'error' ? error : ''}
      </p>
    </form>
  );
}
