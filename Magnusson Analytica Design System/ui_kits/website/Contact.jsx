// Contact.jsx — CTA + form
function Contact() {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', email: '', company: '', stage: 'Series A', note: '' });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  return (
    <section style={{ background: '#1A1A1A', padding: '96px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F3734F', marginBottom: 16 }}>Start a project</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 56, lineHeight: 1.05, letterSpacing: '-0.025em', color: '#F5F0E8', margin: 0 }}>
            Tell us what you're trying to figure out.
          </h2>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 18, lineHeight: 1.6, color: '#C9C2B4', margin: '24px 0 0', maxWidth: 460 }}>
            Most engagements start with a 30-minute discovery call. We'll ask sharp questions and tell you whether we're the right people for the job. No deck.
          </p>
          <div style={{ marginTop: 40, display: 'grid', gap: 12, fontFamily: 'var(--font-serif)', fontSize: 15, color: '#C9C2B4' }}>
            <div>hello@magnussonanalytica.com</div>
            <div>London · Stockholm</div>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{
          background: '#242424', border: '1px solid rgba(245,240,232,0.10)',
          borderRadius: 10, padding: 28, display: 'grid', gap: 14,
        }}>
          {sent ? (
            <div style={{ padding: '40px 12px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: '#F3734F', marginBottom: 8 }}>Got it.</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: '#C9C2B4' }}>We'll be in touch within two working days.</div>
            </div>
          ) : (
            <>
              <Field label="Your name" value={form.name} onChange={set('name')} placeholder="Alex Magnusson" />
              <Field label="Work email" value={form.email} onChange={set('email')} placeholder="alex@company.com" />
              <Field label="Company" value={form.company} onChange={set('company')} placeholder="Northwind Labs" />
              <div style={{ display: 'grid', gap: 6 }}>
                <label style={lblStyle}>Stage</label>
                <select value={form.stage} onChange={set('stage')} style={{ ...inputStyle, appearance: 'none' }}>
                  {['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Public'].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <label style={lblStyle}>What are you trying to figure out?</label>
                <textarea value={form.note} onChange={set('note')} rows={3} placeholder="A sentence or two is plenty." style={{ ...inputStyle, fontFamily: 'var(--font-serif)', resize: 'vertical' }} />
              </div>
              <button type="submit" style={{
                marginTop: 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
                color: '#1A1A1A', background: '#F3734F', padding: '14px 22px',
                borderRadius: 6, border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
              }}>
                Send <span>→</span>
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

const lblStyle = { fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, color: '#F5F0E8' };
const inputStyle = {
  fontFamily: 'var(--font-display)', fontSize: 14, color: '#F5F0E8',
  padding: '10px 12px', background: '#1A1A1A',
  border: '1px solid rgba(245,240,232,0.18)', borderRadius: 6, outline: 'none',
};

function Field({ label, ...rest }) {
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <label style={lblStyle}>{label}</label>
      <input {...rest} style={inputStyle} />
    </div>
  );
}

window.Contact = Contact;
