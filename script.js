// Language state
let currentLanguage = localStorage.getItem('language') || 'en';

// Node Graph — CSS 3D background (replaces the old canvas GridWarp)
const GRAPH_CATEGORIES = ['whoami', 'summary', 'achievements', 'experience', 'education', 'skills', 'certifications', 'languages'];
let graphAnimating = false;
let backgroundGraph = null;
let mobileNavSwiper = null;

function buildGraphNodes(count) {
    const nodes = [];
    for (let i = 0; i < count; i++) {
        nodes.push({
            id: i,
            category: GRAPH_CATEGORIES[i % GRAPH_CATEGORIES.length],
            left: Math.random() * 100,
            top: Math.random() * 100,
            z: (Math.random() - 0.5) * 400,
            size: 4 + Math.random() * 5
        });
    }
    return nodes;
}

function buildGraphLines(nodes, linksPerNode) {
    const lines = [];
    nodes.forEach((node, i) => {
        for (let k = 1; k <= linksPerNode; k++) {
            const target = nodes[(i + k * 3) % nodes.length];
            if (target === node) continue;
            lines.push({ from: node, to: target, category: node.category });
        }
    });
    return lines;
}

function renderGraph(container, { nodeCount, opacity, is3D }) {
    container.innerHTML = '';
    container.style.setProperty('--graph-bg-opacity', opacity);

    const scene = document.createElement('div');
    scene.className = 'graph-scene';
    container.appendChild(scene);

    const nodes = buildGraphNodes(nodeCount);
    const lines = buildGraphLines(nodes, is3D ? 2 : 1);

    lines.forEach((line) => {
        const el = document.createElement('div');
        el.className = 'graph-line';
        el.dataset.category = line.category;
        const dx = line.to.left - line.from.left;
        const dy = line.to.top - line.from.top;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        el.style.left = line.from.left + '%';
        el.style.top = line.from.top + '%';
        el.style.width = length + '%';
        el.style.transform = is3D
            ? `rotate(${angle}deg) translateZ(${line.from.z}px)`
            : `rotate(${angle}deg)`;
        scene.appendChild(el);
    });

    nodes.forEach((node) => {
        const el = document.createElement('div');
        el.className = 'graph-node';
        el.dataset.category = node.category;
        el.style.left = node.left + '%';
        el.style.top = node.top + '%';
        el.style.width = node.size + 'px';
        el.style.height = node.size + 'px';
        el.style.transform = is3D ? `translateZ(${node.z}px)` : 'none';
        scene.appendChild(el);
    });

    return { container, scene, nodes, lines };
}

function updateScrollProgress() {
    const doc = document.body;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const progress = scrollable > 0 ? doc.scrollTop / scrollable : 0;
    document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
}

function animateGraph() {
    if (!graphAnimating) return;
    const t = performance.now() * 0.00005;
    const rx = Math.sin(t) * 6 + 'deg';
    const ry = (t * 12 % 360) + 'deg';
    document.querySelectorAll('.graph-scene').forEach((scene) => {
        scene.style.setProperty('--graph-rx', rx);
        scene.style.setProperty('--graph-ry', ry);
    });
    updateScrollProgress();
    requestAnimationFrame(animateGraph);
}

function setupNodeGraph() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;

    const bgContainer = document.createElement('div');
    bgContainer.id = 'node-graph';
    bgContainer.setAttribute('aria-hidden', 'true');
    document.body.prepend(bgContainer);

    backgroundGraph = renderGraph(bgContainer, {
        nodeCount: isMobileViewport ? 20 : 60,
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

function updateGraphHighlight(sectionId) {
    if (!backgroundGraph) return;
    backgroundGraph.container.querySelectorAll('.graph-node, .graph-line').forEach((el) => {
        el.classList.toggle('lit', el.dataset.category === sectionId);
    });
}

let scanlineEl = null;

function triggerScanline() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!scanlineEl) {
        scanlineEl = document.createElement('div');
        scanlineEl.id = 'scanline-overlay';
        scanlineEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(scanlineEl);
    }
    scanlineEl.classList.remove('scanline-active');
    void scanlineEl.offsetWidth; // force reflow to restart the animation
    scanlineEl.classList.add('scanline-active');
}

function setupScrollspy() {
    const navLinks = document.querySelectorAll('#sidebar-nav a[data-section]');
    if (!navLinks.length) return;

    let lastActiveSection = null;

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

    const spyObserver = new IntersectionObserver((entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const mostVisible = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
        if (mostVisible.target.id) setActive(mostVisible.target.id);
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-45% 0px -45% 0px' });

    document.querySelectorAll('#whoami, #summary, #achievements, #experience, #education, #skills, #certifications, #languages')
        .forEach((el) => spyObserver.observe(el));
}

function setupMobileNavSwiper() {
    const isMobileViewport = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobileViewport) return;

    mobileNavSwiper = new Swiper('#sidebar-nav-swiper', {
        wrapperClass: 'nav-swiper-wrapper',
        slideClass: 'nav-swiper-slide',
        slidesPerView: 'auto',
        spaceBetween: 4,
        freeMode: {
            enabled: true,
            momentum: true
        },
        grabCursor: true
    });

    // Re-measure slide widths once the custom web font finishes loading —
    // Swiper computes widths at init time and won't know slides got wider
    // once Fira Code (instead of the fallback font) actually renders.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            if (mobileNavSwiper) mobileNavSwiper.update();
        });
    }
}

