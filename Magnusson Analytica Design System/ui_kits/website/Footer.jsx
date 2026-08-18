// Footer.jsx
function Footer() {
  const cols = [
    { title: 'Practice', links: ['What we do', 'Engagement model', 'Pricing'] },
    { title: 'Work', links: ['Case studies', 'Clients', 'Sectors'] },
    { title: 'Writing', links: ['Journal', 'The Margin (newsletter)', 'Talks'] },
    { title: 'Firm', links: ['About', 'Careers', 'Contact'] },
  ];
  return (
    <footer style={{ background: '#1A1A1A', padding: '64px 32px 32px', borderTop: '1px solid rgba(245,240,232,0.10)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 48, marginBottom: 64 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="../../assets/logo-mark-dark.png" alt="" style={{ width: 36, height: 36 }} />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: '#F5F0E8', letterSpacing: '-0.015em' }}>Magnusson Analytica</span>
            </div>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1.6, color: '#C9C2B4', maxWidth: 320, marginTop: 16 }}>
              A boutique product-analytics consultancy. We work with a small number of teams at a time.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F3734F', marginBottom: 16 }}>{c.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
                {c.links.map((l) => (
                  <li key={l}><a href="#" style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#F5F0E8', textDecoration: 'none' }}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(245,240,232,0.10)', fontFamily: 'var(--font-display)', fontSize: 12, color: '#8A867C' }}>
          <span>© 2026 Magnusson Analytica Ltd.</span>
          <span>London · Stockholm</span>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
