const username = 'Rjyun10';
const projectsContainer = document.getElementById('projects-container');


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
    'Rjyun10.github.io'
];

document.addEventListener('DOMContentLoaded', () => {
    const githubLink = document.getElementById('github-profile-link');
    if (githubLink) {
        githubLink.href = `https://github.com/${username}`;
    }

    fetchGitHubProjects();
});

function renderCard(title, desc, repoLink, language) {
    if (!projectsContainer) return;

    const pagesLink = `https://${username}.github.io/${title}/`;

    const cardCol = document.createElement('div');
    cardCol.className = 'col-md-4';

    cardCol.innerHTML = `
        <div class="card h-100 p-3 shadow-sm">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${title}</h5>
                <p class="card-text text-muted flex-grow-1">${desc || 'Sem descrição informada.'}</p>
                <div class="mb-2">
                    <span class="badge bg-secondary">${language || 'Diversos'}</span>
                </div>
                <!-- Botões modernos: Ver Site e Código -->
                <div class="d-flex gap-2 mt-auto">
                    <a href="${pagesLink}" target="_blank" class="btn btn-primary btn-sm w-50 btn-site">
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

        repos.forEach(repo => {
            renderCard(repo.name, repo.description, repo.html_url, repo.language);
        });

    } catch (error) {
        console.error('Erro:', error);
    }
}