// Resume Data - Bilingual
const resumeDataBilingual = {
    en: {
        title: 'QA Engineer / SDET',
        professionalSummary: 'Professional Summary',
        closingTitle: "Let's Work Together",
        closingCopy: "Quality-focused engineering, delivered. If you're looking for an SDET who bridges the gap between development and reliability, let's talk.",
        ctaDownload: 'Download Resume',
        ctaContact: 'Contact Me',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        certifications: 'Certifications & Licenses',
        languages: 'Languages',
        summaryItems: [
            'QA Engineer / SDET with 4+ years in regulated software (FDA 21 CFR Part 11) and SaaS products',
            'Design testing strategies and automation (Playwright, Jest, CI/CD) and work directly with the business to turn ambiguous requirements into clear acceptance criteria',
            'Recent results: 800+ automated tests, 5 consecutive zero-critical-bug releases, 2 passed FDA audits'
        ],
        keyAchievements: [
            { metric: '800+', label: 'Automated tests created' },
            { metric: '100%', label: 'FDA audit pass rate' },
            { metric: '5', label: 'Consecutive zero-bug releases' },
            { metric: '4+', label: 'Years in QA & test engineering' }
        ],
        experienceItems: [
            {
                role: 'QA Engineer',
                company: 'Rubidex',
                location: 'Mexico City',
                period: 'February 2025 - May 2026',
                description: [
                    'Improved client satisfaction with the product from 6/10 to 8/10 over two quarters',
                    'Built 800+ automated tests (600 unit, 200 integration, 10 E2E) that also serve as living documentation for the system',
                    'Led QA for 7 developers across 2 teams, blocking 5+ critical bugs before production'
                ],
                expandedDescription: [
                    'Implemented CI/CD pipelines for Frontend/Backend and introduced agile processes: Three Amigos, Design Handoffs, Definition of Ready',
                    'Acted as technical bridge between leadership and development, refining requirements and defining acceptance criteria for complex modules',
                    'Established change control governance and process standardization to protect sprint scope'
                ]
            },
            {
                role: 'QA Engineer / SDET',
                company: 'AspenTech',
                location: 'Mexico City',
                period: 'March 2021 – July 2024',
                description: [
                    'Delivered 5 consecutive releases with zero critical bugs as the engineer responsible for end-to-end validation',
                    'Passed 2 FDA audits and 3+ client audits with no critical observations',
                    'Managed 1,600+ test cases for pharmaceutical spectrometry software used by 50 specialized users'
                ],
                expandedDescription: [
                    'Delivered multiple releases for an enterprise client with 3 interdependent products',
                    'Authored and maintained validation documentation under FDA 21 CFR Part 11 and ISO 9001',
                    'Designed a hybrid testing approach: 10% automated for critical flows, 90% manual to preserve regulatory flexibility'
                ]
            },
            {
                role: 'Software Engineer',
                company: 'Infosys',
                location: 'Mexico City',
                period: 'July 2019 – February 2021',
                description: [
                    'Provided L2/L3 technical support to 5,000+ users for a Fortune 500 client with multi-continental operations',
                    'Resolved ~25 tickets/month in Oracle ERP Supply Chain using Python, SQL, and Java',
                    'Built internal Android tools using Kotlin'
                ],
                expandedDescription: []
            },
            {
                role: 'Engineering Intern',
                company: 'Pemex',
                location: 'Mexico City, Tula Hidalgo, Salina Cruz Oaxaca',
                period: 'September 2018 – March 2019',
                description: [
                    'Analyzed gas production optimization data and performed ethylene production forecasting',
                    'Visited 5 facilities (refineries, distribution centers, gas processing plants) for operational audits',
                    'Supported gas and liquid transportation process tracking'
                ],
                expandedDescription: []
            }
        ],
        educationItems: [
            {
                institution: 'Escuela Superior de Ingeniería Química e Industrias Extractivas (IPN)',
                location: 'Mexico City',
                degree: "Bachelor's degree in Petroleum Chemical Engineering",
                url: 'https://www.esiqie.ipn.mx/'
            },
            {
                institution: 'Instituto Tecnológico de Buenos Aires (ITBA)',
                location: 'Buenos Aires, Argentina',
                degree: 'Exchange Program - Chemical/Industrial Engineering',
                url: 'https://www.itba.edu.ar/',
                details: [
                    'Process Simulation and Optimization',
                    'Quality Management',
                    'Environmental Engineering'
                ]
            }
        ],
        skillsItems: [
            {
                category: 'Programming Languages',
                items: [
                    { name: 'TypeScript', description: 'Typed superset of JavaScript for safer, scalable applications' },
                    { name: 'JavaScript', description: 'Dynamic programming language for web and server-side development' },
                    { name: 'Python', description: 'Versatile language for automation, testing, and data analysis' },
                    { name: 'SQL', description: 'Query language for relational database operations and analytics' },
                    { name: 'Java', description: 'Object-oriented language for enterprise applications' },
                    { name: 'C++', description: 'High-performance language for system and scientific computing' }
                ]
            },
            {
                category: 'Testing & QA',
                items: [
                    { name: 'Jest', description: 'JavaScript testing framework for unit and integration tests' },
                    { name: 'Playwright', description: 'End-to-end testing framework for web applications across browsers' },
                    { name: 'Vitest', description: 'Fast unit test framework optimized for Vite/modern projects' },
                    { name: 'SuperTest', description: 'HTTP assertion library for testing Node.js REST APIs' },
                    { name: 'Manual Testing', description: 'Exploratory testing with human judgment for UX and edge cases' },
                    { name: 'White-box Testing', description: 'Internal structure testing with full code knowledge' }
                ]
            },
            {
                category: 'Frontend & Backend',
                items: [
                    { name: 'React', description: 'Component-based UI library for building interactive interfaces' },
                    { name: 'Next.js', description: 'React framework with SSR, routing, and full-stack capabilities' },
                    { name: 'Nest.js', description: 'Progressive Node.js framework with TypeScript and modular architecture' },
                    { name: 'Node.js', description: 'JavaScript runtime for building scalable server-side applications' }
                ]
            },
            {
                category: 'Code Quality & CI/CD',
                items: [
                    { name: 'ESLint', description: 'JavaScript linter for identifying code quality and style issues' },
                    { name: 'Prettier', description: 'Opinionated code formatter for consistent style across teams' },
                    { name: 'GitHub Actions', description: 'Automation platform for CI/CD workflows in GitHub repositories' },
                    { name: 'Git', description: 'Distributed version control system for tracking code changes' },
                    { name: 'Azure DevOps', description: 'Microsoft\'s DevOps platform for CI/CD, repos, and project management' }
                ]
            },
            {
                category: 'Industry Software',
                items: [
                    { name: 'Aspen HYSYS', description: 'Process simulation software for chemical engineering' },
                    { name: 'Ranorex', description: 'GUI test automation framework for desktop and web applications' },
                    { name: 'AutoCAD', description: 'Computer-aided design software for 2D/3D technical drawings' },
                    { name: 'Postman', description: 'API development and testing platform for REST/GraphQL' },
                    { name: 'OPC Tools', description: 'Industrial automation protocol tools for SCADA systems' }
                ]
            },
            {
                category: 'AI Development Tools',
                items: [
                    { name: 'Claude Code', description: 'AI coding assistant CLI for autonomous software development' },
                    { name: 'Gemini CLI', description: 'Google\'s AI assistant command-line interface for coding tasks' },
                    { name: 'Antigravity', description: 'AI-powered development environment for rapid prototyping' },
                    { name: 'Windsurf', description: 'AI-first IDE with intelligent code completion and refactoring' }
                ]
            }
        ],
        certificationsItems: [
            { name: 'Experience working under ISO 9001:2015', details: '' },
            { name: 'Professional License (Cédula Profesional)', details: 'Chemical Engineering — Number: 12075687' }
        ],
        languagesItems: [
            { name: 'Spanish', level: 'Native' },
            { name: 'English', level: 'Full Professional Proficiency' }
        ]
    },
    es: {
        title: 'QA Engineer / SDET',
        professionalSummary: 'Resumen Profesional',
        closingTitle: 'Trabajemos Juntos',
        closingCopy: 'Ingeniería enfocada en calidad, entregada. Si buscas un SDET que conecte desarrollo y confiabilidad, hablemos.',
        ctaDownload: 'Descargar CV',
        ctaContact: 'Contáctame',
        experience: 'Experiencia',
        education: 'Educación',
        skills: 'Habilidades',
        certifications: 'Certificaciones y Licencias',
        languages: 'Idiomas',
        summaryItems: [
            'QA Engineer / SDET con 4+ años en software regulado (FDA 21 CFR Part 11) y productos SaaS',
            'Diseño estrategias de testing y automatización (Playwright, Jest, CI/CD) y trabajo directo con negocio para convertir requerimientos ambiguos en criterios de aceptación',
            'Últimos resultados: 800+ tests automatizados, 5 releases consecutivos sin bugs críticos, 2 auditorías FDA aprobadas'
        ],
        keyAchievements: [
            { metric: '800+', label: 'Tests automatizados creados' },
            { metric: '100%', label: 'Tasa de aprobación FDA' },
            { metric: '5', label: 'Releases sin bugs consecutivos' },
            { metric: '4+', label: 'Años en QA e ingeniería de pruebas' }
        ],
        experienceItems: [
            {
                role: 'QA Engineer',
                company: 'Rubidex',
                location: 'Ciudad de México',
                period: 'Febrero 2025 - Mayo 2026',
                description: [
                    'Mejoré la satisfacción del cliente con el producto de 6/10 a 8/10 en dos trimestres',
                    'Desarrollé 800+ tests automatizados (600 unitarios, 200 integración, 10 E2E) que además sirven como documentación viva del sistema',
                    'Lideré QA para 7 developers en 2 equipos, bloqueando 5+ bugs críticos antes de producción'
                ],
                expandedDescription: [
                    'Implementé pipelines de CI/CD para Frontend/Backend e introduje procesos ágiles: Three Amigos, Design Handoffs, Definition of Ready',
                    'Actué como puente técnico entre liderazgo y desarrollo, refinando requerimientos y definiendo criterios de aceptación para módulos complejos',
                    'Establecí control de cambios y estandarización de procesos para proteger el alcance del sprint'
                ]
            },
            {
                role: 'QA Engineer / SDET',
                company: 'AspenTech',
                location: 'Ciudad de México',
                period: 'Marzo 2021 – Julio 2024',
                description: [
                    'Entregué 5 releases consecutivos sin bugs críticos como responsable de la validación end-to-end',
                    'Aprobé 2 auditorías FDA y 3+ auditorías de clientes sin observaciones críticas',
                    'Gestioné 1,600+ casos de prueba para software de espectrometría farmacéutica usado por 50 usuarios especializados'
                ],
                expandedDescription: [
                    'Entregué múltiples releases para cliente enterprise con 3 productos interdependientes',
                    'Elaboré y mantuve la documentación de validación bajo FDA 21 CFR Part 11 e ISO 9001',
                    'Diseñé un enfoque de testing híbrido: 10% automatizado en flujos críticos, 90% manual para mantener flexibilidad regulatoria'
                ]
            },
            {
                role: 'Ingeniero de Software',
                company: 'Infosys',
                location: 'Ciudad de México',
                period: 'Julio 2019 – Febrero 2021',
                description: [
                    'Brindé soporte técnico L2/L3 a 5,000+ usuarios de un cliente Fortune 500 con operaciones multi-continentales',
                    'Resolví ~25 tickets/mes en Oracle ERP Supply Chain usando Python, SQL y Java',
                    'Desarrollé herramientas internas en Android con Kotlin'
                ],
                expandedDescription: []
            },
            {
                role: 'Becario de Ingeniería',
                company: 'Pemex',
                location: 'Ciudad de México, Tula Hidalgo, Salina Cruz Oaxaca',
                period: 'Septiembre 2018 – Marzo 2019',
                description: [
                    'Analicé datos de optimización de producción de gas y realicé forecasting de producción de etileno',
                    'Visité 5 instalaciones (refinerías, centros de distribución, plantas de procesamiento de gas) para auditorías operacionales',
                    'Di seguimiento a procesos de transportación de gas y líquidos'
                ],
                expandedDescription: []
            }
        ],
        educationItems: [
            {
                institution: 'Escuela Superior de Ingeniería Química e Industrias Extractivas (IPN)',
                location: 'Ciudad de México',
                degree: 'Licenciatura en Ingeniería Química Petrolera',
                url: 'https://www.esiqie.ipn.mx/'
            },
            {
                institution: 'Instituto Tecnológico de Buenos Aires (ITBA)',
                location: 'Buenos Aires, Argentina',
                degree: 'Programa de Intercambio - Ingeniería Química/Industrial',
                url: 'https://www.itba.edu.ar/',
                details: [
                    'Simulación y Optimización de Procesos',
                    'Gestión de Calidad',
                    'Ingeniería Ambiental'
                ]
            }
        ],
        skillsItems: [
            {
                category: 'Lenguajes de Programación',
                items: [
                    { name: 'TypeScript', description: 'Superconjunto tipado de JavaScript para aplicaciones más seguras y escalables' },
                    { name: 'JavaScript', description: 'Lenguaje dinámico para desarrollo web y del lado del servidor' },
                    { name: 'Python', description: 'Lenguaje versátil para automatización, testing y análisis de datos' },
                    { name: 'SQL', description: 'Lenguaje de consultas para operaciones en bases de datos relacionales' },
                    { name: 'Java', description: 'Lenguaje orientado a objetos para aplicaciones empresariales' },
                    { name: 'C++', description: 'Lenguaje de alto rendimiento para computación científica y de sistemas' }
                ]
            },
            {
                category: 'Testing y QA',
                items: [
                    { name: 'Jest', description: 'Framework de testing JavaScript para pruebas unitarias y de integración' },
                    { name: 'Playwright', description: 'Framework end-to-end para testing de aplicaciones web multi-navegador' },
                    { name: 'Vitest', description: 'Framework de tests unitarios optimizado para Vite/proyectos modernos' },
                    { name: 'SuperTest', description: 'Librería de assertions HTTP para testing de APIs Node.js REST' },
                    { name: 'Testing Manual', description: 'Testing exploratorio con juicio humano para UX y casos extremos' },
                    { name: 'White-box Testing', description: 'Testing de estructura interna con conocimiento completo del código' }
                ]
            },
            {
                category: 'Frontend y Backend',
                items: [
                    { name: 'React', description: 'Librería UI basada en componentes para interfaces interactivas' },
                    { name: 'Next.js', description: 'Framework React con SSR, enrutamiento y capacidades full-stack' },
                    { name: 'Nest.js', description: 'Framework progresivo Node.js con TypeScript y arquitectura modular' },
                    { name: 'Node.js', description: 'Runtime JavaScript para construir aplicaciones escalables del lado del servidor' }
                ]
            },
            {
                category: 'Calidad de Código y CI/CD',
                items: [
                    { name: 'ESLint', description: 'Linter JavaScript para identificar problemas de calidad y estilo de código' },
                    { name: 'Prettier', description: 'Formateador de código para estilo consistente entre equipos' },
                    { name: 'GitHub Actions', description: 'Plataforma de automatización para workflows CI/CD en repositorios GitHub' },
                    { name: 'Git', description: 'Sistema de control de versiones distribuido para rastrear cambios de código' },
                    { name: 'Azure DevOps', description: 'Plataforma DevOps de Microsoft para CI/CD, repos y gestión de proyectos' }
                ]
            },
            {
                category: 'Software Industrial',
                items: [
                    { name: 'Aspen HYSYS', description: 'Software de simulación de procesos para ingeniería química' },
                    { name: 'Ranorex', description: 'Framework de automatización de tests GUI para apps desktop y web' },
                    { name: 'AutoCAD', description: 'Software CAD para dibujos técnicos 2D/3D' },
                    { name: 'Postman', description: 'Plataforma de desarrollo y testing de APIs REST/GraphQL' },
                    { name: 'OPC Tools', description: 'Herramientas de protocolo de automatización industrial para sistemas SCADA' }
                ]
            },
            {
                category: 'Herramientas de Desarrollo con IA',
                items: [
                    { name: 'Claude Code', description: 'Asistente de código IA CLI para desarrollo autónomo de software' },
                    { name: 'Gemini CLI', description: 'Interfaz de línea de comandos del asistente IA de Google para tareas de código' },
                    { name: 'Antigravity', description: 'Entorno de desarrollo potenciado por IA para prototipado rápido' },
                    { name: 'Windsurf', description: 'IDE con IA integrada para autocompletado y refactorización inteligente' }
                ]
            }
        ],
        certificationsItems: [
            { name: 'Experiencia trabajando bajo norma ISO 9001:2015', details: '' },
            { name: 'Cédula Profesional', details: 'Ingeniería Química Petrolera — Número: 12075687' }
        ],
        languagesItems: [
            { name: 'Español', level: 'Nativo' },
            { name: 'Inglés', level: 'Fluidez Profesional' }
        ]
    }
};

