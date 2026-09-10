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
    { md: 'Alain_Contreras_Resume_CV_QA_EN.md', pdf: 'Alain_Contreras_Resume_CV_QA_EN.pdf', lang: 'en' },
    { md: 'Alain_Contreras_Resume_CV_QA_ES.md', pdf: 'Alain_Contreras_Resume_CV_QA_ES.pdf', lang: 'es' },
];

// Counts page objects in a PDF buffer by scanning for "/Type /Page" entries.
// Page tree root is "/Type /Pages", so it's excluded to reach the leaf count.
function countPdfPages(buffer) {
    const text = buffer.toString('latin1');
    const allPages = (text.match(/\/Type\s*\/Page/g) || []).length;
    const trees = (text.match(/\/Type\s*\/Pages/g) || []).length;
    return allPages - trees;
}

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
        )
        // Wrap each keyword-group under "Technical Skills" in a 2-column grid.
        // Each group is an <h3> (category name) followed by a single <p> (tool list).
        .replace(
            new RegExp(`(<h2>(?:${
                resume.lang === 'es' ? 'Habilidades Técnicas' : 'Technical Skills'
            })</h2>)([\\s\\S]*?)(?=<h2>|$)`),
            (match, heading, inner) => `${heading}<div class="skills-grid">${inner}</div>`
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
        const pdfBuffer = await page.pdf({
            format: 'Letter',
            printBackground: true,
            margin: { top: '0.35in', bottom: '0.35in', left: '0.5in', right: '0.5in' },
        });

        // Enforce a single-page CV: never write a PDF that spills onto page 2.
        const pages = countPdfPages(pdfBuffer);
        if (pages !== 1) {
            throw new Error(
                `${resume.md} produced ${pages} pages — must fit on exactly 1 page. ` +
                'Tighten the CSS or trim content.'
            );
        }

        fs.writeFileSync(path.join(ROOT, resume.pdf), pdfBuffer);
        console.log(`Generated ${resume.pdf} (1 page)`);
    }

    await browser.close();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
