// CaseStudies.jsx — case study cards
function CaseStudies({ onOpen }) {
  const cases = [
    { id: 'northwind', client: 'Northwind Labs', sector: 'Fintech · Series B', title: 'A weekly review the CEO actually reads', stat: '38%', statLabel: 'activation lift', weeks: 12 },
    { id: 'loop', client: 'Loop', sector: 'B2B SaaS · Series A', title: 'From 47 metrics to six that matter', stat: '6', statLabel: 'metrics in the new WBR', weeks: 8 },
    { id: 'patternly', client: 'Patternly', sector: 'Consumer · Seed', title: 'The activation step nobody noticed', stat: '2.4×', statLabel: 'd7 retention', weeks: 10 },
  ];
  return (
    <section style={{ padding: '96px 32px', background: '#F5F0E8' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F3734F', marginBottom: 12 }}>Case studies</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 48, letterSpacing: '-0.02em', color: '#1A1A1A', margin: 0 }}>Recent work</h2>
          </div>
          <a href="#" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#1A1A1A', textDecoration: 'none', display: 'inline-flex', gap: 6 }}>
            All case studies <span style={{ color: '#F3734F' }}>→</span>
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {cases.map((c) => (
            <article key={c.id} onClick={() => onOpen && onOpen(c.id)} style={{
              background: '#FFFFFF', border: '1px solid rgba(26,26,26,0.10)',
              borderRadius: 10, padding: 28, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: 12,
              transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,26,26,0.10), 0 2px 4px rgba(26,26,26,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#807C72' }}>{c.sector}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, lineHeight: 1.2, color: '#1A1A1A', margin: '4px 0 0', letterSpacing: '-0.015em' }}>{c.title}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(26,26,26,0.08)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 36, color: '#F3734F', letterSpacing: '-0.025em', lineHeight: 1 }}>{c.stat}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: '#4A4944', flex: 1 }}>{c.statLabel}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: '#807C72' }}>{c.client} · {c.weeks} weeks</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

window.CaseStudies = CaseStudies;