// Get current data based on language
function getCurrentData() {
    return resumeDataBilingual[currentLanguage];
}

// Tooltips in both languages
const tooltipTexts = {
    en: ['Email', 'Phone', 'LinkedIn', 'Download CV', 'Cambiar a espa\u00f1ol / Switch to Spanish'],
    es: ['Correo', 'Tel\u00e9fono', 'LinkedIn', 'Descargar CV', 'Cambiar a ingl\u00e9s / Switch to English']
};

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    localStorage.setItem('language', currentLanguage);
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
    
    // Update language button text
    document.getElementById('language-text').textContent = currentLanguage === 'en' ? 'ES' : 'EN';
    
    // Update icon tooltips
    const icons = document.querySelectorAll('.contact-icons .icon-button');
    const tips = tooltipTexts[currentLanguage];
    icons.forEach((icon, i) => {
        if (tips[i]) icon.title = tips[i];
    });
    
    // Update all section titles
    updateSectionTitles();
    
    // Re-render all content
    renderAllContent();
}

// Update section titles
function updateSectionTitles() {
    const data = getCurrentData();
    document.getElementById('job-title').textContent = data.title;
    document.getElementById('summary-title').textContent = data.professionalSummary;
    document.getElementById('experience-title').textContent = data.experience;
    document.getElementById('education-title').textContent = data.education;
    document.getElementById('skills-title').textContent = data.skills;
    document.getElementById('certifications-title').textContent = data.certifications;
    document.getElementById('languages-title').textContent = data.languages;
    document.getElementById('closing-title').textContent = data.closingTitle;
    document.getElementById('closing-copy').textContent = data.closingCopy;
    document.getElementById('closing-download-text').textContent = data.ctaDownload;
    document.getElementById('closing-contact-text').textContent = data.ctaContact;
    updateNavLabels();
}

