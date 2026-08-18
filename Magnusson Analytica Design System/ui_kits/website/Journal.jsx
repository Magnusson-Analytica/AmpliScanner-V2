// Journal.jsx — recent posts
function Journal() {
  const posts = [
    { date: 'Apr 2026', read: '6 min', title: 'The activation question you\'re not asking', kicker: 'On finding the moment users decide to stay.' },
    { date: 'Mar 2026', read: '4 min', title: 'Why your WBR has 47 metrics (and what to cut)', kicker: 'A short, opinionated audit you can run today.' },
    { date: 'Feb 2026', read: '9 min', title: 'Cohorts, honestly', kicker: 'Most cohort charts lie. Here are the three that don\'t.' },
  ];
  return (
    <section style={{ padding: '96px 32px', background: '#EDE6D8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F3734F', marginBottom: 12 }}>From the journal</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 48, letterSpacing: '-0.02em', color: '#1A1A1A', margin: 0 }}>Recent writing</h2>
          </div>
          <a href="#" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#1A1A1A', textDecoration: 'none', display: 'inline-flex', gap: 6 }}>
            All entries <span style={{ color: '#F3734F' }}>→</span>
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {posts.map((p, i) => (
            <a key={i} href="#" style={{
              padding: '24px 28px 28px',
              borderTop: '1px solid rgba(26,26,26,0.18)',
              borderRight: i < 2 ? '1px solid rgba(26,26,26,0.10)' : 'none',
              textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12,
              transition: 'background 140ms',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(245,240,232,0.6)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, color: '#807C72', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
                {p.date} · {p.read} read
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, color: '#1A1A1A', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.2 }}>{p.title}</h3>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: '#4A4944', margin: 0, lineHeight: 1.55 }}>{p.kicker}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Journal = Journal;
