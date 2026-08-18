/* @ds-bundle: {"format":4,"namespace":"MagnussonAnalyticaDesignSystem_71d9d2","components":[],"sourceHashes":{"ui_kits/website/CaseStudies.jsx":"f3789d6c0dc0","ui_kits/website/Contact.jsx":"06f64eed1110","ui_kits/website/Footer.jsx":"a61e6bab3700","ui_kits/website/Header.jsx":"55a793259c99","ui_kits/website/Hero.jsx":"a7c6d2f7a12a","ui_kits/website/Journal.jsx":"43842e71659f","ui_kits/website/Quote.jsx":"d8572b92f1a2","ui_kits/website/Services.jsx":"192c28c0dbeb"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MagnussonAnalyticaDesignSystem_71d9d2 = window.MagnussonAnalyticaDesignSystem_71d9d2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/website/CaseStudies.jsx
try { (() => {
// CaseStudies.jsx — case study cards
function CaseStudies({
  onOpen
}) {
  const cases = [{
    id: 'northwind',
    client: 'Northwind Labs',
    sector: 'Fintech · Series B',
    title: 'A weekly review the CEO actually reads',
    stat: '38%',
    statLabel: 'activation lift',
    weeks: 12
  }, {
    id: 'loop',
    client: 'Loop',
    sector: 'B2B SaaS · Series A',
    title: 'From 47 metrics to six that matter',
    stat: '6',
    statLabel: 'metrics in the new WBR',
    weeks: 8
  }, {
    id: 'patternly',
    client: 'Patternly',
    sector: 'Consumer · Seed',
    title: 'The activation step nobody noticed',
    stat: '2.4×',
    statLabel: 'd7 retention',
    weeks: 10
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 32px',
      background: '#F5F0E8'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#F3734F',
      marginBottom: 12
    }
  }, "Case studies"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 48,
      letterSpacing: '-0.02em',
      color: '#1A1A1A',
      margin: 0
    }
  }, "Recent work")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      color: '#1A1A1A',
      textDecoration: 'none',
      display: 'inline-flex',
      gap: 6
    }
  }, "All case studies ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#F3734F'
    }
  }, "\u2192"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, cases.map(c => /*#__PURE__*/React.createElement("article", {
    key: c.id,
    onClick: () => onOpen && onOpen(c.id),
    style: {
      background: '#FFFFFF',
      border: '1px solid rgba(26,26,26,0.10)',
      borderRadius: 10,
      padding: 28,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,26,26,0.10), 0 2px 4px rgba(26,26,26,0.04)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#807C72'
    }
  }, c.sector), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 1.2,
      color: '#1A1A1A',
      margin: '4px 0 0',
      letterSpacing: '-0.015em'
    }
  }, c.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 12,
      marginTop: 'auto',
      paddingTop: 24,
      borderTop: '1px solid rgba(26,26,26,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 36,
      color: '#F3734F',
      letterSpacing: '-0.025em',
      lineHeight: 1
    }
  }, c.stat), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 13,
      color: '#4A4944',
      flex: 1
    }
  }, c.statLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      color: '#807C72'
    }
  }, c.client, " \xB7 ", c.weeks, " weeks"))))));
}
window.CaseStudies = CaseStudies;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/CaseStudies.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Contact.jsx — CTA + form
function Contact() {
  const [sent, setSent] = React.useState(false);
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    company: '',
    stage: 'Series A',
    note: ''
  });
  const set = k => e => setForm({
    ...form,
    [k]: e.target.value
  });
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#1A1A1A',
      padding: '96px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#F3734F',
      marginBottom: 16
    }
  }, "Start a project"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 56,
      lineHeight: 1.05,
      letterSpacing: '-0.025em',
      color: '#F5F0E8',
      margin: 0
    }
  }, "Tell us what you're trying to figure out."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 18,
      lineHeight: 1.6,
      color: '#C9C2B4',
      margin: '24px 0 0',
      maxWidth: 460
    }
  }, "Most engagements start with a 30-minute discovery call. We'll ask sharp questions and tell you whether we're the right people for the job. No deck."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: 'grid',
      gap: 12,
      fontFamily: 'var(--font-serif)',
      fontSize: 15,
      color: '#C9C2B4'
    }
  }, /*#__PURE__*/React.createElement("div", null, "hello@magnussonanalytica.com"), /*#__PURE__*/React.createElement("div", null, "London \xB7 Stockholm"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      background: '#242424',
      border: '1px solid rgba(245,240,232,0.10)',
      borderRadius: 10,
      padding: 28,
      display: 'grid',
      gap: 14
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 12px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 24,
      color: '#F3734F',
      marginBottom: 8
    }
  }, "Got it."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 16,
      color: '#C9C2B4'
    }
  }, "We'll be in touch within two working days.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
    label: "Your name",
    value: form.name,
    onChange: set('name'),
    placeholder: "Alex Magnusson"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Work email",
    value: form.email,
    onChange: set('email'),
    placeholder: "alex@company.com"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Company",
    value: form.company,
    onChange: set('company'),
    placeholder: "Northwind Labs"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lblStyle
  }, "Stage"), /*#__PURE__*/React.createElement("select", {
    value: form.stage,
    onChange: set('stage'),
    style: {
      ...inputStyle,
      appearance: 'none'
    }
  }, ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Public'].map(s => /*#__PURE__*/React.createElement("option", {
    key: s
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lblStyle
  }, "What are you trying to figure out?"), /*#__PURE__*/React.createElement("textarea", {
    value: form.note,
    onChange: set('note'),
    rows: 3,
    placeholder: "A sentence or two is plenty.",
    style: {
      ...inputStyle,
      fontFamily: 'var(--font-serif)',
      resize: 'vertical'
    }
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    style: {
      marginTop: 8,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      color: '#1A1A1A',
      background: '#F3734F',
      padding: '14px 22px',
      borderRadius: 6,
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      justifyContent: 'center'
    }
  }, "Send ", /*#__PURE__*/React.createElement("span", null, "\u2192"))))));
}
const lblStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 12,
  fontWeight: 600,
  color: '#F5F0E8'
};
const inputStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: 14,
  color: '#F5F0E8',
  padding: '10px 12px',
  background: '#1A1A1A',
  border: '1px solid rgba(245,240,232,0.18)',
  borderRadius: 6,
  outline: 'none'
};
function Field({
  label,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: lblStyle
  }, label), /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    style: inputStyle
  })));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// Footer.jsx
