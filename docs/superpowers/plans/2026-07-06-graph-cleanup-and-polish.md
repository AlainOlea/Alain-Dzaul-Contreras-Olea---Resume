# Graph Cleanup, Nav Responsiveness, Card Reveal & Scroll-Snap Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On the `refactor` branch, rescue the one validated piece of the rejected "terminal evolved" redesign (the section-driven node graph) by making it full-screen and removing everything the user rejected (sidebar mini-graph, h2 typing effect, jumpy scroll-snap), add a staggered fade+slide-up reveal for cards, and update the Rubidex experience end date.

**Architecture:** No build step — vanilla JS (`script.js`) + CSS (`styles.css`) + static `index.html`, consistent with the rest of the project. Every change is either a targeted deletion (sidebar graph, h2-typing) or a CSS-only addition (card reveal stagger, scroll-snap-stop fix) driven by the `IntersectionObserver`s that already exist in `script.js`. Swiper (already loaded via CDN for the experience carousel) is reused for the mobile nav — no new dependency.

**Tech Stack:** Vanilla JS, CSS, Swiper 12 (CDN, already present), Playwright (`tests/e2e/*.spec.js`) for verification.

## Global Constraints

- No new npm/CDN dependencies — reuse Swiper, which is already loaded in `index.html`.
- All new/modified animations must respect `prefers-reduced-motion: reduce` (existing `@media (prefers-reduced-motion: reduce)` block at `styles.css:20-41`).
- Keep the "no build step" architecture — edits are direct to `index.html`, `styles.css`, `script.js`.
- Two live-in-browser checkpoints are required (not just Playwright): one after Tasks 1–3 (graph + h2-typing removal), one after Tasks 4–6 (cards, mobile nav, scroll-snap). Do not mark the branch done from automated tests alone — this repo's memory (`feedback_terminal_redesign_rejected`) explicitly says automated snap/overflow checks did not catch "feels jumpy" before.
- Bilingual content (`resumeDataBilingual.en` / `.es` in `script.js`) must stay in sync for any copy change (Task 6).

---

### Task 1: Remove the sidebar mini-graph, move section-highlight to the full-screen background graph

**Files:**
- Modify: `index.html:135` (remove `<div id="sidebar-graph">`)
- Modify: `script.js:8` (remove `sidebarGraph` variable), `script.js:100-132` (`setupNodeGraph`), `script.js:134-139` (`updateGraphHighlight`)
- Modify: `styles.css:10` (`--graph-bg-opacity` default), `styles.css:44-52` (`#node-graph`), `styles.css:111-118` (`#sidebar-graph` — delete), `styles.css:171-173` (mobile `#sidebar-graph` override — delete)
- Test: `tests/e2e/navigation.spec.js` (new test), manual browser checkpoint

**Interfaces:**
- Consumes: existing `renderGraph(container, {nodeCount, opacity, is3D})` (script.js:37-78) — signature unchanged.
- Produces: `backgroundGraph` (script.js:7) remains the only graph instance; `updateGraphHighlight(sectionId)` now toggles `.lit` on `backgroundGraph.container` elements instead of `sidebarGraph`. `setupScrollspy()` (script.js:156-182) keeps calling `updateGraphHighlight(sectionId)` with no signature change, so Task 2/4 do not need to know about this internal change.

- [ ] **Step 1: Remove the sidebar graph container from the markup**

In `index.html`, delete line 135:
```html
        <div id="sidebar-graph" aria-hidden="true"></div>
```
so the nav becomes:
```html
    <nav id="sidebar-nav" aria-label="Section navigation">
        <ul>
```

- [ ] **Step 2: Remove sidebar graph creation from `setupNodeGraph` and retarget the highlight function**

In `script.js`, replace the `sidebarGraph` declaration and `setupNodeGraph`/`updateGraphHighlight` functions:

```javascript
// line 8 — delete this line entirely
// let sidebarGraph = null;
```

Replace `setupNodeGraph` (script.js:100-132):
```javascript
function setupNodeGraph() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

    const bgContainer = document.createElement('div');
    bgContainer.id = 'node-graph';
    bgContainer.setAttribute('aria-hidden', 'true');
    document.body.prepend(bgContainer);

    backgroundGraph = renderGraph(bgContainer, {
        nodeCount: isMobileViewport ? 14 : 40,
        opacity: isMobileViewport ? 0.2 : 0.35,
        is3D: !isMobileViewport && !prefersReducedMotion
    });

    // Body scroll drives progress bar / scroll listener even when the rotation loop is off (reduced motion)
    document.body.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    if (!isMobileViewport && !prefersReducedMotion) {
        graphAnimating = true;
        animateGraph();
    }
}
```

