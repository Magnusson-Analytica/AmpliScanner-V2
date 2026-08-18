---
name: magnusson-analytica-design
description: Use this skill to generate well-branded interfaces and assets for Magnusson Analytica, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. The two essential primitives are:

- `colors_and_type.css` — drop into any HTML file's `<head>` to get the full token system and base type roles.
- `assets/logo-mark-cream.png` and `assets/logo-mark-dark.png` — the brand mark on light and dark surfaces.

If working on production code, copy assets out and read `README.md` (especially the **Visual foundations**, **Content fundamentals**, and **Iconography** sections) to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions (audience, surface, tone, length, fidelity, variations), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- **Brand colours:** ember `#F3734F` (primary), ink `#1A1A1A`, paper `#F5F0E8` (default background).
- **Typography:** Outfit for headings/UI/wordmark; Lora for body, lead paragraphs, pull quotes.
- **No emoji.** Use Lucide icons (stroke 1.5) or typographic glyphs (→ ↗ ·).
- **Default surface is cream paper, not white.** Cards are white on top of paper.
- **Voice:** confident, editorial, plain-spoken. Sentence case. Em-dashes. Specific over clever.

## Folder map

- `README.md` — full system documentation
- `colors_and_type.css` — design tokens
- `fonts/` — Outfit + Lora variable font files
- `assets/` — logos and brand marks
- `preview/` — preview cards (one per token group / component)
- `ui_kits/website/` — marketing site components + interactive demo