function Footer() {
  const cols = [{
    title: 'Practice',
    links: ['What we do', 'Engagement model', 'Pricing']
  }, {
    title: 'Work',
    links: ['Case studies', 'Clients', 'Sectors']
  }, {
    title: 'Writing',
    links: ['Journal', 'The Margin (newsletter)', 'Talks']
  }, {
    title: 'Firm',
    links: ['About', 'Careers', 'Contact']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: '#1A1A1A',
      padding: '64px 32px 32px',
      borderTop: '1px solid rgba(245,240,232,0.10)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: 48,
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-dark.png",
    alt: "",
    style: {
      width: 36,
      height: 36
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      color: '#F5F0E8',
      letterSpacing: '-0.015em'
    }
  }, "Magnusson Analytica")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 15,
      lineHeight: 1.6,
      color: '#C9C2B4',
      maxWidth: 320,
      marginTop: 16
    }
  }, "A boutique product-analytics consultancy. We work with a small number of teams at a time.")), cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#F3734F',
      marginBottom: 16
    }
  }, c.title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: 10
    }
  }, c.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: l
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 14,
      color: '#F5F0E8',
      textDecoration: 'none'
    }
  }, l))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 24,
      borderTop: '1px solid rgba(245,240,232,0.10)',
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      color: '#8A867C'
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Magnusson Analytica Ltd."), /*#__PURE__*/React.createElement("span", null, "London \xB7 Stockholm"))));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Header.jsx
try { (() => {
// Header.jsx — Magnusson Analytica marketing site header
function Header({
  onNav
}) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: scrolled ? 'rgba(245, 240, 232, 0.86)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(26,26,26,0.08)' : '1px solid transparent',
      transition: 'all 220ms cubic-bezier(0.22,1,0.36,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '18px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('home');
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-cream.png",
    alt: "",
    style: {
      width: 32,
      height: 32,
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 18,
      color: '#1A1A1A',
      letterSpacing: '-0.015em'
    }
  }, "Magnusson Analytica")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, [['What we do', 'work'], ['Case studies', 'cases'], ['Journal', 'journal'], ['About', 'about']].map(([label, key]) => /*#__PURE__*/React.createElement("a", {
    key: key,
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav(key);
    },
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 14,
      color: '#1A1A1A',
      textDecoration: 'none'
    },
    onMouseEnter: e => e.currentTarget.style.color = '#F3734F',
    onMouseLeave: e => e.currentTarget.style.color = '#1A1A1A'
  }, label)), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('contact');
    },
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      color: '#1A1A1A',
      background: '#F3734F',
      padding: '9px 16px',
      borderRadius: 6,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Start a project ", /*#__PURE__*/React.createElement("span", null, "\u2192")))));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