Replace `updateGraphHighlight` (script.js:134-139):
```javascript
function updateGraphHighlight(sectionId) {
    if (!backgroundGraph) return;
    backgroundGraph.container.querySelectorAll('.graph-node, .graph-line').forEach((el) => {
        el.classList.toggle('lit', el.dataset.category === sectionId);
    });
}
```

- [ ] **Step 3: Update the graph CSS — remove sidebar rules, raise background opacity, strengthen the `.lit` glow**

In `styles.css`, change the default opacity var (line 10):
```css
    --graph-bg-opacity: 0.35;
```

Delete the sidebar graph blocks entirely — `styles.css:111-118`:
```css
#sidebar-graph {
    position: relative;
    width: 90px;
    height: 110px;
    margin-bottom: 10px;
    perspective: 800px;
    opacity: 0.9;
}
```
and the mobile override at `styles.css:171-173`:
```css
    #sidebar-graph {
        display: none;
    }
```

Strengthen the lit glow (replace `styles.css:68-71` and `81-84`):
```css
.graph-node.lit {
    background: var(--graph-node-color-active);
    box-shadow: 0 0 10px var(--accent-green), 0 0 2px var(--accent-green);
}

.graph-line.lit {
    background: var(--accent-green);
    opacity: 0.85;
}
```

- [ ] **Step 4: Manual verification — run the dev server and look at the graph**

Run: `npm run dev` then open `http://localhost:8000` in a browser.
Expected: a full-screen, visibly denser node graph in the background; scrolling between sections visibly lights up a different cluster of nodes/lines across the whole viewport (not confined to a small area). No leftover small graph anywhere in the nav.

- [ ] **Step 5: Add a Playwright check that the sidebar graph is gone and the background graph exists**

Add to `tests/e2e/navigation.spec.js` (append inside the existing `test.describe` block):
```javascript
  test('should not render the old sidebar mini-graph, and should render one full-screen node graph', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#sidebar-graph')).toHaveCount(0);
    await expect(page.locator('#node-graph')).toHaveCount(1);
    await expect(page.locator('#node-graph')).toBeVisible();
  });
```

- [ ] **Step 6: Run the test**

Run: `npx playwright test tests/e2e/navigation.spec.js -g "sidebar mini-graph"`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add index.html script.js styles.css tests/e2e/navigation.spec.js
git commit -m "feat: remove sidebar mini-graph, make background node graph full-screen with stronger section highlight"
```

---

### Task 2: Remove the h2 typing effect from section headers

**Files:**
- Modify: `script.js:632-647` (`triggerH2Typing`, `retriggerRevealedH2Typing`), `script.js:595`, `script.js:772` (call sites)
- Modify: `styles.css:30-34` (reduced-motion override, delete), `styles.css:991-1011` (`h2.h2-typing` rule + keyframes, delete)
- Test: `tests/e2e/navigation.spec.js` (new test)

**Interfaces:**
- Consumes: nothing new.
- Produces: `renderAllData()` and the `revealObserver` callback (script.js:768-775) no longer reference `triggerH2Typing`/`retriggerRevealedH2Typing` — later tasks must not reintroduce calls to these removed functions.

- [ ] **Step 1: Delete the typing functions and their call sites in `script.js`**

Delete `triggerH2Typing` and `retriggerRevealedH2Typing` entirely (script.js:632-647):
```javascript
// Terminal-style "typing" effect on section headers
function triggerH2Typing(sectionEl) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const h2 = sectionEl.querySelector('h2');
    if (!h2) return;
    h2.style.setProperty('--h2-target-width', h2.textContent.length + 'ch');
    h2.classList.remove('h2-typing');
    void h2.offsetWidth; // force reflow to restart the animation
    h2.classList.add('h2-typing');
}

function retriggerRevealedH2Typing() {
    document.querySelectorAll('.profile-section.revealed, .achievements-section.revealed, section.revealed').forEach((sectionEl) => {
        triggerH2Typing(sectionEl);
    });
}
```

Remove the call at script.js:595 (inside the language-switch flow) — delete the line:
```javascript
    retriggerRevealedH2Typing();
