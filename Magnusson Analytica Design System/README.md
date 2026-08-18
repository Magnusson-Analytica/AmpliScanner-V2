# Magnusson Analytica — Design System

A design system for **Magnusson Analytica**, a product analytics agency / consultancy. This system codifies the brand's visual language, voice, and component library so that designs — whether thrown together for a pitch or shipped to production — feel unmistakably Magnusson.

> **Source materials provided:** brand logo (cream + dark variants), brand colour palette (`#F3734F`, `#1A1A1A`, `#F5F0E8`), and font files (Outfit + Lora). No codebase, Figma file, or product screenshots were supplied — so this system was extrapolated from those primitives. See **Caveats** at the bottom; if you have a live product or Figma, please attach it so the UI kit can be tightened to match real surfaces.

---

## Brand at a glance

Magnusson Analytica reads as a **boutique analytics consultancy** — serious, considered, editorial. Not a SaaS startup. The visual brand pairs:

- A confident geometric **"M" mark** built from chevron / fold shapes, which doubles as a metaphor for layered data, pivot tables, and growth bars.
- An **ember-orange** primary (`#F3734F`) — warm, human, optimistic — that punches against the **deep ink** (`#1A1A1A`) and rests on a **paper-cream** (`#F5F0E8`) substrate.
- A typographic pairing of **Outfit** (geometric sans, for headings, UI, the wordmark) and **Lora** (a contemporary serif, for body and quotes). The serif body is a deliberate choice — it signals "we write, we think, we present" rather than "we ship features".

The brand is **warm-modern editorial**: think a McKinsey report redesigned by an indie magazine.

---

## Content fundamentals

Magnusson is a consultancy, so the voice is **expert without being cold, plain-spoken without being casual**. Copy reads like a senior consultant talking to a CEO over a flat white — sharp, specific, never breathless.

### Tone
- **Confident, not cocky.** Make claims, then back them.
- **Editorial, not promotional.** Sentences finish; clauses earn their keep.
- **Specific over clever.** "We cut activation drop-off by 38%" beats "We unlock growth."
- **Warm, not chummy.** No exclamation marks. No "we'd love to chat!"

### Voice rules
- **Person:** "We" for the firm, "you" for the reader. Never "I". Never "us" used impersonally.
- **Casing:** Sentence case for headings, buttons, nav. **Never Title Case On Everything.** Eyebrows / labels (e.g. `Case study`, `What we do`) are title case at normal letter-spacing.
- **Punctuation:** Do not use em dashes. Serial commas. UK spellings preferred (colour, behaviour, analyse) but US is acceptable in client-facing materials.
- **Numerals:** Always digits in copy when paired with a metric ("38% lift", "12-week engagement"). Spell out small counts in prose ("three pillars", "two weeks").
- **Jargon:** Use it accurately, then unpack. "North-star metric" is fine if the next sentence shows what it is.

### What to avoid
- **No emoji.** None. The brand does not use them in product, marketing, or social. If a glyph is needed, use a typographic symbol (→ ↗ § ¶ †) or an icon from the icon set.
- No "✨ supercharge", "🚀 unlock", "🎯 nail it", "Let's build something amazing!"
- No exclamation marks except in quoted client speech.
- No "AI-powered" buzzwording. If AI is used, name the technique.
- No question-mark headlines ("Struggling with retention?"). State the thesis.

### Example copy

**Hero (good):**
> Analytics that earn their keep.
> We help product teams find the metric that moves the business — and the system to move it weekly.

**Hero (off-brand, do not use):**
> 🚀 Supercharge your product with AI-powered analytics! Let's unlock your growth potential together. 🎯

**Case study lead-in (good):**
> A Series-B fintech was logging 1.4M events a day and reading none of them. Twelve weeks later, their weekly business review ran on six metrics, three of which the CEO had never seen before.

**Eyebrow / label examples:**
`CASE STUDY · 2025` · `WHAT WE DO` · `FROM THE JOURNAL` · `ENGAGEMENT MODEL`

**Button copy:** Verbs, two or three words. `Read the case` · `Start a project` · `See our work` · `Book a discovery call`. Never `Click here`, never `Submit`.

---

## Visual foundations

### Colour
Three brand colours do most of the work. Everything else is a derivation.

- **Ember `#F3734F`** — primary accent. CTAs, the "M" mark, key data points, hover underlines, single-colour callouts. Used sparingly — it earns its impact by being scarce.
- **Ink `#1A1A1A`** — primary type on cream; primary surface in dark mode. Not pure black; the slight warmth keeps it from feeling clinical.
- **Paper `#F5F0E8`** — the default page background. Warm off-white, biased to cream/bone rather than grey. Almost every screen sits on paper.

Supporting roles are layered on top: a sunken `paper-2`, a true white `surface-card` for elevated cards, and `ink-2`/`ink-3` for dark surface variants. Foreground text uses a 4-step warm-grey scale (`fg-1` → `fg-4`) rather than pure greys.

A **warm-leaning data viz palette** (ember → ink → mustard → forest → slate-teal → plum → ember-tint) is provided. Avoid bright candy colours, neon, or anything cool-blue-leaning by default.

