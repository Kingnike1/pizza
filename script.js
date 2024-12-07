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

// Adicionar jogador
// Adicionar jogador
// Adicionar jogador
addPlayerButton.addEventListener('click', () => {
    const nome = prompt("Digite o nome do jogador:");
    if (nome) {
        // Abrir modal de seleção de avatar
        avatarModal.style.display = 'block';
        
        // Esperar o jogador escolher o avatar
        avatarGallery.addEventListener('click', function(e) {
            if (e.target.classList.contains('avatar-option')) {
                const avatar = e.target.getAttribute('data-avatar');
                jogadores.push({ nome, contador: 0, avatar });
                salvarDados(); // Salvar no localStorage
                atualizarInterface();
                avatarModal.style.display = 'none'; // Fechar o modal
            }
        });

        // Adicionar avatar personalizado
        customAvatarInput.addEventListener('change', function(e) {
            const reader = new FileReader();
            reader.onload = function(event) {
                jogadores.push({ nome, contador: 0, avatar: event.target.result });
                salvarDados();
                atualizarInterface();
                avatarModal.style.display = 'none'; // Fechar o modal
            };
            reader.readAsDataURL(e.target.files[0]);
        });
    }
});



// Reiniciar o contador
resetButton.addEventListener('click', () => {
    jogadores = [];
    totalPizzas = 0;
    salvarDados(); // Salvar no localStorage
    atualizarInterface();
});

// Atualizar interface
// Atualizar interface
function atualizarInterface() {
    // Limpa os jogadores e recria
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

        // Criar o jogador e sua barra de progresso
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        
        // Use um ícone do Font Awesome como avatar
        const avatarIcon = jogador.avatar || "fa-user"; // Definir um ícone padrão caso não tenha avatar
        
        playerDiv.innerHTML = `
            <i class="fas ${avatarIcon} player-avatar"></i> <!-- Usando o ícone do Font Awesome -->
            <span>${jogador.nome}: ${jogador.contador} pedaços</span>
            <button onclick="adicionarPeca(${index})">+1</button>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${calcularProgresso(jogador.contador)}%;"></div>
            </div>
        `;
        playersDiv.appendChild(playerDiv);
    });

    // Atualiza o líder
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
    salvarDados(); // Salvar no localStorage
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

// Função para fechar o modal
function closeAvatarModal() {
    avatarModal.style.display = 'none';
}

// Atualiza a interface inicialmente
atualizarInterface();
