const username = 'Rjyun10';
const projectsContainer = document.getElementById('projects-container');

// 🛠️ Repositórios que você deseja esconder do portfólio:
const projetosIgnorados = [
    'EstudoHub', 
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
    'Python_Pandas_Final'
];

document.addEventListener('DOMContentLoaded', () => {
    const githubLink = document.getElementById('github-profile-link');
    if (githubLink) {
        githubLink.href = `https://github.com/${username}`;
    }

    fetchGitHubProjects();
});

// Renderiza o card com o novo botão "Ver Site" (GitHub Pages) e o botão de Código
function renderCard(title, desc, repoLink, language) {
    if (!projectsContainer) return;

    // Gera automaticamente o link do GitHub Pages com base no nome do repositório
    const repoNameFormatted = title.toLowerCase();
    const pagesLink = `https://${username}.github.io/${repoNameFormatted}/`;

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

// Busca os repositórios públicos direto da API do GitHub filtrando os testes
async function fetchGitHubProjects() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        if (!response.ok) throw new Error('Erro ao buscar repositórios do GitHub');
        
        const repos = await response.json();

        repos.forEach(repo => {
            // Se o repositório NÃO estiver na lista de ignorados, exibe no portfólio
            if (!projetosIgnorados.includes(repo.name)) {
                renderCard(repo.name, repo.description, repo.html_url, repo.language);
            }
        });
    } catch (error) {
        console.error('Erro:', error);
    }
}