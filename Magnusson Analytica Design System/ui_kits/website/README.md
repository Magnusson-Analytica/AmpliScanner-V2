# Magnusson Analytica — Marketing Site UI Kit

A high-fidelity, click-thru recreation of the **Magnusson Analytica marketing site**. This kit is the canonical reference for site-style components: header, hero, case-study cards, services grid, pull-quote, journal, contact form, footer, and a modal stub.

## How to view

Open `index.html` — everything renders inline (React + Babel via CDN, no build step).

## Components

| File | Purpose |
|---|---|
| `Header.jsx` | Sticky header with backdrop-blur on scroll, primary CTA |
| `Hero.jsx` | Editorial hero with two-column lockup + trusted-by + stats |
| `Services.jsx` | Dark "What we do" section, 4-up numbered grid (`№ 01–04`) |
| `CaseStudies.jsx` | 3-up case-study cards on cream, hover-elevation, click-thru |
| `Quote.jsx` | Centred serif pull-quote with avatar attribution |
| `Journal.jsx` | 3-up writing entries on sunken cream (`paper-2`) |
| `Contact.jsx` | Dark CTA section + dark form with success state |
| `Footer.jsx` | 5-column footer on ink |

## Notes on this kit

- This is an **extrapolation, not a recreation** — no live site or Figma was provided. The copy, layout decisions, and information architecture are educated guesses based on positioning ("boutique product analytics consultancy"). Replace with real content once available.
- All components use only the tokens in `colors_and_type.css`. No hard-coded values that diverge from the system.
- Iconography is limited to typographic glyphs (→ ↗ ·) — sufficient for the marketing surface. The Lucide CDN is set up in `preview/iconography.html` and is the recommended choice when icons are needed in deeper surfaces.

## Coverage / gaps

- ✅ Marketing site (this kit)
- ❌ Product / app surfaces — none were defined; please describe the product if there is one
- ❌ Editorial / long-form blog post page — easy follow-up; ask if needed
- ❌ Pricing / engagement page — easy follow-up; ask if needed