// Hero.jsx — editorial hero
function Hero({
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '64px 32px 96px',
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#F3734F',
      marginBottom: 24
    }
  }, "Product analytics consultancy \xB7 est. 2021"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'clamp(48px, 7vw, 88px)',
      lineHeight: 1.02,
      letterSpacing: '-0.025em',
      color: '#1A1A1A',
      margin: 0,
      maxWidth: 980
    }
  }, "Analytics that", /*#__PURE__*/React.createElement("br", null), "earn their keep."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      marginTop: 56,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontWeight: 400,
      fontSize: 22,
      lineHeight: 1.5,
      color: '#4A4944',
      margin: 0,
      maxWidth: 520
    }
  }, "We help product teams find the metric that moves the business \u2014 and the system to move it weekly. No dashboards no one reads. No frameworks for the sake of frameworks."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('contact');
    },
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      color: '#1A1A1A',
      background: '#F3734F',
      padding: '14px 22px',
      borderRadius: 6,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, "Start a project ", /*#__PURE__*/React.createElement("span", null, "\u2192")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('cases');
    },
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      color: '#1A1A1A',
      background: 'transparent',
      padding: '14px 22px',
      borderRadius: 6,
      textDecoration: 'none',
      border: '1px solid rgba(26,26,26,0.18)'
    }
  }, "See our work"))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: '1px solid rgba(26,26,26,0.12)',
      paddingLeft: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#807C72',
      marginBottom: 8
    }
  }, "Trusted by"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      flexWrap: 'wrap',
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      color: '#4A4944',
      fontSize: 18
    }
  }, /*#__PURE__*/React.createElement("span", null, "Northwind"), /*#__PURE__*/React.createElement("span", null, "Loop"), /*#__PURE__*/React.createElement("span", null, "Patternly"), /*#__PURE__*/React.createElement("span", null, "Halberd"), /*#__PURE__*/React.createElement("span", null, "Fathom"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 48,
      letterSpacing: '-0.025em',
      color: '#F3734F',
      lineHeight: 1
    }
  }, "38%"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 13,
      color: '#4A4944',
      marginTop: 6,
      lineHeight: 1.45
    }
  }, "average activation lift after a 12-week engagement")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 48,
      letterSpacing: '-0.025em',
      color: '#1A1A1A',
      lineHeight: 1
    }
  }, "47"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 13,
      color: '#4A4944',
      marginTop: 6,
      lineHeight: 1.45
    }
  }, "product teams worked with since 2021"))))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Journal.jsx
