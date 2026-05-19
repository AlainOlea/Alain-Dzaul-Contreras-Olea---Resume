# Alain Dzaul Contreras Olea — Resume

Static single-page interactive resume website with full bilingual support (English/Spanish).

**Live site:** [alain-contreras-olea-resume.vercel.app](https://alain-contreras-olea-resume.vercel.app/)

## Tech Stack

- **HTML5** — Semantic markup with Schema.org JSON-LD structured data
- **CSS3** — Custom stylesheet with animations, backdrop-filter, responsive design
- **Vanilla JavaScript (ES6+)** — Dynamic content rendering, bilingual logic, carousel controls
- **Swiper.js** — 3D coverflow carousel for experience section
- **Font Awesome 6** — Icons
- **Google Fonts** — Inter + Fira Code

## Local Development

```bash
npm install
npm run dev
# Opens at http://localhost:8000
```

## Testing

E2E tests with Playwright across Chromium, Firefox, and Mobile Chrome:

```bash
npm test              # Run all E2E tests
npm run test:headed   # Run with browser UI
npm run test:report   # View HTML test report
```

## Project Structure

```
resume/
├── index.html                          # Main page
├── script.js                           # All logic + bilingual data
├── styles.css                          # Full stylesheet
├── Alain_Contreras_Resume_EN.md        # English Markdown resume
├── Alain_Contreras_Resume_ES.md        # Spanish Markdown resume
├── Alain_Contreras_Resume_EN.pdf       # English PDF resume
├── Alain_Contreras_Resume_ES.pdf       # Spanish PDF resume
├── public/images/profile-picture.png   # Profile photo
├── sitemap.xml                         # SEO sitemap
├── robots.txt                          # Crawl rules
├── tests/e2e/                          # Playwright E2E tests
└── .github/workflows/test.yml          # CI/CD pipeline
```

## Deployment

Deployed on [Vercel](https://vercel.com). Static files, no build step required.