function updateNavLabels() {
    document.querySelectorAll('#sidebar-nav a[data-section]').forEach((link) => {
        link.textContent = currentLanguage === 'es' ? link.dataset.es : link.dataset.en;
    });
}

// Render all content
function renderAllContent() {
    renderAchievements();
    renderSummary();
    renderEducation();
    renderSkills();
    renderCertifications();
    renderLanguages();
    renderExperience();
}

// Render Key Achievements
function renderAchievements() {
    const data = getCurrentData();
    const container = document.getElementById('achievements-grid');
    let html = '';

    data.keyAchievements.forEach(achievement => {
        html += '<div class="achievement-card">';
        html += '<div class="achievement-metric">' + achievement.metric + '</div>';
        html += '<div class="achievement-label">' + achievement.label + '</div>';
        html += '</div>';
    });

    container.innerHTML = html;
    setupCounterAnimations();
}

// Animated counters on key achievement metrics
function setupCounterAnimations() {
    const metrics = document.querySelectorAll('.achievement-metric');
    if (!metrics.length) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const match = el.textContent.trim().match(/^(\d+)(.*)$/);
            counterObserver.unobserve(el);
            if (!match) return;

            const target = parseInt(match[1], 10);
            const suffix = match[2];

            if (prefersReducedMotion) {
                el.textContent = target + suffix;
                return;
            }

            const duration = 1200;
            const start = performance.now();
            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                el.textContent = Math.round(target * progress) + suffix;
                if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        });
    }, { threshold: 0.5 });

    metrics.forEach((el) => counterObserver.observe(el));
}

