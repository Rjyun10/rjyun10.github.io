const username = 'Rjyun10';
const projectsContainer = document.getElementById('projects-container');
const btnLoadMore = document.getElementById('btn-load-more');

const projetosDestaque = [
    'EstudoHub',
    'LabCiencia', 
    'DarkInvest-2026',
    'InvestSim-2026',
    'Simulador-de-Investimentos-2026',
    'A-Conjectura-de-Collatz',
    'Garagem-Seleta'
];

const projetosIgnorados = [
    'BootStrap', 
    'Academia-Alta-Forma',
    'GearHeadMind',
    'world_pixelated',
    'HTML',
    'HTML_0.1',
    'HTML.WebFront',
    'yakisobaorientaljaguariuna',
    'Marisa',
    'Todas-as-aulas-de-WebDesinger',
    'HTML_1.2',
    'Atividades-WebDesinger-HTML-e-CSS',
    'Python_Pandas_Final',
    'rjyun10.github.io'
];

// Dicionário para traduzir descrições mantendo os nomes originais
const projectDescriptions = {
    'EstudoHub': 'EstudoHub is a web platform for students that centralizes productivity tools, study feeds, focus timers, academic calculator, and financial planner with multiple theme support.',
    'LabCiencia': 'LabCiencia is an interactive web platform developed to bring students and science enthusiasts closer to practical science. Featuring digital book-style guides, it presents simple experiments in Chemistry, Physics, Biology, and Mathematics using everyday materials.',
    'DarkInvest-2026': 'Interactive web panel for real estate financing simulation (Price/SAC systems), compound interest calculations, asset targets, and real-time currency and asset tracking.',
    'InvestSim-2026': 'Interactive web application for financial investment simulation and projection, focused on demonstrating yield plans and supporting financial planning intuitively.',
    'Simulador-de-Investimentos-2026': 'Dynamic tool developed in JavaScript to calculate investment returns, allowing users to test different terms, amounts, and interest rates easily.',
    'A-Conjectura-de-Collatz': 'Interactive project to explore the famous Collatz mathematical problem (3n + 1), visualizing number sequences and growth charts.',
    'Garagem-Seleta': 'Interactive platform for vehicle management and showcase, allowing users to filter models and query specific details.',
    'Robo-Falso-2026': 'Styled interface simulating chat flow and chatbot responses, focusing on visual architecture and user experience through web components.'
};

let todosProjetos = [];
let projetosExibidos = 0;
const itensPorPagina = 8;

document.addEventListener('DOMContentLoaded', () => {
    const githubLink = document.getElementById('github-profile-link');
    if (githubLink) {
        githubLink.href = `https://github.com/${username}`;
    }

    fetchGitHubProjects();
    initNavbarObserver();
    initMobileNavClose();

    if (btnLoadMore) {
        btnLoadMore.addEventListener('click', exibirMaisProjetos);
    }
});

function renderCard(title, desc, repoLink, language) {
    if (!projectsContainer) return;

    const pagesLink = `https://${username}.github.io/${title}/`;
    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-6 col-lg-4 col-xl-3';

    const finalDesc = projectDescriptions[title] || desc || 'No description provided.';

    cardCol.innerHTML = `
        <div class="card h-100 p-3 shadow-sm">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-break text-info fw-semibold notranslate" translate="no" title="${title}">${title}</h5>
                <p class="card-text flex-grow-1 small mt-2" style="color: var(--cor-texto-mudo);">${finalDesc}</p>
                <div class="mb-3 mt-2">
                    <span class="badge bg-info bg-opacity-25 border border-info text-info">${language || 'Various'}</span>
                </div>
                <div class="d-flex gap-2 mt-auto pt-2">
                    <a href="${pagesLink}" target="_blank" class="btn btn-site btn-sm flex-fill fw-bold text-dark text-nowrap py-2 notranslate" translate="no">
                        <i class="fas fa-globe me-1 icon-globe"></i> View Site
                    </a>
                    <a href="${repoLink}" target="_blank" class="btn btn-outline-light btn-sm flex-fill text-nowrap py-2 notranslate" translate="no">
                        <i class="fab fa-github"></i> Code
                    </a>
                </div>
            </div>
        </div>
    `;
    projectsContainer.appendChild(cardCol);
}

function exibirMaisProjetos() {
    const proximoLimite = projetosExibidos + itensPorPagina;
    const arrayParaExibir = todosProjetos.slice(projetosExibidos, proximoLimite);

    arrayParaExibir.forEach(repo => {
        renderCard(repo.name, repo.description, repo.html_url, repo.language);
    });

    projetosExibidos = proximoLimite;

    if (btnLoadMore) {
        if (projetosExibidos >= todosProjetos.length) {
            btnLoadMore.classList.add('d-none');
        } else {
            btnLoadMore.classList.remove('d-none');
        }
    }
}

async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        if (!response.ok) throw new Error('Error fetching GitHub repositories');
        
        let repos = await response.json();

        repos = repos.filter(repo => !projetosIgnorados.includes(repo.name));

        repos.sort((a, b) => {
            const indexA = projetosDestaque.indexOf(a.name);
            const indexB = projetosDestaque.indexOf(b.name);

            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return 0;
        });

        todosProjetos = repos;
        projetosExibidos = 0;
        if (projectsContainer) projectsContainer.innerHTML = '';

        if (todosProjetos.length === 0) {
            projectsContainer.innerHTML = '<div class="col-12 text-center text-muted"><p>No projects found at the moment.</p></div>';
            return;
        }

        exibirMaisProjetos();

    } catch (error) {
        console.error('Error:', error);
        if (projectsContainer) {
            projectsContainer.innerHTML = `
                <div class="col-12 text-center text-danger py-4">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p>Could not load GitHub projects at the moment. Please try again later.</p>
                </div>
            `;
        }
    }
}

function initNavbarObserver() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

function initMobileNavClose() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');

    if (navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) {
                    bsCollapse.hide();
                }
            });
        });
    }
}

// --- Formulário de Contato via AJAX (Formspree) ---
const contactForm = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success-msg');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const btnSubmit = document.getElementById('btn-submit');
        
        if (btnSubmit) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';
        }

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                contactForm.reset();

                if (successMsg) {
                    successMsg.classList.remove('d-none');
                    
                    setTimeout(() => {
                        successMsg.classList.add('d-none');
                    }, 5000);
                }
            } else {
                alert('An error occurred while sending the message. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Connection error. Please check your internet.');
        } finally {
            if (btnSubmit) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Send Message';
            }
        }
    });
}