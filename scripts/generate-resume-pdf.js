// Regenerates the downloadable resume PDFs from the source .md files.
// Usage: npm run resume:pdf
//
// Pipeline: markdown -> HTML (marked) -> styled with resume-pdf-template.css
// -> printed to PDF by Playwright's headless Chromium. The .md files stay
// the single source of truth; never hand-edit the PDFs.

const { chromium } = require('playwright');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CSS = fs.readFileSync(path.join(__dirname, 'resume-pdf-template.css'), 'utf8');

const RESUMES = [
    { md: 'Alain_Contreras_Resume_EN.md', pdf: 'Alain_Contreras_Resume_EN.pdf', lang: 'en' },
    { md: 'Alain_Contreras_Resume_ES.md', pdf: 'Alain_Contreras_Resume_ES.pdf', lang: 'es' },
];

async function main() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    for (const resume of RESUMES) {
        const mdContent = fs.readFileSync(path.join(ROOT, resume.md), 'utf8');
        // The first <ul> is the Contact Information list ("**Email**: value").
        // Its label is hidden in the PDF (see CSS), so strip "Label: " entirely
        // instead of just hiding the <strong> — otherwise the ": " is left dangling.
        const bodyHtml = marked.parse(mdContent).replace(
            /<ul>([\s\S]*?)<\/ul>/,
            (match, inner) => `<ul>${inner.replace(/<strong>[^<]*<\/strong>:\s*/g, '')}</ul>`
        );
        const html = `<!doctype html>
<html lang="${resume.lang}">
<head>
<meta charset="utf-8">
<title>${resume.lang.toUpperCase()} Resume</title>
<style>${CSS}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

        await page.setContent(html, { waitUntil: 'networkidle' });
        await page.pdf({
            path: path.join(ROOT, resume.pdf),
            format: 'Letter',
            printBackground: true,
            margin: { top: '0.5in', bottom: '0.5in', left: '0.6in', right: '0.6in' },
        });
        console.log(`Generated ${resume.pdf}`);
    }

    await browser.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