**Colour-on-colour rules:**
- Ink text on ember (yes) — `#1A1A1A on #F3734F` passes AA at 16px+.
- Cream text on ink (yes) — primary dark-mode pairing.
- White text on ember (no) — washes out the warmth and looks generic-SaaS.

### Typography
- **Outfit** — geometric sans, used for **all UI**, headings, eyebrows, labels, the wordmark. Weight range 400–600.
- **Lora** — contemporary serif, used for **body copy**, lead paragraphs, pull quotes, blog content, long-form. Weight 400 regular; italic available for emphasis and editorial flourish.
- Mono is system mono (`ui-monospace`) for code samples and data tables when needed.

The **sans-for-UI / serif-for-prose** split is the single most distinctive type decision. Honour it. Body copy should feel like a magazine, not a marketing site.

Type scale is a **1.250 (major-third)** ramp from 12 → 80px. Headings always Outfit; body copy always Lora; never mix within a single role.

### Backgrounds & surfaces
- **Default page background is cream paper** (`#F5F0E8`). Dark surfaces are used for emphasis sections, hero takeovers, footers — not as the default.
- **No gradients** as decorative backgrounds. The brand reads as flat, considered, print-influenced. The only acceptable gradient is a **subtle ember-tint vignette** behind a single hero element when needed.
- **No stock photography of laptops, handshakes, or skyline cityscapes.** When imagery is used, it skews **editorial portraiture, abstract close-up textures (paper, linen), or the brand mark used as a graphic device**. Imagery is generally **warm-toned, slightly desaturated, with visible grain** — never cold/blue or over-saturated.
- **Repeating motif:** the chevron / fold shape from the "M" mark can be enlarged and used as a graphic divider, page-corner accent, or oversized background element at low contrast.

### Borders, radii & shadows
- **Radii are restrained.** Buttons and inputs are `6px` (`--r-md`). Cards are `10px` (`--r-lg`). Pill shapes (`--r-pill`) are reserved for tags and the avatar. **No 24px+ rounded "blob" cards** — that reads as consumer-app, not consultancy.
- **Borders** are hairlines using `rgba(26,26,26,0.10)` on light surfaces. Strong borders (`0.18`) for emphasis. Borders are always preferred to a heavy shadow — the brand is print-influenced.
- **Shadows** are soft, warm-tinted, and used sparingly: `--shadow-1` for raised inputs on hover, `--shadow-2` for floating cards, `--shadow-3` for menus/popovers, `--shadow-4` for modals only. **Never** the harsh black `0 0 20px rgba(0,0,0,0.5)` sort.

### Motion
- **Restrained and quick.** `--dur-fast` (140ms) for micro-interactions, `--dur-base` (220ms) for state changes, `--dur-slow` (420ms) only for entrances.
- Easing is `cubic-bezier(0.22, 1, 0.36, 1)` — a quick out, settled landing. **No bounce, no overshoot.** No spring physics.
- Page transitions are **fade + 8px upward translate**. Cards on hover get a 1px lift and a shadow upgrade — never a scale transform.

### Hover & press states
- **Hover (light surfaces):** background shifts to `--surface-paper-2`, or for primary buttons the ember darkens to `--brand-ember-deep`. Underlines on links go from invisible to ember.
- **Hover (dark surfaces):** background shifts to `--surface-ink-3`.
- **Press:** colour deepens one more notch and the element translates `1px` down. **No scale shrink.**
- **Focus:** 2px ember outline with a 2px transparent offset (`outline: 2px solid var(--brand-ember); outline-offset: 2px;`). Always visible — accessibility is not optional.

### Layout
- **Grid:** 12-column on desktop, 8px base unit, 24px gutters. Max content width 1200px; long-form prose narrows to 680px.
- **Generous vertical rhythm.** Sections breathe at 96–128px on desktop.
- **Asymmetric editorial layouts** are encouraged — a heading in the left third, body in the right two-thirds, with a horizontal rule between.

### Use of transparency & blur
- Sparing. Acceptable for sticky headers (`backdrop-filter: blur(12px)` over a translucent paper) and modal scrims (`rgba(26, 26, 26, 0.55)`).
- Never use frosted glass as a decorative card style. The brand is solid, considered, not iOS-glassy.

### Cards
A Magnusson card is:
- **White** (`--surface-card`) on cream pages, or `--surface-ink-2` on dark pages.
- **10px corner radius**, hairline border, no shadow at rest, `--shadow-2` on hover.
- Padding is generous (`24–32px`).
- Usually has a small ember accent — an eyebrow, a numeral, a single underlined word — rather than a coloured fill.

### Imagery vibe
Warm, slightly desaturated, low-contrast, optionally grainy. Editorial photography, not stock. When in doubt, use the brand mark on cream as a placeholder.

---

## Logo usage

The Magnusson mark is the primary visual identifier. Always use the official lockup and never modify, recolour, or scale distort it.

