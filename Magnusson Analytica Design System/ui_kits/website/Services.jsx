// Services.jsx — what we do
function Services() {
  const services = [
    { n: '01', title: 'Metric architecture', body: 'We define the north-star, the input metrics that move it, and the weekly cadence that holds them accountable.' },
    { n: '02', title: 'Activation & retention', body: 'Find the moment users decide to stay — then engineer the path to it. Cohorts, funnels, and the awkward truth.' },
    { n: '03', title: 'Experimentation systems', body: 'Stand up the pipes, the review, and the discipline so your team can run tests without us in the room.' },
    { n: '04', title: 'Executive review design', body: 'Six numbers your CEO will read every Monday. Built around your business, not a template.' },
  ];
  return (
    <section style={{ background: '#1A1A1A', padding: '96px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F3734F', marginBottom: 16 }}>What we do</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 48, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#F5F0E8', margin: 0 }}>
              Four practices.<br/>One discipline.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px 48px' }}>
            {services.map((s) => (
              <div key={s.n} style={{ borderTop: '1px solid rgba(245,240,232,0.18)', paddingTop: 20 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 13, color: '#F3734F', letterSpacing: '0.06em' }}>№ {s.n}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 24, color: '#F5F0E8', margin: '8px 0 10px', letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, lineHeight: 1.6, color: '#C9C2B4', margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Services = Services;
