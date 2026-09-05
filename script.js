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

    cardCol.innerHTML = `
        <div class="card h-100 p-3 shadow-sm">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate text-info fw-semibold" title="${title}">${title}</h5>
                <p class="card-text flex-grow-1 small mt-2">${desc || 'Sem descrição informada.'}</p>
                <div class="mb-3 mt-2">
                    <span class="badge bg-info bg-opacity-25 border border-info text-info">${language || 'Diversos'}</span>
                </div>
                <div class="d-flex gap-2 mt-auto">
                    <a href="${pagesLink}" target="_blank" class="btn btn-site btn-sm w-50 fw-bold text-dark">
                        <i class="fas fa-globe me-1 icon-globe"></i> Ver Site
                    </a>
                    <a href="${repoLink}" target="_blank" class="btn btn-outline-light btn-sm w-50">
                        <i class="fab fa-github"></i> Código
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
        if (!response.ok) throw new Error('Erro ao buscar repositórios do GitHub');
        
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
            projectsContainer.innerHTML = '<div class="col-12 text-center text-muted"><p>Nenhum projeto encontrado no momento.</p></div>';
            return;
        }

        exibirMaisProjetos();

    } catch (error) {
        console.error('Erro:', error);
        if (projectsContainer) {
            projectsContainer.innerHTML = `
                <div class="col-12 text-center text-danger py-4">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p>Não foi possível carregar os projetos do GitHub no momento. Tente novamente mais tarde.</p>
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