- **Mark (icon):** Use on favicons, app chrome, tight spaces, or as a standalone graphic device. Available in cream and dark variants.
- **Full lockup:** Use for hero sections, primary branding, and anywhere the full "magnusson." wordmark is needed.
- **Minimum scale:** Never smaller than 32px. Below that, crop to the mark alone.
- **Colours:** Never recolour. Use the **cream-backed** version on light surfaces (`paper`), the **dark-backed** version on dark surfaces (`ink`).
- **Background:** Always on brand backgrounds only. Never place on coloured, photographic, or patterned backgrounds.
- **Spacing:** Maintain clear space equal to half the mark's width on all sides.
- **Wordmark colour accent:** the trailing period in "magnusson." is set in Brand Ember (`#F3734F`), not ink — a single accent point that ties the wordmark to the mark's colour. Apply consistently at every size ≥32px; below that, use the mark alone (per the minimum-scale rule) and drop the accent.
- **Wordmark underline:** the "m" in "magnusson" carries an underline set in Brand Ember (`#F3734F`), not ink.

Asset files: `assets/logo-mark-cream.png`, `assets/logo-mark-dark.png`, `assets/wordmark-lockup.html` (for type-based rendering).

### Every asset must include

Every asset created with this design system must display the **wordmark lockup** in the **top-left corner** at minimum 32px. Use the **cream variant** on light backgrounds, **dark variant** on dark backgrounds. This ensures immediate brand recognition across decks, reports, dashboards, and marketing materials.

---

## Iconography

The brand has no proprietary icon set yet. The recommended approach:

- **Use [Lucide](https://lucide.dev/) icons** via CDN (`https://unpkg.com/lucide@latest`). Lucide's stroke-based, geometric, slightly editorial style sits well next to Outfit and the chevron-based "M" mark.
  - **Stroke width:** `1.5` (lighter than the 2px default — keeps icons feeling refined alongside Lora body copy).
  - **Default size:** `20px`. Use `16px` inline with text, `24px` for nav, `32–48px` only for feature icons.
  - **Colour:** inherits `currentColor`. Default to `--fg-2` for inline icons; `--brand-ember` for action / accent icons; never multi-colour.
- **No emoji** in product, docs, marketing, or UI copy. This is firm.
- **Unicode glyphs as typographic accents** are encouraged: `→` (rightward, used in CTAs and links), `↗` (external link), `·` (separator), `§` `¶` `†` (editorial), `№` (item numbering). These are styled inline at the same size as surrounding text.
- **The "M" mark** itself is the most important visual asset. Use the **cream-backed** version on light surfaces, the **dark-backed** version on dark surfaces. Never recolour it; never place it on coloured backgrounds; never stretch.

Substitution flag: this system **uses Lucide as a stand-in** because no icons were supplied. If Magnusson commissions or already has a custom set, swap them in by replacing references in `ui_kits/website/Icons.jsx`.

---

## Index — what's in this folder

```
README.md                      ← you are here
SKILL.md                       ← Agent-Skill manifest (use as Claude Code skill)
colors_and_type.css            ← all design tokens (CSS custom properties)
fonts/                         ← Outfit + Lora variable font files
assets/                        ← logos and brand marks
preview/                       ← preview cards rendered in the Design System tab
ui_kits/
  website/                     ← marketing-site UI kit
    README.md
    index.html                 ← interactive demo
    *.jsx                      ← components (Header, Hero, CaseCard, …)
```

### Key files

| File | Purpose |
|---|---|
| `colors_and_type.css` | Drop into any HTML file; gives you all tokens + base type roles. |
| `assets/logo-mark-cream.png` | Primary mark on cream — use on light surfaces. |
| `assets/logo-mark-dark.png` | Primary mark on ink — use on dark surfaces. |
| `ui_kits/website/index.html` | Click-thru of the marketing site. |
| `SKILL.md` | Lets this folder be installed as a Claude Code skill. |

---

## Caveats & open questions

A few things to flag — please push back / fill in:

1. **No codebase, Figma, or product screenshots were supplied.** The UI kit, wordmark treatment, and component patterns are educated extrapolations from the colour palette, fonts, and logo. They are **brand-consistent but not necessarily product-accurate**. If Magnusson has a live site or Figma, attach it and I will tighten everything to match.
2. **No wordmark file** — only the "M" mark was provided. The wordmark in this system is a typographic setting of "Magnusson Analytica" in Outfit Bold. If a real wordmark exists, drop it into `assets/` and I will replace.
3. **No icon set was supplied** — Lucide is used as a stand-in (see Iconography). Swap out if you have a real one.
4. **Voice / tone examples are inferred** from "product analytics consultancy" positioning. If you have real case studies, blog posts, or pitch decks, please attach so I can calibrate the voice to actual Magnusson copy rather than my best guess.
5. **No product / app surfaces were defined.** Only a marketing-site UI kit is included. If there is an internal dashboard product, please describe it and I will build a kit for it.

**Bold ask:** *Send me the live site URL (or screenshots), one or two real pieces of Magnusson copy (a case study intro, a "what we do" paragraph), and any logo lockups beyond the M-mark. With those I can take this from "good extrapolation" to "actually theirs".*