```

Remove the call inside the `revealObserver` callback (script.js:768-775) — change:
```javascript
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                triggerH2Typing(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
```
to:
```javascript
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
```

- [ ] **Step 2: Delete the h2-typing CSS**

In `styles.css`, delete the reduced-motion override block for it (part of `styles.css:19-41` — remove only these lines, keep the rest of the media query):
```css
    h2.h2-typing {
        animation: none !important;
        width: auto !important;
        border-right: none !important;
    }
```

Delete the full rule block (`styles.css:991-1011`):
```css
/* Terminal-style h2 typing effect */
h2.h2-typing {
    display: inline-block;
    max-width: 100%;
    width: 0;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: bottom;
    border-right: 3px solid var(--accent-blue);
    animation: h2-typing-anim 1.1s steps(40, end) forwards, h2-caret-blink 0.8s step-end infinite;
}

@keyframes h2-typing-anim {
    from { width: 0; }
    to { width: var(--h2-target-width, 100%); }
}

@keyframes h2-caret-blink {
    0%, 100% { border-color: var(--accent-blue); }
    50% { border-color: transparent; }
}
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open the page, scroll through every section.
Expected: section `h2` titles appear instantly with the section fade-in (no letter-by-letter typing, no blinking caret). Hero name/title typing (unrelated, untouched) still works.

- [ ] **Step 4: Add a Playwright check that h2-typing is gone**

Append to `tests/e2e/navigation.spec.js`:
```javascript
  test('should not apply the typewriter effect to section h2 headers', async ({ page }) => {
    await page.goto('/');

    const typingHeaders = await page.locator('h2.h2-typing').count();
    expect(typingHeaders).toBe(0);
  });
```

- [ ] **Step 5: Run the test**

Run: `npx playwright test tests/e2e/navigation.spec.js -g "typewriter"`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add script.js styles.css tests/e2e/navigation.spec.js
git commit -m "fix: remove terminal typewriter effect from section h2 headers"
```

---

### Task 3: Fix scroll-snap vibration (scroll-snap-stop)

**Files:**
- Modify: `styles.css:222`, `styles.css:378`, `styles.css:454` (`scroll-snap-stop: always` → `normal`)
- Test: manual browser checkpoint (primary), existing Playwright snap tests if any pass unaffected

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by later tasks — purely a CSS property value change.

- [ ] **Step 1: Change `scroll-snap-stop` in the three affected rules**

In `styles.css`, on line 222 (`.profile-section`):
```css
    scroll-snap-align: start;
    scroll-snap-stop: normal;
```

On line 378 (`.achievements-section`):
```css
    scroll-snap-align: start;
    scroll-snap-stop: normal;
```

On line 454 (`section`):
```css
    scroll-snap-align: start;
    scroll-snap-stop: normal;
```

- [ ] **Step 2: Manual verification — this is the primary check, not automated tests**

Run: `npm run dev`, open the page in a real browser (not just headless), and do a fast trackpad/mouse-wheel fling scroll through several sections in a row, both on desktop viewport and a mobile emulation (Chrome DevTools device toolbar).
Expected: the page settles into each section in one smooth deceleration — no visible back-and-forth wobble/vibration at the moment it stops. If it still vibrates, re-open this task and try the fallback noted in the design spec (checking whether `animateGraph`'s `requestAnimationFrame` loop is competing with the scroll-settle repaint) before touching anything else.

- [ ] **Step 3: Run the existing snap/overflow regression tests to confirm no double-jump regression**

Run: `npx playwright test tests/e2e/responsive.spec.js tests/e2e/navigation.spec.js`
Expected: PASS (these already cover overflow/section-visibility from the earlier `76746b3` fix — confirm they still hold with `normal` instead of `always`).

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "fix: stop scroll-snap vibration by relaxing scroll-snap-stop to normal"
```

---

### Task 4: Staggered fade + slide-up reveal for cards

**Files:**
- Modify: `styles.css:388-434` area (`.achievement-card` + its `:nth-child` delays), `styles.css:819-830` (`.education-item`), `styles.css:883-...` (`.skills-category`), `styles.css:1044-1053` (`.certification-item`), `styles.css:1082-...` (`.language-item`)
- Test: `tests/e2e/interactions.spec.js` (new test)

**Interfaces:**
- Consumes: the existing `.revealed` class already toggled by `revealObserver` on the parent section (script.js:768-775, untouched by this task) — `.achievements-section.revealed`, `.education-section.revealed`, `.skills-section.revealed`, `.certifications-section.revealed`, `.languages-section.revealed`, plus the generic `section.revealed`.
- Produces: nothing consumed by later tasks.

This task replaces each card type's on-mount animation (`popIn`, `slideInRight`, `slideInLeft`, which currently fire immediately on render regardless of scroll position) with a scroll-triggered, staggered fade+slide-up that fires only once the parent section's `.revealed` class is added.

- [ ] **Step 1: Achievement cards — replace `popIn` with fade+slide-up**

In `styles.css`, replace the `.achievement-card` rule (around line 388-400):
```css
.achievement-card {
    background: rgba(26, 26, 26, 0.25);
    padding: 25px;
    border-radius: 12px;
    border: 1px solid rgba(180, 180, 180, 0.2);
    border-left: 4px solid #b8b8b8;
    text-align: center;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.5s ease, transform 0.5s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transform: translateY(16px);
}

.achievements-section.revealed .achievement-card {
    opacity: 1;
    transform: translateY(0);
}
```

Replace the four `.achievement-card:nth-child(N) { animation-delay: ... }` rules with transition-delay versions:
```css
.achievements-section.revealed .achievement-card:nth-child(1) { transition-delay: 0s; }
.achievements-section.revealed .achievement-card:nth-child(2) { transition-delay: 0.08s; }
.achievements-section.revealed .achievement-card:nth-child(3) { transition-delay: 0.16s; }
.achievements-section.revealed .achievement-card:nth-child(4) { transition-delay: 0.24s; }
```

- [ ] **Step 2: Education items — replace `slideInRight` with fade+slide-up**

Replace the `.education-item` rule (styles.css:819-828), removing `animation: slideInRight ...` and adding the reveal pattern:
```css
.education-item {
    background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(35, 35, 35, 0.9));
    padding: 18px 24px;
    border-radius: 12px;
    margin-bottom: 20px;
    border: 1px solid rgba(180, 180, 180, 0.2);
    border-left: 4px solid #b8b8b8;
    transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, opacity 0.5s ease, translate 0.5s ease;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
    opacity: 0;
    transform: translateY(16px);
}

.education-section.revealed .education-item {
    opacity: 1;
    transform: translateY(0);
}

.education-section.revealed .education-item:nth-child(1) { transition-delay: 0s; }
.education-section.revealed .education-item:nth-child(2) { transition-delay: 0.08s; }
.education-section.revealed .education-item:nth-child(3) { transition-delay: 0.16s; }
.education-section.revealed .education-item:nth-child(4) { transition-delay: 0.24s; }
.education-section.revealed .education-item:nth-child(5) { transition-delay: 0.32s; }
```

- [ ] **Step 3: Skill categories — add fade+slide-up (previously no entry animation)**

Add after the existing `.skills-category` rule (styles.css:883):
```css
.skills-category {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.skills-section.revealed .skills-category {
    opacity: 1;
    transform: translateY(0);
}

.skills-section.revealed .skills-category:nth-child(1) { transition-delay: 0s; }
.skills-section.revealed .skills-category:nth-child(2) { transition-delay: 0.08s; }
.skills-section.revealed .skills-category:nth-child(3) { transition-delay: 0.16s; }
.skills-section.revealed .skills-category:nth-child(4) { transition-delay: 0.24s; }
.skills-section.revealed .skills-category:nth-child(5) { transition-delay: 0.32s; }
.skills-section.revealed .skills-category:nth-child(6) { transition-delay: 0.4s; }
```

- [ ] **Step 4: Certification items — replace `slideInLeft` with fade+slide-up**

Replace the `.certification-item` rule (styles.css:1044-1053), removing `animation: slideInLeft ...`:
```css
.certification-item {
    background: linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(35, 35, 35, 0.9));
    padding: 20px 25px;
    border-radius: 12px;
    margin-bottom: 15px;
    border: 1px solid rgba(180, 180, 180, 0.2);
    border-left: 4px solid #b8b8b8;
    transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, opacity 0.5s ease, translate 0.5s ease;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
    opacity: 0;
    transform: translateY(16px);
}

.certifications-section.revealed .certification-item {
    opacity: 1;
    transform: translateY(0);
}

.certifications-section.revealed .certification-item:nth-child(1) { transition-delay: 0s; }
.certifications-section.revealed .certification-item:nth-child(2) { transition-delay: 0.08s; }
.certifications-section.revealed .certification-item:nth-child(3) { transition-delay: 0.16s; }
.certifications-section.revealed .certification-item:nth-child(4) { transition-delay: 0.24s; }
```

- [ ] **Step 5: Language items — add fade+slide-up**

Add after the existing `.language-item` base rule (styles.css:1082):
```css
.language-item {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease, background 0.3s ease, border-color 0.3s ease;
}

.languages-section.revealed .language-item {
    opacity: 1;
    transform: translateY(0);
}

.languages-section.revealed .language-item:nth-child(1) { transition-delay: 0s; }
.languages-section.revealed .language-item:nth-child(2) { transition-delay: 0.08s; }
```
Note: if `.language-item` already declares a `transition` property elsewhere for hover/active states (check around styles.css:1096-1145 before adding), merge the transition list into a single declaration instead of creating a duplicate rule — do not let two `.language-item { transition: ... }` blocks fight each other.

- [ ] **Step 6: Delete now-unused `popIn`/`slideInRight`/`slideInLeft` keyframes if nothing else references them**

Run: `grep -n "popIn\|slideInRight\|slideInLeft" styles.css`
Expected output: only the `@keyframes` definitions themselves (e.g. `styles.css:1193` for `popIn`) and the `.icon-button` rule at `styles.css:331-332` which also uses `popIn` — **do not delete `@keyframes popIn`**, since `.icon-button` still needs it. Only remove `slideInRight`/`slideInLeft` keyframes if grep shows zero remaining usages after Steps 2 and 4.

- [ ] **Step 7: Manual verification**

Run: `npm run dev`, scroll slowly through Achievements, Education, Skills, Certifications, Languages sections.
Expected: in each section, cards appear with a fade + slide-up, one after another in a quick cascade (not all at once, not simultaneously with unrelated on-load animations).

- [ ] **Step 8: Add a Playwright check for the reveal classes and initial hidden state**

Append to `tests/e2e/interactions.spec.js`:
```javascript
test.describe('Scroll reveal animations on cards', () => {
  test('achievement cards start hidden and reveal when their section is scrolled into view', async ({ page }) => {
    await page.goto('/');

    const firstCard = page.locator('.achievement-card').first();
    const opacityBefore = await firstCard.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacityBefore)).toBeLessThan(1);

    await page.locator('.achievements-section').scrollIntoViewIfNeeded();
    await expect(page.locator('.achievements-section')).toHaveClass(/revealed/);

    await page.waitForTimeout(700); // allow the 0.5s transition + stagger delay to finish
    const opacityAfter = await firstCard.evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacityAfter)).toBe(1);
  });
});
```

- [ ] **Step 9: Run the test**

Run: `npx playwright test tests/e2e/interactions.spec.js -g "achievement cards"`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add styles.css tests/e2e/interactions.spec.js
git commit -m "feat: staggered fade+slide-up reveal for achievement, education, skill, certification, and language cards"
```

---

### Task 5: Responsive mobile nav via Swiper (freeMode drag)

**Files:**
- Modify: `index.html:134-146` (`#sidebar-nav` markup — wrap `<ul>` contents for Swiper), `script.js` (new `setupMobileNavSwiper` function + call site), `styles.css:165-184` (mobile `#sidebar-nav` media query)
- Test: `tests/e2e/responsive.spec.js` (new test)

**Interfaces:**
- Consumes: Swiper global (already loaded via `<script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js">` in `index.html:393`), same pattern as the existing `new Swiper('.experience-swiper', {...})` call in `script.js:849`.
- Consumes: `setupScrollspy()`'s `setActive(sectionId)` closure (script.js:162-171) — this task adds a call to center the active mobile nav pill, so it must read the existing `navLinks` NodeList structure without changing its selector (`#sidebar-nav a[data-section]`).
- Produces: `mobileNavSwiper` (module-level variable), consumed only within this task.

- [ ] **Step 1: Restructure the nav markup for Swiper on mobile**

In `index.html`, change the `<ul>` (lines 136-145) to also carry Swiper's required wrapper structure — Swiper needs `.swiper > .swiper-wrapper > .swiper-slide`, applied only via CSS class toggling at the `max-width: 768px` breakpoint, so the desktop layout is untouched:

```html
    <nav id="sidebar-nav" aria-label="Section navigation">
        <div id="sidebar-nav-swiper" class="swiper">
            <ul class="swiper-wrapper">
                <li class="swiper-slide"><a href="#whoami" data-section="whoami" class="nav-label" data-en="whoami" data-es="whoami">whoami</a></li>
                <li class="swiper-slide"><a href="#summary" data-section="summary" class="nav-label" data-en="summary" data-es="resumen">summary</a></li>
                <li class="swiper-slide"><a href="#achievements" data-section="achievements" class="nav-label" data-en="achievements" data-es="logros">achievements</a></li>
                <li class="swiper-slide"><a href="#experience" data-section="experience" class="nav-label" data-en="experience" data-es="experiencia">experience</a></li>
                <li class="swiper-slide"><a href="#education" data-section="education" class="nav-label" data-en="education" data-es="educacion">education</a></li>
                <li class="swiper-slide"><a href="#skills" data-section="skills" class="nav-label" data-en="skills" data-es="habilidades">skills</a></li>
                <li class="swiper-slide"><a href="#certifications" data-section="certifications" class="nav-label" data-en="certifications" data-es="certificaciones">certifications</a></li>
                <li class="swiper-slide"><a href="#languages" data-section="languages" class="nav-label" data-en="languages" data-es="idiomas">languages</a></li>
            </ul>
        </div>
    </nav>
```
Note: `.swiper`/`.swiper-wrapper`/`.swiper-slide` classes are inert on desktop (no Swiper instance is created there in Step 3), so the existing desktop `#sidebar-nav ul`/`#sidebar-nav a` CSS (styles.css:120-163) keeps applying unchanged since the selectors don't reference tag names that changed.

- [ ] **Step 2: Add mobile-only CSS for the horizontal Swiper nav**

Replace the `@media (max-width: 768px)` block for `#sidebar-nav` (styles.css:165-184):
```css
@media (max-width: 768px) {
    #sidebar-nav {
        top: auto;
        bottom: 0;
        right: 0;
        left: 0;
        transform: none;
        width: 100%;
        background: rgba(8, 8, 8, 0.85);
        backdrop-filter: blur(6px);
        padding: 8px 0;
    }

    #sidebar-nav-swiper {
        width: 100%;
        overflow: visible;
    }

    #sidebar-nav ul {
        flex-direction: row;
        gap: 0;
    }

    #sidebar-nav .swiper-slide {
        width: auto;
        flex-shrink: 0;
    }

    #sidebar-nav a {
        font-size: 0.7rem;
        width: auto;
        padding: 6px 14px;
        white-space: nowrap;
    }

    #sidebar-nav a::before {
        display: none;
    }
}
```

- [ ] **Step 3: Initialize Swiper for the mobile nav in `script.js`**

Add near the top-level state declarations (after `let sidebarGraph = null;` was removed in Task 1, so after `let backgroundGraph = null;`):
```javascript
let mobileNavSwiper = null;
```

Add a new function (place it near `setupScrollspy`, e.g. directly above it):
```javascript
function setupMobileNavSwiper() {
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobileViewport) return;

    mobileNavSwiper = new Swiper('#sidebar-nav-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 4,
        freeMode: {
            enabled: true,
            momentum: true
        },
        grabCursor: true
    });
}
```

Call it once during initial setup — add the call directly after the existing `setupScrollspy();` call (script.js:765, inside the same init flow that also sets up `setupAutoplayObservers()` and the `revealObserver`):
```javascript
    setupScrollspy();
    setupMobileNavSwiper();
```

- [ ] **Step 4: Center the active pill in the mobile nav when the section changes**

In `setupScrollspy()`'s `setActive` closure (script.js:162-171), add centering logic right after the existing `updateGraphHighlight(sectionId)` call:
```javascript
    const setActive = (sectionId) => {
        navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
        updateGraphHighlight(sectionId);
        if (mobileNavSwiper) {
            const activeIndex = Array.from(navLinks).findIndex((link) => link.dataset.section === sectionId);
            if (activeIndex !== -1) mobileNavSwiper.slideTo(activeIndex);
        }
        if (lastActiveSection && lastActiveSection !== sectionId) {
            triggerScanline();
        }
        lastActiveSection = sectionId;
    };
```

- [ ] **Step 5: Manual verification on mobile emulation**

Run: `npm run dev`, open Chrome DevTools device toolbar (e.g. iPhone 12 viewport), reload.
Expected: the section nav is a horizontal bar pinned to the bottom of the screen; dragging it left/right feels like a native swipe with momentum (not a hard-edged scrollbar); as you scroll the page, the active pill auto-centers.

- [ ] **Step 6: Add a Playwright mobile-viewport check**

Append to `tests/e2e/responsive.spec.js`:
```javascript
test.describe('Mobile section nav', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('renders the nav as a horizontal swiper on mobile', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('#sidebar-nav');
    await expect(nav).toBeVisible();

    const box = await nav.boundingBox();
    expect(box.width).toBeGreaterThan(300); // spans (most of) the viewport width instead of a narrow side rail

    await expect(page.locator('#sidebar-nav-swiper.swiper-initialized')).toHaveCount(1);
  });
});
```

- [ ] **Step 7: Run the test**

Run: `npx playwright test tests/e2e/responsive.spec.js -g "horizontal swiper"`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add index.html script.js styles.css tests/e2e/responsive.spec.js
git commit -m "feat: responsive mobile section nav using Swiper freeMode drag instead of dot indicators"
```

---

### Task 6: Update Rubidex experience end date

**Files:**
- Modify: `index.html:167`, `index.html:240`
- Modify: `script.js:216` (EN `experienceItems`), `script.js:393` (ES `experienceItems`)
- Test: `tests/e2e/interactions.spec.js` (new test)

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Update the two static noscript/SEO blocks in `index.html`**

Line 167:
```html
            <p style="color:#b8b8b8;margin:0;">Mexico City · February 2025 – May 2026</p>
```

Line 240:
```html
        <p style="color:#b8b8b8;margin:0;">Mexico City · February 2025 – May 2026</p>
```

- [ ] **Step 2: Update the bilingual data in `script.js`**

Line 216 (EN):
```javascript
                period: 'February 2025 - May 2026',
```

Line 393 (ES):
```javascript
                period: 'Febrero 2025 - Mayo 2026',
```

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open the page, check the Experience section in both English and Spanish (use the language toggle).
Expected: Rubidex shows "February 2025 - May 2026" (EN) / "Febrero 2025 - Mayo 2026" (ES) — no more "Present"/"Presente".

- [ ] **Step 4: Add a Playwright check**

Append to `tests/e2e/interactions.spec.js`:
```javascript
test.describe('Rubidex experience end date', () => {
  test('shows a fixed end date instead of Present/Presente', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).not.toContainText('February 2025 - Present');
    await expect(page.locator('body')).toContainText('May 2026');
  });
});
```

- [ ] **Step 5: Run the test**

Run: `npx playwright test tests/e2e/interactions.spec.js -g "Rubidex"`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add index.html script.js tests/e2e/interactions.spec.js
git commit -m "fix: update Rubidex experience period to reflect May 2026 end date"
```