// Intersection Observer for conditional autoplay
let experienceObserver;
let experienceAutoplayStarted = false;

function setupAutoplayObservers() {

    // Observer for Experience Swiper
    const experienceSection = document.querySelector('.experience-section');
    if (experienceSection) {
        experienceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !experienceAutoplayStarted) {
                    // User scrolled to experience section, start swiper autoplay
                    const swiper = document.querySelector('.experience-swiper').swiper;
                    if (swiper && swiper.autoplay) {
                        swiper.autoplay.start();
                        experienceAutoplayStarted = true;
                    }
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of section is visible
        });

        experienceObserver.observe(experienceSection);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
    }

    // Remove static fallback content (for crawlers that don't execute JS)
    const staticCv = document.querySelector('.static-cv');
    if (staticCv) staticCv.remove();

    // Start CSS 3D node-graph background
    setupNodeGraph();

    // Set initial language
    document.getElementById('language-text').textContent = currentLanguage === 'en' ? 'ES' : 'EN';
    updateSectionTitles();

    renderAchievements();
    renderSummary();
    renderEducation();
    renderSkills();
    renderCertifications();
    renderLanguages();
    renderExperience();

    // Setup observers for conditional autoplay
    setupAutoplayObservers();
    setupScrollspy();
    setupMobileNavSwiper();

    // Scroll-driven reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.profile-section, .achievements-section, section').forEach((el) => {
        revealObserver.observe(el);
    });

    // Remove typing cursor after animation
    setTimeout(() => {
        document.querySelector('.name').classList.add('done');
    }, 2000);

    setTimeout(() => {
        document.querySelector('.title').classList.add('done');
    }, 3400);

    // Once the contact icons finish popping in, bring them into view above
    // the fixed mobile nav and focus them, so they're not left hidden below it
    const contactIcons = document.querySelector('.contact-icons');
    const lastIcon = contactIcons ? contactIcons.lastElementChild : null;
    if (contactIcons && lastIcon) {
        lastIcon.addEventListener('animationend', () => {
            if (!window.matchMedia('(max-width: 768px)').matches) return;
            contactIcons.setAttribute('tabindex', '-1');
            contactIcons.scrollIntoView({ behavior: 'smooth', block: 'end' });
            contactIcons.focus({ preventScroll: true });
        }, { once: true });
    }
});