try { (() => {
// Journal.jsx — recent posts
function Journal() {
  const posts = [{
    date: 'Apr 2026',
    read: '6 min',
    title: 'The activation question you\'re not asking',
    kicker: 'On finding the moment users decide to stay.'
  }, {
    date: 'Mar 2026',
    read: '4 min',
    title: 'Why your WBR has 47 metrics (and what to cut)',
    kicker: 'A short, opinionated audit you can run today.'
  }, {
    date: 'Feb 2026',
    read: '9 min',
    title: 'Cohorts, honestly',
    kicker: 'Most cohort charts lie. Here are the three that don\'t.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 32px',
      background: '#EDE6D8'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#F3734F',
      marginBottom: 12
    }
  }, "From the journal"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 48,
      letterSpacing: '-0.02em',
      color: '#1A1A1A',
      margin: 0
    }
  }, "Recent writing")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      color: '#1A1A1A',
      textDecoration: 'none',
      display: 'inline-flex',
      gap: 6
    }
  }, "All entries ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#F3734F'
    }
  }, "\u2192"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 0
    }
  }, posts.map((p, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: "#",
    style: {
      padding: '24px 28px 28px',
      borderTop: '1px solid rgba(26,26,26,0.18)',
      borderRight: i < 2 ? '1px solid rgba(26,26,26,0.10)' : 'none',
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'background 140ms'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(245,240,232,0.6)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 11,
      color: '#807C72',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      fontWeight: 600
    }
  }, p.date, " \xB7 ", p.read, " read"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 22,
      color: '#1A1A1A',
      margin: 0,
      letterSpacing: '-0.015em',
      lineHeight: 1.2
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 15,
      color: '#4A4944',
      margin: 0,
      lineHeight: 1.55
    }
  }, p.kicker))))));
}
window.Journal = Journal;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Journal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Quote.jsx
try { (() => {
// Quote.jsx — pull quote section
function Quote() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 32px',
      background: '#F5F0E8'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 920,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#F3734F',
      marginBottom: 24
    }
  }, "What clients say"), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontStyle: 'italic',
      fontSize: 36,
      lineHeight: 1.35,
      color: '#1A1A1A',
      margin: 0,
      letterSpacing: '-0.005em'
    }
  }, "\"They didn't sell us a framework. They sat in our review for three weeks and then quietly rebuilt it. Our Monday meeting is forty minutes shorter and we actually decide things.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: '#1A1A1A',
      color: '#F3734F',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 16
    }
  }, "RB"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 14,
      color: '#1A1A1A'
    }
  }, "Rohan Bhatt"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      color: '#807C72'
    }
  }, "VP Product, Northwind Labs")))));
}
window.Quote = Quote;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Quote.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
// Services.jsx — what we do
function Services() {
  const services = [{
    n: '01',
    title: 'Metric architecture',
    body: 'We define the north-star, the input metrics that move it, and the weekly cadence that holds them accountable.'
  }, {
    n: '02',
    title: 'Activation & retention',
    body: 'Find the moment users decide to stay — then engineer the path to it. Cohorts, funnels, and the awkward truth.'
  }, {
    n: '03',
    title: 'Experimentation systems',
    body: 'Stand up the pipes, the review, and the discipline so your team can run tests without us in the room.'
  }, {
    n: '04',
    title: 'Executive review design',
    body: 'Six numbers your CEO will read every Monday. Built around your business, not a template.'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: '#1A1A1A',
      padding: '96px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 2fr',
      gap: 64,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#F3734F',
      marginBottom: 16
    }
  }, "What we do"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 48,
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
      color: '#F5F0E8',
      margin: 0
    }
  }, "Four practices.", /*#__PURE__*/React.createElement("br", null), "One discipline.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px 48px'
    }
  }, services.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      borderTop: '1px solid rgba(245,240,232,0.18)',
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      fontSize: 13,
      color: '#F3734F',
      letterSpacing: '0.06em'
    }
  }, "\u2116 ", s.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 24,
      color: '#F5F0E8',
      margin: '8px 0 10px',
      letterSpacing: '-0.01em'
    }
  }, s.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-serif)',
      fontSize: 16,
      lineHeight: 1.6,
      color: '#C9C2B4',
      margin: 0
    }
  }, s.body)))))));
}
window.Services = Services;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

})();