---

### Task 7: Full regression pass and final live checkpoint

**Files:**
- None modified — verification only.

**Interfaces:**
- Consumes: all prior tasks' output.
- Produces: nothing (terminal task).

- [ ] **Step 1: Run the full Playwright suite**

Run: `npm test`
Expected: all specs pass, including the ones modified in Tasks 1, 2, 4, 5, 6.

- [ ] **Step 2: Run the mobile project explicitly**

Run: `npm run test:mobile`
Expected: PASS.

- [ ] **Step 3: Final live checkpoint (per the design spec's explicit validation requirement)**

Run: `npm run dev`, open in a real browser window (not headless):
- Fling-scroll fast through all 8 sections on desktop — confirm no vibration at each snap stop.
- Repeat on a mobile emulated viewport — confirm no vibration, and the horizontal nav drags smoothly with momentum.
- Confirm the full-screen node graph lights up different regions per section.
- Confirm no `h2` typewriter effect anywhere except the hero name/title.
- Confirm cards in every card-bearing section fade+slide-up in a cascade on scroll.
- Confirm Rubidex shows "May 2026" as its end date in both languages.

Expected: all six checks hold. If any doesn't, return to the corresponding task above — do not consider the branch done on the basis of the automated suite alone (per the `feedback_terminal_redesign_rejected` memory).

- [ ] **Step 4: No commit for this task** — it is a verification-only gate. If Step 3 surfaces an issue, fix it inside the relevant earlier task's file scope and commit there instead.