// Summary Carousel (Swiper, same pattern as the Experience carousel)
function wrapKaraokeForActiveSlide(swiperInstance) {
    const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
    if (!activeSlide) return;
    const summaryItem = activeSlide.querySelector('.summary-item');
    if (!summaryItem || summaryItem.hasAttribute('data-wrapped')) return;

    const bulletTexts = summaryItem.querySelectorAll('.bullet-text');
    bulletTexts.forEach(textWrapper => {
        if (!textWrapper.hasAttribute('data-wrapped')) {
            wrapLettersInSpans(textWrapper);
            textWrapper.setAttribute('data-wrapped', 'true');
        }
    });
    summaryItem.setAttribute('data-wrapped', 'true');
}

function renderSummary() {
    const data = getCurrentData();
    const container = document.getElementById('summary-carousel');
    let html = '';

    // Group items in pairs (2 items per page)
    const itemsPerPage = 2;
    const totalPages = Math.ceil(data.summaryItems.length / itemsPerPage);

    for (let i = 0; i < totalPages; i++) {
        html += '<div class="swiper-slide"><div class="summary-item"><ul class="summary-bullets">';

        for (let j = 0; j < itemsPerPage; j++) {
            const itemIndex = i * itemsPerPage + j;
            if (itemIndex < data.summaryItems.length) {
                html += '<li><span class="bullet-text">' + data.summaryItems[itemIndex] + '</span></li>';
            }
        }

        html += '</ul></div></div>';
    }

    container.innerHTML = html;

    // Destroy existing Swiper instance if it exists
    const existingSwiper = document.querySelector('.summary-swiper').swiper;
    if (existingSwiper) {
        existingSwiper.destroy(true, true);
    }

    const swiperInstance = new Swiper('.summary-swiper', {
        slidesPerView: 1,
        speed: 600,
        pagination: {
            el: '.summary-swiper .swiper-pagination',
            clickable: true
        },
        on: {
            init: (instance) => wrapKaraokeForActiveSlide(instance),
            slideChange: (instance) => wrapKaraokeForActiveSlide(instance)
        }
    });
}

