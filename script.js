// Dados iniciais
let jogadores = JSON.parse(localStorage.getItem('jogadores')) || [];
let totalPizzas = parseInt(localStorage.getItem('totalPizzas')) || 0;

// Elementos da página
const playersDiv = document.getElementById('players');
const addPlayerButton = document.getElementById('addPlayer');
const resetButton = document.getElementById('reset');
const leaderDiv = document.getElementById('leader');
const avatarModal = document.getElementById('avatarModal');
const avatarGallery = document.getElementById('avatarGallery');
const customAvatarInput = document.getElementById('customAvatar');

// Variável para armazenar temporariamente o nome do jogador enquanto ele escolhe o avatar
let jogadorAtual = null;

// Abrir modal para selecionar avatar
addPlayerButton.addEventListener('click', () => {
    const nome = prompt("Digite o nome do jogador:");
    if (nome) {
        jogadorAtual = { nome, contador: 0, avatar: null };
        avatarModal.style.display = 'block';
    }
});

// Evento para escolher um avatar da galeria
avatarGallery.addEventListener('click', (e) => {
    if (e.target.classList.contains('avatar-option')) {
        const avatar = e.target.getAttribute('data-avatar');
        jogadorAtual.avatar = avatar;
        adicionarJogador();
    }
});

// Evento para escolher avatar personalizado (imagem)
customAvatarInput.addEventListener('change', function (e) {
    const reader = new FileReader();
    reader.onload = function (event) {
        jogadorAtual.avatar = event.target.result;
        adicionarJogador();
    };
    reader.readAsDataURL(e.target.files[0]);
});

// Função para adicionar o jogador e atualizar interface
function adicionarJogador() {
    if (jogadorAtual) {
        jogadores.push(jogadorAtual);
        salvarDados();
        atualizarInterface();
        avatarModal.style.display = 'none';
        jogadorAtual = null;
    }
}

// Reiniciar o contador
resetButton.addEventListener('click', () => {
    jogadores = [];
    totalPizzas = 0;
    salvarDados();
    atualizarInterface();
});

// Atualizar a interface
function atualizarInterface() {
    playersDiv.innerHTML = '';

    let maiorContador = 0;
    let lideres = [];

    jogadores.forEach((jogador, index) => {
        if (jogador.contador > maiorContador) {
            maiorContador = jogador.contador;
            lideres = [jogador.nome];
        } else if (jogador.contador === maiorContador && maiorContador > 0) {
            lideres.push(jogador.nome);
        }

        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        // Verifica se o avatar é uma imagem personalizada ou um ícone do Font Awesome
        const avatarHTML = jogador.avatar.startsWith('data:image')
            ? `<img src="${jogador.avatar}" class="player-avatar" alt="Avatar">`
            : `<i class="fas ${jogador.avatar} player-avatar"></i>`;

        playerDiv.innerHTML = `
            ${avatarHTML}
            <span>${jogador.nome}: ${jogador.contador} pedaços</span>
            <button onclick="adicionarPeca(${index})">+1</button>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${calcularProgresso(jogador.contador)}%;"></div>
            </div>
        `;

        playersDiv.appendChild(playerDiv);
    });

    // Atualizar líder
    if (lideres.length === 1) {
        leaderDiv.textContent = `Líder: ${lideres[0]} com ${maiorContador} pedaços!`;
    } else if (lideres.length > 1) {
        leaderDiv.textContent = `Empate entre: ${lideres.join(", ")} com ${maiorContador} pedaços!`;
    } else {
        leaderDiv.textContent = "Ninguém está ganhando ainda!";
    }
}

// Adicionar pedaço para um jogador
function adicionarPeca(index) {
    jogadores[index].contador++;
    totalPizzas++;
    salvarDados();
    atualizarInterface();
}

// Calcular progresso da barra (em %)
function calcularProgresso(pedacos) {
    const maiorConsumo = Math.max(...jogadores.map(j => j.contador), 1);
    return (pedacos / maiorConsumo) * 100;
}

// Salvar os dados no localStorage
function salvarDados() {
    localStorage.setItem('jogadores', JSON.stringify(jogadores));
    localStorage.setItem('totalPizzas', totalPizzas);
}

// Fechar modal manualmente
function closeAvatarModal() {
    avatarModal.style.display = 'none';
}

// Inicializar interface
atualizarInterface();
