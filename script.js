// Language state
let currentLanguage = localStorage.getItem('language') || 'en';

// GridWarp — interactive background
class GridWarp {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.mouse = { x: -1000, y: -1000 };
        this.target = { x: -1000, y: -1000 };
        this.spacing = 50;
        this.radius = 200;
        this.maxForce = 30;
        this.isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent);
        this.clickPulse = 0;
        this.init();
    }

    init() {
        this.canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
        document.body.prepend(this.canvas);
        this.resize();
        this.createGrid();

        if (this.isMobile) {
            document.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: true });
            document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
            document.addEventListener('touchend', () => this.onTouchEnd());
            document.addEventListener('click', (e) => this.onClick(e));
        } else {
            document.addEventListener('mousemove', (e) => this.onMove(e));
            document.addEventListener('mouseleave', () => { this.target.x = -1000; this.target.y = -1000; });
        }

        window.addEventListener('resize', () => { this.resize(); this.createGrid(); });
        this.animate();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.w = window.innerWidth;
        this.h = window.innerHeight;
    }

    createGrid() {
        this.points = [];
        const cols = Math.ceil(this.w / this.spacing) + 1;
        const rows = Math.ceil(this.h / this.spacing) + 1;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * this.spacing;
                const y = j * this.spacing;
                this.points.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
            }
        }
    }

    onMove(e) {
        this.target.x = e.clientX;
        this.target.y = e.clientY;
    }

    onClick(e) {
        this.target.x = e.clientX;
        this.target.y = e.clientY;
        this.clickPulse = 2.5;
        clearTimeout(this._pulseTimeout);
        clearTimeout(this._fadeTimeout);
        this._pulseTimeout = setTimeout(() => { this.clickPulse = -0.3; }, 1000);
        this._fadeTimeout = setTimeout(() => { this.target.x = -1000; this.target.y = -1000; this.clickPulse = 0; }, 3500);
    }

    onTouchStart(e) {
        const t = e.touches[0];
        this.target.x = t.clientX;
        this.target.y = t.clientY;
        this.clickPulse = 1.5;
        clearTimeout(this._pulseTimeout);
        clearTimeout(this._fadeTimeout);
    }

    onTouchMove(e) {
        const t = e.touches[0];
        this.target.x = t.clientX;
        this.target.y = t.clientY;
    }

    onTouchEnd() {
        this._pulseTimeout = setTimeout(() => { this.clickPulse = -0.3; }, 200);
        this._fadeTimeout = setTimeout(() => { this.target.x = -1000; this.target.y = -1000; this.clickPulse = 0; }, 2500);
    }

    animate() {
        this.ctx.fillStyle = '#080808';
        this.ctx.fillRect(0, 0, this.w, this.h);

        this.mouse.x += (this.target.x - this.mouse.x) * 0.08;
        this.mouse.y += (this.target.y - this.mouse.y) * 0.08;

        if (this.clickPulse > 0) this.clickPulse *= 0.96;
        else if (this.clickPulse < 0) this.clickPulse *= 0.94;

        const pulseBoost = this.clickPulse > 0 ? 1 + this.clickPulse : 1;
        const radius = this.radius * (this.isMobile ? 2 * pulseBoost : 1);

        for (const p of this.points) {
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius && dist > 0.1) {
                const force = Math.pow(1 - dist / radius, 2) * this.maxForce * pulseBoost;
                const angle = Math.atan2(dy, dx);
                p.vx -= Math.cos(angle) * force * 0.12;
                p.vy -= Math.sin(angle) * force * 0.12;
            }

            p.vx += (p.ox - p.x) * 0.06;
            p.vy += (p.oy - p.y) * 0.06;
            p.vx *= 0.88;
            p.vy *= 0.88;
            p.x += p.vx;
            p.y += p.vy;

            const displaced = Math.sqrt((p.x - p.ox) ** 2 + (p.y - p.oy) ** 2);
            const pulseBrightness = this.clickPulse > 0 ? 1 + this.clickPulse * 0.8 : 1;
            const alpha = (0.12 + displaced * 0.04) * pulseBrightness;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(220,220,220,${Math.min(alpha, 0.75)})`;
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Resume Data - Bilingual
const resumeDataBilingual = {
    en: {
        title: 'SDET Quality Assurance',
        professionalSummary: 'Professional Summary',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        certifications: 'Certifications & Licenses',
        languages: 'Languages',
        summaryItems: [
            'Quality-focused engineer who believes great software comes from great collaboration—4+ years partnering with developers, stakeholders, and end users to deliver reliable solutions',
            'Translate complex technical requirements into clear acceptance criteria and actionable test strategies that teams actually use',
            'Built trust with leadership by acting as technical bridge between C-Level vision and development execution, improving product satisfaction from 6/10 to 8/10',
            'Hands-on engineer who strengthens teams through knowledge sharing, automated testing frameworks, and streamlined processes (CI/CD, Three Amigos)',
            'Proven track record in high-stakes environments: 5 consecutive zero-bug releases, 100% FDA audit pass rate'
        ],
        keyAchievements: [
            { metric: '33%', label: 'Quality improvement (6/10 → 8/10)' },
            { metric: '800+', label: 'Automated tests created' },
            { metric: '100%', label: 'FDA audit pass rate' },
            { metric: '5', label: 'Bug-free releases in a row' }
        ],
        experienceItems: [
            {
                role: 'Quality Assurance',
                company: 'Rubidex',
                location: 'Mexico City',
                period: 'February 2025 - Present',
                description: [
                    'Improved product quality from 6/10 to 8/10 client satisfaction (33% increase)',
                    'Built 800+ automated tests (600 unit, 200 integration, 10 E2E) serving dual purpose: validation and living documentation',
                    'Led QA for 7 developers across 2 teams, blocking 5+ critical bugs pre-production'
                ],
                expandedDescription: [
                    'Implemented CI/CD pipelines for Frontend/Backend and agile processes: Three Amigos, Design Handoffs, Definition of Ready',
                    'Acted as technical bridge between leadership and development, refining requirements and defining acceptance criteria for complex modules',
                    'Established change control governance and process standardization to protect sprint scope and mitigate risks'
                ]
            },
            {
                role: 'Software Quality Engineer',
                company: 'AspenTech',
                location: 'Mexico City',
                period: 'March 2021 – July 2024',
                description: [
                    '5 consecutive releases with zero critical bugs (zero showstoppers)',
                    'Passed 2 FDA audits + 3+ client audits with no critical observations',
                    'Managed 1,600+ test cases for pharmaceutical spectrometry software (50 specialized users)'
                ],
                expandedDescription: [
                    'Delivered multiple successful releases for enterprise client with 3 interdependent products',
                    'Complete documentation under FDA 21CFR Part 11 and ISO 9001 compliance',
                    'Hybrid testing approach: 10% automated (critical flows) + 90% manual (regulatory flexibility)'
                ]
            },
            {
                role: 'Software Engineer',
                company: 'Infosys',
                location: 'Mexico City',
                period: 'July 2019 – February 2021',
                description: [
                    'L2/L3 technical support for 5,000+ users in Fortune 500 client (multi-continental operations)',
                    'Resolved ~25 tickets/month in Oracle ERP Supply Chain using Python, SQL, and Java',
                    'Collaborated in multicultural team for international enterprise-scale project'
                ],
                expandedDescription: [
                    'Android development with Kotlin for internal tools'
                ]
            },
            {
                role: 'Engineering Intern',
                company: 'Pemex',
                location: 'Mexico City, Tula Hidalgo, Salina Cruz Oaxaca',
                period: 'September 2018 – March 2019',
                description: [
                    'Analyzed gas production optimization data and performed ethylene production forecasting that aligned with subsequent downward trends in national output',
                    'Visited 5 facilities (refineries, distribution centers, gas processing plants) for operational audits'
                ],
                expandedDescription: [
                    'Supported gas and liquid transportation process tracking',
                    'Participated in large-scale industrial operations in energy sector'
                ]
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
                category: 'AI & Development Tools',
                items: [
                    { name: 'Antigravity', description: 'AI-powered development environment for rapid prototyping' },
                    { name: 'Claude Code', description: 'AI coding assistant CLI for autonomous software development' },
                    { name: 'Gemini CLI', description: 'Google\'s AI assistant command-line interface for coding tasks' },
                    { name: 'WindSurf', description: 'AI-first IDE with intelligent code completion and refactoring' }
                ]
            },
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
            }
        ],
        certificationsItems: [
            { name: 'Certified in ISO 9001:2015', details: '' },
            { name: 'Professional License (Cédula Profesional)', details: 'Chemical Engineering — Number: 12075687' }
        ],
        languagesItems: [
            { name: 'Spanish', level: 'Native' },
            { name: 'English', level: 'Full Professional Proficiency' }
        ]
    },
    es: {
        title: 'SDET Aseguramiento de Calidad',
        professionalSummary: 'Resumen Profesional',
        experience: 'Experiencia',
        education: 'Educación',
        skills: 'Habilidades',
        certifications: 'Certificaciones y Licencias',
        languages: 'Idiomas',
        summaryItems: [
            'Ingeniero enfocado en calidad que cree que el gran software nace de la gran colaboración—4+ años trabajando con developers, stakeholders y usuarios finales para entregar soluciones confiables',
            'Traduzco requerimientos técnicos complejos en criterios de aceptación claros y estrategias de testing accionables que los equipos realmente usan',
            'Construí confianza con liderazgo actuando como puente técnico entre la visión de C-Level y la ejecución de desarrollo, mejorando la satisfacción del producto de 6/10 a 8/10',
            'Ingeniero práctico que fortalece equipos a través de compartir conocimiento, frameworks de testing automatizado y procesos optimizados (CI/CD, Three Amigos)',
            'Historial comprobado en ambientes críticos: 5 releases consecutivos sin bugs, 100% de tasa de aprobación en auditorías FDA'
        ],
        keyAchievements: [
            { metric: '33%', label: 'Mejora de calidad (6/10 → 8/10)' },
            { metric: '800+', label: 'Tests automatizados creados' },
            { metric: '100%', label: 'Tasa de aprobación FDA' },
            { metric: '5', label: 'Releases sin bugs consecutivos' }
        ],
        experienceItems: [
            {
                role: 'Aseguramiento de Calidad',
                company: 'Rubidex',
                location: 'Ciudad de México',
                period: 'Febrero 2025 - Presente',
                description: [
                    'Mejoré la calidad del producto de 6/10 a 8/10 en satisfacción del cliente (incremento del 33%)',
                    'Desarrollé 800+ tests automatizados (600 unitarios, 200 integración, 10 E2E) con doble propósito: validación y documentación viva',
                    'Lideré QA para 7 developers en 2 equipos, bloqueando 5+ bugs críticos pre-producción'
                ],
                expandedDescription: [
                    'Implementé pipelines CI/CD para Frontend/Backend y procesos ágiles: Three Amigos, Design Handoffs, Definition of Ready',
                    'Actué como puente técnico entre liderazgo y desarrollo, refinando requerimientos y definiendo criterios de aceptación para módulos complejos',
                    'Establecí control de cambios y estandarización de procesos para proteger el alcance del sprint y mitigar riesgos'
                ]
            },
            {
                role: 'Ingeniero de Calidad de Software',
                company: 'AspenTech',
                location: 'Ciudad de México',
                period: 'Marzo 2021 – Julio 2024',
                description: [
                    '5 releases consecutivos con cero bugs críticos (cero showstoppers)',
                    'Aprobé 2 auditorías FDA + 3+ auditorías de clientes sin observaciones críticas',
                    'Gestioné 1,600+ casos de prueba para software de espectrometría farmacéutica (50 usuarios especializados)'
                ],
                expandedDescription: [
                    'Entregué múltiples releases exitosos para cliente enterprise con 3 productos interdependientes',
                    'Documentación completa bajo cumplimiento FDA 21CFR Part 11 e ISO 9001',
                    'Enfoque de testing híbrido: 10% automatizado (flujos críticos) + 90% manual (flexibilidad regulatoria)'
                ]
            },
            {
                role: 'Ingeniero de Software',
                company: 'Infosys',
                location: 'Ciudad de México',
                period: 'Julio 2019 – Febrero 2021',
                description: [
                    'Soporte técnico L2/L3 para 5,000+ usuarios en cliente Fortune 500 (operaciones multi-continentales)',
                    'Resolví ~25 tickets/mes en Oracle ERP Supply Chain usando Python, SQL y Java',
                    'Colaboré en equipo multicultural para proyecto internacional a escala enterprise'
                ],
                expandedDescription: [
                    'Desarrollo Android con Kotlin para herramientas internas'
                ]
            },
            {
                role: 'Becario de Ingeniería',
                company: 'Pemex',
                location: 'Ciudad de México, Tula Hidalgo, Salina Cruz Oaxaca',
                period: 'Septiembre 2018 – Marzo 2019',
                description: [
                    'Analicé datos de optimización de producción de gas y realicé forecasting de producción de etileno que se alineó con la tendencia nacional de disminución subsecuente',
                    'Visité 5 instalaciones (refinerías, centros de distribución, plantas de procesamiento de gas) para auditorías operacionales'
                ],
                expandedDescription: [
                    'Apoyé seguimiento de procesos de transportación de gas y líquidos',
                    'Participé en operaciones industriales a gran escala en sector energético'
                ]
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
                category: 'IA y Herramientas de Desarrollo',
                items: [
                    { name: 'Antigravity', description: 'Entorno de desarrollo potenciado por IA para prototipado rápido' },
                    { name: 'Claude Code', description: 'Asistente de código IA CLI para desarrollo autónomo de software' },
                    { name: 'Gemini CLI', description: 'Interfaz de línea de comandos del asistente IA de Google para tareas de código' },
                    { name: 'WindSurf', description: 'IDE con IA integrada para autocompletado y refactorización inteligente' }
                ]
            },
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
            }
        ],
        certificationsItems: [
            { name: 'Certificado en ISO 9001:2015', details: '' },
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
}

// Carousel State
let summaryIndex = 0;
let summaryAutoplay;

// Intersection Observer for conditional autoplay
let summaryObserver;
let experienceObserver;
let summaryAutoplayStarted = false;
let experienceAutoplayStarted = false;

function setupAutoplayObservers() {
    // Observer for Summary Carousel
    const summarySection = document.querySelector('.summary-section');
    if (summarySection) {
        summaryObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !summaryAutoplayStarted) {
                    // User scrolled to summary section, start autoplay
                    startSummaryAutoplay();
                    summaryAutoplayStarted = true;
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of section is visible
        });

        summaryObserver.observe(summarySection);
    }

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

    // Start interactive grid background
    new GridWarp();

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
    showSummary(0);

    // Setup observers for conditional autoplay
    setupAutoplayObservers();

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
});

// Summary Carousel
function renderSummary() {
    const data = getCurrentData();
    const container = document.getElementById('summary-carousel');
    container.innerHTML = '';

    // Group items in pairs (2 items per page)
    const itemsPerPage = 2;
    const totalPages = Math.ceil(data.summaryItems.length / itemsPerPage);

    for (let i = 0; i < totalPages; i++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'summary-item';
        if (i === summaryIndex) pageDiv.classList.add('active');
        pageDiv.setAttribute('data-index', i);

        const ul = document.createElement('ul');
        ul.className = 'summary-bullets';

        // Add 2 items to this page
        for (let j = 0; j < itemsPerPage; j++) {
            const itemIndex = i * itemsPerPage + j;
            if (itemIndex < data.summaryItems.length) {
                const li = document.createElement('li');
                const textWrapper = document.createElement('span');
                textWrapper.className = 'bullet-text';
                textWrapper.textContent = data.summaryItems[itemIndex];
                li.appendChild(textWrapper);
                ul.appendChild(li);
            }
        }

        pageDiv.appendChild(ul);
        container.appendChild(pageDiv);
    }

    // Wrap letters for karaoke effect on current item
    const currentItem = container.querySelector('.summary-item.active');
    if (currentItem && !currentItem.hasAttribute('data-wrapped')) {
        const bulletTexts = currentItem.querySelectorAll('.bullet-text');
        bulletTexts.forEach(textWrapper => {
            if (!textWrapper.hasAttribute('data-wrapped')) {
                wrapLettersInSpans(textWrapper);
                textWrapper.setAttribute('data-wrapped', 'true');
            }
        });
        currentItem.setAttribute('data-wrapped', 'true');
    }

    document.getElementById('summary-indicator').textContent = (summaryIndex + 1) + ' / ' + totalPages;
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

function showSummary(index) {
    summaryIndex = index;
    const items = document.querySelectorAll('.summary-item');
    if (summaryIndex >= items.length) summaryIndex = 0;
    if (summaryIndex < 0) summaryIndex = items.length - 1;

    items.forEach(item => item.classList.remove('active'));
    items[summaryIndex].classList.add('active');

    // Wrap letters in spans for karaoke effect on each bullet-text
    if (!items[summaryIndex].hasAttribute('data-wrapped')) {
        const bulletTexts = items[summaryIndex].querySelectorAll('.bullet-text');
        bulletTexts.forEach(textWrapper => {
            if (!textWrapper.hasAttribute('data-wrapped')) {
                wrapLettersInSpans(textWrapper);
                textWrapper.setAttribute('data-wrapped', 'true');
            }
        });
        items[summaryIndex].setAttribute('data-wrapped', 'true');
    }

    document.getElementById('summary-indicator').textContent = summaryIndex + 1 + ' / ' + items.length;
}

function nextSummary() {
    summaryIndex++;
    showSummary(summaryIndex);
    resetSummaryAutoplay();
}

function prevSummary() {
    summaryIndex--; 
    showSummary(summaryIndex);
    resetSummaryAutoplay();
}

function startSummaryAutoplay() {
    summaryAutoplay = setInterval(() => {
        summaryIndex++;
        showSummary(summaryIndex);
    }, 10000);
}

function resetSummaryAutoplay() {
    clearInterval(summaryAutoplay);
    startSummaryAutoplay();
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

        // Add expandable section if there are expanded descriptions
        if (item.expandedDescription && item.expandedDescription.length > 0) {
            const buttonText = currentLanguage === 'en' ? 'See full details' : 'Ver detalles completos';
            const hideText = currentLanguage === 'en' ? 'Hide details' : 'Ocultar detalles';

            html += '<button class="expand-btn" onclick="toggleExpand(this)">' + buttonText + ' ↓</button>';
            html += '<ul class="expanded-bullets" data-hide-text="' + hideText + '">';

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

// Toggle expand/collapse for experience details
function toggleExpand(button) {
    const expandedSection = button.nextElementSibling;
    const isExpanded = expandedSection.classList.contains('show');

    if (isExpanded) {
        expandedSection.classList.remove('show');
        const showText = currentLanguage === 'en' ? 'See full details' : 'Ver detalles completos';
        button.textContent = showText + ' ↓';
    } else {
        expandedSection.classList.add('show');
        const hideText = expandedSection.getAttribute('data-hide-text');
        button.textContent = hideText + ' ↑';
    }
}
