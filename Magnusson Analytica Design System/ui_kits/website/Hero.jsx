// Hero.jsx — editorial hero
function Hero({ onNav }) {
  return (
    <section style={{ padding: '64px 32px 96px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#F3734F', marginBottom: 24,
      }}>
        Product analytics consultancy · est. 2021
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'clamp(48px, 7vw, 88px)', lineHeight: 1.02,
        letterSpacing: '-0.025em', color: '#1A1A1A',
        margin: 0, maxWidth: 980,
      }}>
        Analytics that<br/>earn their keep.
      </h1>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80,
        marginTop: 56, alignItems: 'start',
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-serif)', fontWeight: 400,
            fontSize: 22, lineHeight: 1.5, color: '#4A4944',
            margin: 0, maxWidth: 520,
          }}>
            We help product teams find the metric that moves the business — and the system to move it weekly. No dashboards no one reads. No frameworks for the sake of frameworks.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNav('contact'); }} style={{
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
              color: '#1A1A1A', background: '#F3734F',
              padding: '14px 22px', borderRadius: 6, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Start a project <span>→</span>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNav('cases'); }} style={{
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15,
              color: '#1A1A1A', background: 'transparent',
              padding: '14px 22px', borderRadius: 6, textDecoration: 'none',
              border: '1px solid rgba(26,26,26,0.18)',
            }}>
              See our work
            </a>
          </div>
        </div>
        <div style={{ borderLeft: '1px solid rgba(26,26,26,0.12)', paddingLeft: 32 }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#807C72', marginBottom: 8 }}>Trusted by</div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#4A4944', fontSize: 18 }}>
              <span>Northwind</span>
              <span>Loop</span>
              <span>Patternly</span>
              <span>Halberd</span>
              <span>Fathom</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 48, letterSpacing: '-0.025em', color: '#F3734F', lineHeight: 1 }}>38%</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: '#4A4944', marginTop: 6, lineHeight: 1.45 }}>average activation lift after a 12-week engagement</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 48, letterSpacing: '-0.025em', color: '#1A1A1A', lineHeight: 1 }}>47</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 13, color: '#4A4944', marginTop: 6, lineHeight: 1.45 }}>product teams worked with since 2021</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
