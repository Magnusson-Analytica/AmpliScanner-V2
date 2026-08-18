// Quote.jsx — pull quote section
function Quote() {
  return (
    <section style={{ padding: '96px 32px', background: '#F5F0E8' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#F3734F', marginBottom: 24 }}>What clients say</div>
        <blockquote style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 36, lineHeight: 1.35, color: '#1A1A1A',
          margin: 0, letterSpacing: '-0.005em',
        }}>
          "They didn't sell us a framework. They sat in our review for three weeks and then quietly rebuilt it. Our Monday meeting is forty minutes shorter and we actually decide things."
        </blockquote>
        <div style={{ marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#1A1A1A', color: '#F3734F', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>RB</div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>Rohan Bhatt</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: '#807C72' }}>VP Product, Northwind Labs</div>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Quote = Quote;
