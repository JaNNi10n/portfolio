Status: proposed, pending user confirmation

# Design system

Custom build on Tailwind v4 tokens (`app/globals.css`), no third-party design system.
Design read: developer/ML-engineer portfolio for recruiters and ML hiring managers, instrumented and evidence-first.
Dials: DESIGN_VARIANCE 7, MOTION_INTENSITY 5, VISUAL_DENSITY 5.

## Typography

| Role | Family | Notes |
|---|---|---|
| Display, headings, body, numerals | Archivo variable (`wght` 100 to 900, `wdth` 62 to 125) via `next/font` | Reading text at `font-stretch: 100%`; nameplate and footer wordmark at 125%, uppercase; project titles at 112%. |
| Literal paths, endpoints, machine output | Fragment Mono 400 | Never as decoration. |

Scale tokens (classes in `globals.css`): `t-name`, `t-wordmark`, `t-h2`, `t-lede`, `t-num-xl`, `t-num-l`, `t-h3`, `t-lead`, `t-body` (17px, lh 1.6, 1.66 in dark), `t-h4`, `t-small` (14px), `t-mono` (13px minimum). Numerals are lining and tabular. `text-wrap: balance` on h1 to h3, `pretty` on prose. No italics, no all-caps outside the nameplate and wordmark.

The nameplate is sized to its container with measured advance widths: `--name-em: 14.4` (full name, one line at md and up) and `--name-line-em: 7.42` (longest word, two lines below md).

## Colour (OKLCH, strategy: Restrained)

Tinted neutrals toward hue 130 plus one olive accent that means "this links to evidence" (source links, signature overlays, focus ring, primary CTA, active nav marker).

| Token | Light | Dark |
|---|---|---|
| `--bg` | `oklch(0.985 0 0)` | `oklch(0.16 0 0)` |
| `--surface` | `oklch(0.955 0.006 130)` | `oklch(0.205 0.006 130)` |
| `--ink` | `oklch(0.21 0.012 130)` | `oklch(0.955 0.006 130)` |
| `--ink-2` | `oklch(0.46 0.012 130)` | `oklch(0.76 0.012 130)` |
| `--ink-3` | `oklch(0.52 0.010 130)` | `oklch(0.68 0.010 130)` |
| `--line` | `oklch(0.885 0.008 130)` | `oklch(0.31 0.008 130)` |
| `--line-strong` | `oklch(0.60 0.010 130)` | `oklch(0.52 0.010 130)` |
| `--accent` | `oklch(0.47 0.125 130)` | `oklch(0.80 0.135 130)` |
| `--accent-hover` | `oklch(0.41 0.11 130)` | `oklch(0.86 0.11 130)` |
| `--accent-soft` | `oklch(0.94 0.035 130)` | `oklch(0.26 0.035 130)` |
| `--on-accent` | `oklch(0.985 0 0)` | `oklch(0.20 0.03 130)` |

Theme-independent: `--plate` (light charts stay on light plates in both themes), `--plate-dark` (gate terminal render), `--annot` and `--annot-fill` (overlays on the invoice scan).
Theme follows `prefers-color-scheme`; the toggle stores an override in `localStorage` and a blocking inline script applies it before first paint. One theme per page, no inverted sections, no gradients, glow, glass or blur.

## Shape, space, layers

- Radius 0 for every structural element (plates, stage, Limits box, panels, contact band, lightbox, menu sheet). Radius 999px for controls (buttons, toggle, menu, Copy email) and the one status label.
- 1px borders only. No side stripes. No shadows except the lightbox dialog.
- No cards: grouping comes from hairlines, spacing and plates. The Limits box is the only boxed text block.
- Container 1360px, gutter `clamp(16px, 4vw, 56px)`. Grid: 4 columns below 768, 8 at md, 12 at lg (gaps 16, 20, 24, 32 at xl).
- Spacing on a 4px base. `scroll-margin-top: 88px` on anchored elements.
- Z-index scale (`lib/z.ts`): base 0, stage 10, sticky nav 40, menu 50, skip link 60. The lightbox uses the native top layer.

## Motion

CSS only plus small IntersectionObserver leaves. No motion library. Every effect has a reduced-motion path and never hides content without JS.

- Hero: name words rise inside clipping spans, lede, subtext and CTAs fade up (under 0.8s total). The hero figure is never animated (LCP).
- Results ledger: accent rule draws across each row on scroll (scroll-driven), values never count up.
- Signature "Retrieve, then read": stepped, not scrubbed. The step crossing the middle of the viewport sets the stage state; CSS transitions move the camera and draw overlays.
- Gate log reveal: top-to-bottom `clip-path` on scroll.
- Disclosure rows: `::details-content` height transition where supported.
- Lightbox: native `<dialog>` with `@starting-style`.
- Hover, focus and press change colour, background or underline only. Nothing lifts, scales or casts a shadow on any pointer state; `scripts/check-content.mjs` fails the build if it does.