function wrapLettersInSpans(element) {
    const text = element.textContent;
    const words = text.split(' ');
    element.innerHTML = '';

    let letterIndex = 0;

    words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        for (let i = 0; i < word.length; i++) {
            const span = document.createElement('span');
            span.textContent = word[i];
            span.className = 'letter';
            span.style.animationDelay = (letterIndex * 0.025) + 's';
            letterIndex++;
            wordSpan.appendChild(span);
        }

        element.appendChild(wordSpan);

        if (wordIdx < words.length - 1) {
            element.appendChild(document.createTextNode(' '));
        }
    });
}

// Experience Carousel with Swiper
function renderExperience() {
    const data = getCurrentData();
    const container = document.getElementById('experience-carousel');
    let html = '';

    data.experienceItems.forEach((item, index) => {
        html += '<div class="swiper-slide">';
        // Add 'current-job' class to first item (most recent position)
        const isCurrentJob = index === 0;
        const experienceClass = isCurrentJob ? 'experience-item current-job' : 'experience-item';
        html += '<div class="' + experienceClass + '"><h3>' + item.role + '</h3>';
        html += '<div class="company">' + item.company + ' • ' + item.location + '</div>';
        html += '<div class="meta">' + item.period + '</div><ul class="main-bullets">';

        item.description.forEach(desc => {
            html += '<li>' + desc + '</li>';
        });

        html += '</ul>';

        // Additional details are always shown inline — no expand/collapse toggle
        if (item.expandedDescription && item.expandedDescription.length > 0) {
            html += '<ul class="expanded-bullets">';

            item.expandedDescription.forEach(desc => {
                html += '<li>' + desc + '</li>';
            });

            html += '</ul>';
        }

        html += '</div></div>';
    });

    container.innerHTML = html;

    // Destroy existing Swiper instance if it exists
    const existingSwiper = document.querySelector('.experience-swiper').swiper;
    if (existingSwiper) {
        existingSwiper.destroy(true, true);
    }

    // Initialize Swiper with 3D Coverflow effect
    // Note: autoplay will be started by Intersection Observer when section becomes visible
    const swiperInstance = new Swiper('.experience-swiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        speed: 1000,
        coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true // Pause when user hovers
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        }
    });

    // Stop autoplay initially - will be started by Intersection Observer
    if (swiperInstance.autoplay) {
        swiperInstance.autoplay.stop();
    }
}

// Education
function renderEducation() {
    const data = getCurrentData();
    const container = document.getElementById('education-list');
    let html = '';

    data.educationItems.forEach(edu => {
        html += '<div class="education-item">';

        // Make institution name clickable if URL exists
        if (edu.url) {
            html += '<h3><a href="' + edu.url + '" target="_blank" rel="noopener noreferrer" class="institution-link">' + edu.institution + ' <i class="fas fa-external-link-alt"></i></a></h3>';
        } else {
            html += '<h3>' + edu.institution + '</h3>';
        }

        html += '<div class="degree">' + edu.degree + '</div>';
        html += '<div class="institution">' + edu.location + '</div>';

        if (edu.details) {
            html += '<ul style="margin-top: 10px; margin-left: 15px; color: #cbd5e1; list-style: none;">';
            edu.details.forEach(detail => {
                html += '<li style="padding-left: 10px;">• ' + detail + '</li>';
            });
            html += '</ul>';
        }
        html += '</div>';
    });

    container.innerHTML = html;
}

