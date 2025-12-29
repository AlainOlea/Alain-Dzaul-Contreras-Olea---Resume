// Language state
let currentLanguage = localStorage.getItem('language') || 'en';

// Resume Data - Bilingual
const resumeDataBilingual = {
    en: {
        title: 'Quality Assurance Engineering',
        professionalSummary: 'Professional Summary',
        experience: 'Experience',
        education: 'Education',
        skills: 'Skills',
        certifications: 'Certifications & Licenses',
        languages: 'Languages',
        summaryItems: [
            'Experienced Software Quality Engineer with a strong background in quality assurance, procedure adherence, and customer support.',
            'Proficient in resolving customer queries and issues related to software development programs.',
            'Skilled in critical thinking and finding out-of-the-box solutions to address complex issues.',
            'Strong team player dedicated to knowledge sharing and collaborative problem-solving.',
            'Adaptable and always seeking new solutions to improve processes and outcomes.'
        ],
        experienceItems: [
            {
                role: 'Quality Assurance',
                company: 'Rubidex',
                location: 'Mexico City',
                period: 'October 2023 - Present',
                description: [
                    '8+ months of experience in white box testing for modern web applications built with React, TypeScript, Node.js, Next.js, and Nest.js.',
                    'Developing and executing unit, integration, and end-to-end tests using frameworks like Jest, SuperTest, Playwright, and Vitest.',
                    'Collaborating closely with development teams to identify and resolve defects early in the software development lifecycle.',
                    'Ensuring code quality and application reliability through comprehensive testing strategies.'
                ]
            },
            {
                role: 'Software Quality Engineer',
                company: 'AspenTech',
                location: 'Mexico City',
                period: 'March 2021 – July 2024',
                description: [
                    'Ensured software design for clients had zero showstopper and critical issues, focusing on final customer satisfaction.',
                    'Created and executed test cases and managed test plans using VSTS/Azure DevOps.',
                    'Tested with API, Python test Frameworks, OPC UA connections.',
                    'Reduced customer-reported issues by reproducing them in a development environment.',
                    'Gained experience in the pharmaceutical industry regulations.',
                    'Utilized automation software, with most test cases executed manually for greater flexibility.',
                    'Worked under the guidance of FDA 21CFR Part 11, ISO 9001.'
                ]
            },
            {
                role: 'Software Engineer',
                company: 'Infosys',
                location: 'Mexico City',
                period: 'July 2019 – February 2021',
                description: [
                    'Provided technical support for a large account using Oracle ERP in the Supply Chain area.',
                    'Utilized Python, SQL, and Java for various projects.',
                    'Gained basic app development experience using Kotlin.',
                    'Collaborated in a multicultural environment, focusing on software development and problem resolution.'
                ]
            },
            {
                role: 'Engineering Intern',
                company: 'Pemex',
                location: 'Mexico City, Tula Hidalgo, Salina Cruz Oaxaca',
                period: 'September 2018 – March 2019',
                description: [
                    'Gathered information from different production plants for decision-making management.',
                    'Followed up on product transportation processes of gas and liquids.',
                    'Updated Piping and Instrumentation Diagrams (P&IDs).',
                    'Conducted and reported on maintenance and quality audits.',
                    'Performed industrial visits to various facilities to enhance understanding of industrial processes.'
                ]
            }
        ],
        educationItems: [
            {
                institution: 'Escuela Superior de Ingeniería Química e Industrias Extractivas (IPN)',
                location: 'Mexico City',
                degree: "Bachelor's degree in Petroleum Chemical Engineering"
            },
            {
                institution: 'Instituto Tecnológico de Buenos Aires (ITBA)',
                location: 'Buenos Aires, Argentina',
                degree: 'Exchange Program',
                details: [
                    'Courses in Chemical/Industrial Engineering:',
                    'Process Simulation and Optimization',
                    'Quality Management',
                    'Environmental Engineering'
                ]
            }
        ],
        skillsItems: [
            { category: 'Programming Languages', items: ['Python', 'SQL', 'Java', 'Fortran', 'C++'] },
            { category: 'Development & Testing', items: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Nest.js', 'Jest', 'SuperTest', 'Playwright', 'Vitest'] },
            { category: 'Software & Tools', items: ['VSTS/Azure DevOps', 'Aspen HYSYS', 'Ranorex', 'AutoCAD', 'UniSim', 'Postman', 'Microsoft Office', 'Orange', 'UAexpert', 'Aspen Plus', 'OPC Tools'] }
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
        title: 'Ingeniería de Aseguramiento de Calidad',
        professionalSummary: 'Resumen Profesional',
        experience: 'Experiencia',
        education: 'Educación',
        skills: 'Habilidades',
        certifications: 'Certificaciones y Licencias',
        languages: 'Idiomas',
        summaryItems: [
            'Ingeniero de Calidad de Software experimentado con sólida trayectoria en aseguramiento de calidad, cumplimiento de procedimientos y soporte al cliente.',
            'Competente en resolver consultas y problemas de clientes relacionados con programas de desarrollo de software.',
            'Hábil en pensamiento crítico y búsqueda de soluciones innovadoras para abordar problemas complejos.',
            'Colaborador destacado dedicado al intercambio de conocimientos y resolución colaborativa de problemas.',
            'Adaptable y siempre buscando nuevas soluciones para mejorar procesos y resultados.'
        ],
        experienceItems: [
            {
                role: 'Aseguramiento de Calidad',
                company: 'Rubidex',
                location: 'Ciudad de México',
                period: 'Octubre 2023 - Presente',
                description: [
                    'Más de 8 meses de experiencia en pruebas de caja blanca para aplicaciones web modernas construidas con React, TypeScript, Node.js, Next.js y Nest.js.',
                    'Desarrollo y ejecución de pruebas unitarias, de integración y de extremo a extremo utilizando frameworks como Jest, SuperTest, Playwright y Vitest.',
                    'Colaboración estrecha con equipos de desarrollo para identificar y resolver defectos tempranamente en el ciclo de vida del desarrollo de software.',
                    'Garantizar la calidad del código y la confiabilidad de las aplicaciones mediante estrategias de prueba integrales.'
                ]
            },
            {
                role: 'Ingeniero de Calidad de Software',
                company: 'AspenTech',
                location: 'Ciudad de México',
                period: 'Marzo 2021 – Julio 2024',
                description: [
                    'Aseguré que el diseño de software para clientes tuviera cero problemas críticos, enfocándome en la satisfacción final del cliente.',
                    'Creé y ejecuté casos de prueba y gestioné planes de prueba usando VSTS/Azure DevOps.',
                    'Realicé pruebas con API, frameworks de prueba en Python, conexiones OPC UA.',
                    'Reduje problemas reportados por clientes reproduciéndolos en un entorno de desarrollo.',
                    'Adquirí experiencia en regulaciones de la industria farmacéutica.',
                    'Utilicé software de automatización, con la mayoría de casos de prueba ejecutados manualmente para mayor flexibilidad.',
                    'Trabajé bajo la guía de FDA 21CFR Part 11, ISO 9001.'
                ]
            },
            {
                role: 'Ingeniero de Software',
                company: 'Infosys',
                location: 'Ciudad de México',
                period: 'Julio 2019 – Febrero 2021',
                description: [
                    'Proporcioné soporte técnico para una cuenta grande usando Oracle ERP en el área de Cadena de Suministro.',
                    'Utilicé Python, SQL y Java para diversos proyectos.',
                    'Adquirí experiencia básica en desarrollo de aplicaciones usando Kotlin.',
                    'Colaboré en un entorno multicultural, enfocándome en desarrollo de software y resolución de problemas.'
                ]
            },
            {
                role: 'Becario de Ingeniería',
                company: 'Pemex',
                location: 'Ciudad de México, Tula Hidalgo, Salina Cruz Oaxaca',
                period: 'Septiembre 2018 – Marzo 2019',
                description: [
                    'Recopilé información de diferentes plantas de producción para la toma de decisiones gerenciales.',
                    'Di seguimiento a procesos de transporte de productos de gas y líquidos.',
                    'Actualicé Diagramas de Tuberías e Instrumentación (P&IDs).',
                    'Realicé y reporté auditorías de mantenimiento y calidad.',
                    'Realicé visitas industriales a diversas instalaciones para mejorar la comprensión de procesos industriales.'
                ]
            }
        ],
        educationItems: [
            {
                institution: 'Escuela Superior de Ingeniería Química e Industrias Extractivas (IPN)',
                location: 'Ciudad de México',
                degree: 'Licenciatura en Ingeniería Química Petrolera'
            },
            {
                institution: 'Instituto Tecnológico de Buenos Aires (ITBA)',
                location: 'Buenos Aires, Argentina',
                degree: 'Programa de Intercambio',
                details: [
                    'Cursos en Ingeniería Química/Industrial:',
                    'Simulación y Optimización de Procesos',
                    'Gestión de Calidad',
                    'Ingeniería Ambiental'
                ]
            }
        ],
        skillsItems: [
            { category: 'Lenguajes de Programación', items: ['Python', 'SQL', 'Java', 'Fortran', 'C++'] },
            { category: 'Desarrollo y Pruebas', items: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Nest.js', 'Jest', 'SuperTest', 'Playwright', 'Vitest'] },
            { category: 'Software y Herramientas', items: ['VSTS/Azure DevOps', 'Aspen HYSYS', 'Ranorex', 'AutoCAD', 'UniSim', 'Postman', 'Microsoft Office', 'Orange', 'UAexpert', 'Aspen Plus', 'OPC Tools'] }
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
    renderSummary();
    renderEducation();
    renderSkills();
    renderCertifications();
    renderLanguages();
    renderExperience();
}

// Carousel State
let summaryIndex = 0;
let summaryAutoplay;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set initial language
    document.getElementById('language-text').textContent = currentLanguage === 'en' ? 'ES' : 'EN';
    updateSectionTitles();
    
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
    }, 3500);

    setTimeout(() => {
        document.querySelector('.title').classList.add('done');
    }, 6000);
});

// Summary Carousel
function renderSummary() {
    const data = getCurrentData();
    const container = document.getElementById('summary-carousel');
    container.innerHTML = '';
    
    data.summaryItems.forEach((item, index) => {
        const p = document.createElement('p');
        p.className = 'summary-item';
        if (index === summaryIndex) p.classList.add('active');
        p.setAttribute('data-index', index);
        p.textContent = item;
        container.appendChild(p);
    });
    
    // Wrap letters for karaoke effect on current item
    const currentItem = container.querySelector('.summary-item.active');
    if (currentItem && !currentItem.hasAttribute('data-wrapped')) {
        wrapLettersInSpans(currentItem);
        currentItem.setAttribute('data-wrapped', 'true');
    }
    
    const items = container.querySelectorAll('.summary-item');
    document.getElementById('summary-indicator').textContent = (summaryIndex + 1) + ' / ' + items.length;
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

    // Wrap letters in spans for karaoke effect
    if (!items[summaryIndex].hasAttribute('data-wrapped')) {
        wrapLettersInSpans(items[summaryIndex]);
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

    data.experienceItems.forEach(item => {
        html += '<div class="swiper-slide">';
        html += '<div class="experience-item"><h3>' + item.role + '</h3>';
        html += '<div class="company">' + item.company + ' • ' + item.location + '</div>';
        html += '<div class="meta">' + item.period + '</div><ul>';

        item.description.forEach(desc => {
            html += '<li>' + desc + '</li>';
        });

        html += '</ul></div></div>';
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
        html += '<div class="education-item"><h3>' + edu.institution + '</h3>';
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
    let html = '';
    
    data.skillsItems.forEach(skill => {
        html += '<div class="skills-category"><h3>' + skill.category + '</h3><div class="skill-tags">';
        skill.items.forEach(item => {
            html += '<span class="skill-tag">' + item + '</span>';
        });
        html += '</div></div>';
    });
    
    container.innerHTML = html;
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

    data.languagesItems.forEach(lang => {
        html += '<div class="language-item"><h3>' + lang.name + '</h3>';
        html += '<div class="level">' + lang.level + '</div></div>';
    });

    container.innerHTML = html;
}

// Copy to Clipboard
function copyToClipboard(text, message) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(message);
    }).catch(err => {
        console.error('Error al copiar:', err);
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
    const resumePath = '/resume.pdf';

    fetch(resumePath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                const link = document.createElement('a');
                link.href = resumePath;
                link.download = 'Alain_Contreras_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                showNotification('En mantenimiento');
            }
        })
        .catch(error => {
            showNotification('En mantenimiento');
        });
}
