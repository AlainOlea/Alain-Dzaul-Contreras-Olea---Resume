# How the resume PDFs are generated

`Alain_Contreras_Resume_EN.pdf` and `Alain_Contreras_Resume_ES.pdf` are **generated
files**. Never hand-edit them, and never edit them in a PDF editor — they will get
overwritten and drift from the `.md` source.

## Single source of truth

- `Alain_Contreras_Resume_EN.md` / `Alain_Contreras_Resume_ES.md` are the only files
  you edit.
- Running the generator turns the Markdown into styled HTML and prints it to PDF.

## Updating the PDFs

```bash
npm run resume:pdf
```

This runs `scripts/generate-resume-pdf.js`, which:

1. Reads both `.md` files.
2. Converts each to HTML with `marked`.
3. Wraps it in the print stylesheet at `scripts/resume-pdf-template.css`.
4. Renders it with Playwright's headless Chromium and calls `page.pdf()` to
   produce the PDF, overwriting the existing file.

Run this any time you change the `.md` content, then check the diff/preview
before committing — Chromium needs network access once, to fetch the Google
Fonts (`PT Serif`, `Inter`) used in the template.

## Why this pipeline (not Pandoc/Word/a resume builder site)

- **Playwright was already a project dependency** (used for the e2e tests), so this
  adds only one new dependency (`marked`) instead of a whole new toolchain.
- Rendering through a real browser engine means the CSS is exactly what you'd get
  styling a webpage — no fighting a templating DSL (LaTeX/Pandoc) to get a specific
  look.
- The output PDF has **real, selectable text** (not a rasterized image), which is
  the baseline requirement for a resume to be machine-readable at all.

## ATS-safety rules baked into the template

These came out of researching 2026 ATS-parsing guidance (Jobscan, Resume.io,
Aura, TCS's own anti-fraud/recruiting pages, etc.) — breaking any of them risks
the resume being silently garbled or dropped by a filter:

- **Single column, no tables, no text boxes.** Multi-column layouts and tables
  can scramble the reading order when an ATS extracts text.
- **Standard section headers.** `Professional Summary`, `Professional Experience`,
  `Education`, `Technical Skills`, `Certifications & Licenses`, `Languages` — the
  same words most ATS parsers are trained to recognize. Don't get creative with
  header names.
- **No icons, photos, or skill-bar graphics.** Anything rendered as an image
  isn't text and can't be parsed; some countries' hiring processes flag photos
  entirely.
- **Real embedded text throughout**, including the Google Fonts — Chromium
  embeds the font glyphs but the underlying text content stream stays plain
  Unicode text, so it copy-pastes and parses cleanly (verify with `pdftotext
  file.pdf -` if you ever doubt it).
- **Letter-size page, 0.5–0.6in margins** — within the safe range parsers expect.

## Design choices (the "looks nice" part)

Chosen after a design pass with the user (see conversation from 2026-07 if you
have transcript access) — direction was "elegant serif + navy accent":

- **Name**: `PT Serif` (Google Fonts stand-in for Georgia — Georgia/Calibri/Arial
  aren't reliably installed on Linux build machines, so a web font guarantees
  consistent rendering wherever `npm run resume:pdf` runs).
- **Body/section text**: `Inter` — same family already used on the live site
  (`index.html`/`styles.css`), so the PDF and the web page feel like one brand.
- **One accent color only** (`#16324f`, navy) applied to the name, section
  headers, the section-header rule, and the job-title line — everything else is
  black/gray. Multiple colors or icons read as "creative template" and are one
  of the things 2026 design guidance explicitly warns against for ATS + recruiter
  perception.
- **Contact line**: the `## Contact Information` heading and the `**Label**:`
  prefixes (`**Email**:`, `**Phone**:`, ...) from the Markdown are hidden/stripped
  in the PDF only — they render as a single centered line of values separated by
  `·`, under the name. The `.md` file keeps the labels for anyone reading the
  Markdown directly; only the generator strips them for the printed layout.
- **Job/education/skills sub-headings** (`### Role | Company`) are followed by a
  small gray "meta" line (the bold `**Location | Dates**` line in the Markdown) —
  a consistent pattern reused for skill categories too (category name, then a
  gray line of tools).

## If you need to change the look

Edit `scripts/resume-pdf-template.css` — it's plain CSS keyed off the tag order
that `marked` produces from the `.md` structure (`h1`, `h1 + p` for the job
title, `h2` for sections, `h3 + p` for the meta line, etc.). It has no build
step; save and re-run `npm run resume:pdf` to see the result.

If you restructure the `.md` files (add a new heading level, reorder sections,
add a table), re-check the CSS selectors — they rely on the current heading
order (e.g. `h2:first-of-type` assumes "Contact Information" is the first `##`
section).
