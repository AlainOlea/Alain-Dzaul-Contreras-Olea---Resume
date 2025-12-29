// Language state
let currentLanguage = localStorage.getItem('language') || 'en';

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
            'Experienced Software Quality Engineer with strong background in quality assurance, procedure adherence, and customer support',
            'Proven track record: 5 consecutive zero-bug releases, 33% quality improvement (6/10 → 8/10)',
            'Specialized in QA for pharmaceutical-grade software under FDA 21CFR Part 11 compliance',
            'Full-stack QA expertise: 800+ automated tests across React/TypeScript/Node.js/Next.js/Nest.js stack',
            'Skilled in critical thinking and finding out-of-the-box solutions to address complex issues',
            'Proficient in resolving customer queries and issues related to software development programs with detail-oriented approach',
            'Technical leadership: Led QA for 7 developers, implemented CI/CD, Three Amigos, Definition of Ready',
            'Strong team player dedicated to knowledge sharing and collaborative problem-solving',
            'Expert in both automated and manual testing strategies, including unit, integration, E2E, and white-box testing',
            'Adaptable professional always seeking new solutions to improve processes and outcomes',
            'Multi-industry experience: Pharmaceutical, Enterprise Software, Energy sectors',
            'Proficient in modern testing frameworks: Jest, Playwright, Vitest, SuperTest for comprehensive quality assurance',
            'Experienced in Agile/Scrum methodologies with focus on continuous integration and iterative improvement',
            'Passionate about leveraging AI tools (Claude Code, Gemini CLI, WindSurf) to enhance testing efficiency and code quality'
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
                    'Acted as technical bridge between C-Level and development, refining requirements and defining acceptance criteria for complex modules',
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
                    'Delivered 7-8 successful releases for enterprise client with 3 interdependent products',
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
                    'Basic Android development with Kotlin for internal tools'
                ]
            },
            {
                role: 'Engineering Intern',
                company: 'Pemex',
                location: 'Mexico City, Tula Hidalgo, Salina Cruz Oaxaca',
                period: 'September 2018 – March 2019',
                description: [
                    'Analyzed and collected data from gas production optimization system, performing ethylene production forecasting with predictions that accurately reflected subsequent national production decline',
                    'Visited 5 facilities (refineries, distribution centers, gas processing plants) for operational audits'
                ],
                expandedDescription: [
                    'Supported gas and liquid transportation process tracking',
                    'Gained exposure to large-scale industrial operations in energy sector'
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
                url: 'https://www.itba.edu.ar/'
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
            { name: 'Professional License', details: 'Number: 12075687' }
        ],
        languagesItems: [
            { name: 'Spanish', level: 'Native' },
            { name: 'English', level: 'Professional Fluency' }
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
            'Ingeniero de Calidad de Software experimentado con sólida trayectoria en aseguramiento de calidad, cumplimiento de procedimientos y soporte al cliente',
            'Historial comprobado: 5 releases consecutivos sin bugs, mejora de calidad del 33% (6/10 → 8/10)',
            'Especializado en QA para software farmacéutico bajo cumplimiento FDA 21CFR Part 11',
            'Expertise en QA full-stack: 800+ tests automatizados en React/TypeScript/Node.js/Next.js/Nest.js',
            'Hábil en pensamiento crítico y búsqueda de soluciones innovadoras para abordar problemas complejos',
            'Competente en resolver consultas y problemas de clientes relacionados con programas de desarrollo de software con enfoque orientado al detalle',
            'Liderazgo técnico: Lideré QA para 7 developers, implementé CI/CD, Three Amigos, Definition of Ready',
            'Colaborador destacado dedicado al intercambio de conocimientos y resolución colaborativa de problemas',
            'Experto en estrategias de testing automatizado y manual, incluyendo pruebas unitarias, integración, E2E y white-box',
            'Profesional adaptable siempre buscando nuevas soluciones para mejorar procesos y resultados',
            'Experiencia multi-industria: Farmacéutica, Software Enterprise, Energía',
            'Competente en frameworks modernos de testing: Jest, Playwright, Vitest, SuperTest para aseguramiento de calidad integral',
            'Experimentado en metodologías Agile/Scrum con enfoque en integración continua y mejora iterativa',
            'Apasionado por aprovechar herramientas de IA (Claude Code, Gemini CLI, WindSurf) para mejorar eficiencia de testing y calidad de código'
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
                    'Actué como puente técnico entre C-Level y desarrollo, refinando requerimientos y definiendo criterios de aceptación para módulos complejos',
                    'Establecí gobernanza de control de cambios y estandarización de procesos para proteger el alcance del sprint y mitigar riesgos'
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
                    'Entregué 7-8 releases exitosos para cliente enterprise con 3 productos interdependientes',
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
                    'Desarrollo básico Android con Kotlin para herramientas internas'
                ]
            },
            {
                role: 'Becario de Ingeniería',
                company: 'Pemex',
                location: 'Ciudad de México, Tula Hidalgo, Salina Cruz Oaxaca',
                period: 'Septiembre 2018 – Marzo 2019',
                description: [
                    'Analicé y recopilé datos del sistema de optimización de producción de gas, realizando forecasting de producción de etileno con predicciones que reflejaron con precisión la posterior caída de producción nacional',
                    'Visité 5 instalaciones (refinerías, centros de distribución, plantas de procesamiento de gas) para auditorías operacionales'
                ],
                expandedDescription: [
                    'Apoyé seguimiento de procesos de transportación de gas y líquidos',
                    'Obtuve exposición a operaciones industriales a gran escala en sector energético'
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
                url: 'https://www.itba.edu.ar/'
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
            { name: 'Licencia Profesional', details: 'Número: 12075687' }
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

// Toggle language
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    localStorage.setItem('language', currentLanguage);
    
    // Update language button text
    document.getElementById('language-text').textContent = currentLanguage === 'en' ? 'ES' : 'EN';
    
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
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
    startSummaryAutoplay();

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
        // Wrap each word in a span to keep it together
        for (let i = 0; i < word.length; i++) {
            const span = document.createElement('span');
            span.textContent = word[i];
            span.className = 'letter';
            span.style.animationDelay = (letterIndex * 0.05) + 's';
            letterIndex++;
            element.appendChild(span);
        }

        // Add space after word (except last word)
        if (wordIdx < words.length - 1) {
            element.appendChild(document.createTextNode(' '));
        }
    });
}

function showSummary(index) {
    const items = document.querySelectorAll('.summary-item');
    if (index >= items.length) summaryIndex = 0;
    if (index < 0) summaryIndex = items.length - 1;

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
    }, 5000);
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
        html += '<div class="experience-item"><h3>' + item.role + '</h3>';
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
    new Swiper('.experience-swiper', {
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
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        }
    });
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
