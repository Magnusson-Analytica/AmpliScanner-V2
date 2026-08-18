// Header.jsx — Magnusson Analytica marketing site header
function Header({ onNav }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: scrolled ? 'rgba(245, 240, 232, 0.86)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(26,26,26,0.08)' : '1px solid transparent',
      transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '18px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="#" onClick={(e) => { e.preventDefault(); onNav('home'); }}
           style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="../../assets/logo-mark-cream.png" alt="" style={{ width: 32, height: 32, display: 'block' }} />
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
            color: '#1A1A1A', letterSpacing: '-0.015em',
          }}>Magnusson Analytica</span>
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[
            ['What we do', 'work'],
            ['Case studies', 'cases'],
            ['Journal', 'journal'],
            ['About', 'about'],
          ].map(([label, key]) => (
            <a key={key} href="#" onClick={(e) => { e.preventDefault(); onNav(key); }}
               style={{
                 fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14,
                 color: '#1A1A1A', textDecoration: 'none',
               }}
               onMouseEnter={(e) => e.currentTarget.style.color = '#F3734F'}
               onMouseLeave={(e) => e.currentTarget.style.color = '#1A1A1A'}>
              {label}
            </a>
          ))}
          <a href="#" onClick={(e) => { e.preventDefault(); onNav('contact'); }}
             style={{
               fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14,
               color: '#1A1A1A', background: '#F3734F',
               padding: '9px 16px', borderRadius: 6, textDecoration: 'none',
               display: 'inline-flex', alignItems: 'center', gap: 6,
             }}>
            Start a project <span>→</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

window.Header = Header;