// Skills
function renderSkills() {
    const data = getCurrentData();
    const container = document.getElementById('skills-list');

    // Professional blue and green colors for hover
    const hoverColors = [
        '#2563eb', // Professional blue
        '#3b82f6', // Lighter blue
        '#0ea5e9', // Sky blue
        '#059669', // Emerald green
        '#10b981', // Green
        '#06b6d4'  // Cyan blue
    ];

    let html = '';
    data.skillsItems.forEach(skill => {
        html += '<div class="skills-category"><h3>' + skill.category + '</h3><div class="skill-tags">';
        skill.items.forEach(item => {
            // Assign random color from palette
            const randomColor = hoverColors[Math.floor(Math.random() * hoverColors.length)];
            html += '<span class="skill-tag" data-hover-color="' + randomColor + '">' + item.name + '</span>';
        });
        html += '</div></div>';
    });

    container.innerHTML = html;

    // Add hover listeners for color changes
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        const hoverColor = tag.getAttribute('data-hover-color');
        tag.addEventListener('mouseenter', () => {
            tag.style.borderColor = hoverColor;
            tag.style.boxShadow = `0 8px 20px rgba(0, 0, 0, 0.7), 0 0 6px ${hoverColor}80`;
        });
        tag.addEventListener('mouseleave', () => {
            tag.style.borderColor = '';
            tag.style.boxShadow = '';
        });
    });
}

// Certifications
function renderCertifications() {
    const data = getCurrentData();
    const container = document.getElementById('certifications-list');
    let html = '';
    
    data.certificationsItems.forEach(cert => {
        html += '<div class="certification-item"><h4>' + cert.name + '</h4>';
        if (cert.details) {
            html += '<div class="details">' + cert.details + '</div>';
        }
        html += '</div>';
    });
    
    container.innerHTML = html;
}

// Languages
function renderLanguages() {
    const data = getCurrentData();
    const container = document.getElementById('languages-list');
    let html = '';

    data.languagesItems.forEach((lang, index) => {
        // Determine target language based on lang.name
        const targetLang = (lang.name === 'Spanish' || lang.name === 'Español') ? 'es' : 'en';
        const isActive = currentLanguage === targetLang ? 'active' : '';

        html += '<div class="language-item ' + isActive + '" onclick="switchToLanguage(\'' + targetLang + '\')">';
        html += '<h3>' + lang.name + '</h3>';
        html += '<div class="level">' + lang.level + '</div></div>';
    });

    container.innerHTML = html;
}

// Switch to specific language
function switchToLanguage(lang) {
    if (currentLanguage !== lang) {
        toggleLanguage();
    }
}

// Copy to Clipboard
function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text).then(() => {
        let message = '';

        if (type === 'email') {
            message = currentLanguage === 'en'
                ? `Email ${text} copied`
                : `Email ${text} copiado`;
        } else if (type === 'phone') {
            message = currentLanguage === 'en'
                ? `Phone ${text} copied`
                : `Teléfono ${text} copiado`;
        } else {
            message = currentLanguage === 'en'
                ? `${text} copied`
                : `${text} copiado`;
        }

        showNotification(message);
    }).catch(err => {
        console.error('Error copying to clipboard:', err);
        const errorMessage = currentLanguage === 'en'
            ? 'Error copying to clipboard'
            : 'Error al copiar al portapapeles';
        showNotification(errorMessage);
    });
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Download Resume
function downloadResume() {
    openDownloadModal();
}

function openDownloadModal() {
    const modal = document.getElementById('downloadModal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    // Update modal text based on current language
    if (currentLanguage === 'en') {
        modalTitle.textContent = 'Download Resume';
        modalDescription.textContent = 'Choose your preferred format and language:';
    } else {
        modalTitle.textContent = 'Descargar CV';
        modalDescription.textContent = 'Elige tu formato y idioma preferido:';
    }

    modal.classList.add('show');

    // Close modal when clicking outside
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeDownloadModal();
        }
    };
}

function closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
    modal.classList.remove('show');
}

function downloadFile(fileName) {
    const resumePath = '/' + fileName;

    fetch(resumePath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                const link = document.createElement('a');
                link.href = resumePath;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                const message = currentLanguage === 'en' ? 'Resume downloaded' : 'CV descargado';
                showNotification(message);
                closeDownloadModal();
            } else {
                const message = currentLanguage === 'en' ? 'File not found' : 'Archivo no encontrado';
                showNotification(message);
            }
        })
        .catch(error => {
            console.error('Download error:', error);
            const message = currentLanguage === 'en' ? 'Download error' : 'Error al descargar';
            showNotification(message);
        });
}

