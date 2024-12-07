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

// Função para adicionar um jogador
addPlayerButton.addEventListener('click', () => {
    const nome = prompt("Digite o nome do jogador:");
    if (nome) {
        // Abrir modal de seleção de avatar
        avatarModal.style.display = 'block';

        const selectAvatar = (e) => {
            if (e.target.classList.contains('avatar-option')) {
                const avatar = e.target.getAttribute('data-avatar');
                jogadores.push({ nome, contador: 0, avatar });
                salvarDados();  // Salvar dados após a seleção
                atualizarInterface(); // Atualizar a interface
                avatarModal.style.display = 'none'; // Fechar o modal
                avatarGallery.removeEventListener('click', selectAvatar); // Remover o listener
            }
        };

        // Adicionando listener para avatar
        avatarGallery.addEventListener('click', selectAvatar);

        // Adicionar avatar personalizado
        customAvatarInput.addEventListener('change', function (e) {
            const reader = new FileReader();
            reader.onload = function (event) {
                jogadores.push({ nome, contador: 0, avatar: event.target.result });
                salvarDados();  // Salvar dados após avatar personalizado
                atualizarInterface(); // Atualizar a interface
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
    salvarDados();  // Salvar dados após reset
    atualizarInterface();  // Atualizar a interface
});

// Função para atualizar a interface
function atualizarInterface() {
    const fragment = document.createDocumentFragment();  // Criar fragmento para otimizar renderização
    playersDiv.innerHTML = '';  // Limpar conteúdo anterior

    let maiorContador = 0;
    let lideres = [];

    // Criar os elementos dos jogadores
    jogadores.forEach((jogador, index) => {
        if (jogador.contador > maiorContador) {
            maiorContador = jogador.contador;
            lideres = [jogador.nome];
        } else if (jogador.contador === maiorContador && maiorContador > 0) {
            lideres.push(jogador.nome);
        }

        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        const avatarIcon = jogador.avatar || "fa-user"; // Avatar ou ícone padrão
        
        playerDiv.innerHTML = `
            <i class="fas ${avatarIcon} player-avatar"></i>
            <span>${jogador.nome}: ${jogador.contador} pedaços</span>
            <button onclick="adicionarPeca(${index})">+1</button>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${calcularProgresso(jogador.contador)}%;"></div>
            </div>
        `;

        // Adicionar o novo playerDiv ao fragmento
        fragment.appendChild(playerDiv);
    });

    // Atualizar o conteúdo da div 'players' com o fragmento
    playersDiv.appendChild(fragment);

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
    salvarDados();  // Salvar dados após adição
    atualizarInterface();  // Atualizar a interface
}

// Calcular progresso da barra (em %)
function calcularProgresso(pedacos) {
    const maiorConsumo = Math.max(...jogadores.map(j => j.contador), 1);
    return (pedacos / maiorConsumo) * 100;
}

// Salvar os dados no localStorage
function salvarDados() {
    // O salvamento pode ser otimizado mais adiante para ser menos frequente
    localStorage.setItem('jogadores', JSON.stringify(jogadores));
    localStorage.setItem('totalPizzas', totalPizzas);
}

// Função para fechar o modal
function closeAvatarModal() {
    avatarModal.style.display = 'none';
}

// Atualiza a interface inicialmente
atualizarInterface();
