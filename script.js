// Dados iniciais
let jogadores = [];
let totalPizzas = 0;

// Elementos da página
const playersDiv = document.getElementById('players');
const addPlayerButton = document.getElementById('addPlayer');
const resetButton = document.getElementById('reset');
const leaderDiv = document.getElementById('leader');
const tempoCompeticaoDiv = document.getElementById('tempoCompeticao');
const selectJogadorInicio = document.getElementById('iniciarJogador');

// Adicionar jogador
addPlayerButton.addEventListener('click', () => {
    const nome = prompt("Digite o nome do jogador:");
    if (nome) {
        jogadores.push({ nome, contador: 0 });
        atualizarInterface();
        atualizarSelectJogadorInicio();  // Atualiza a lista de jogadores para a escolha
    }
});

// Reiniciar o contador
resetButton.addEventListener('click', () => {
    jogadores = [];
    totalPizzas = 0;
    atualizarInterface();
    atualizarSelectJogadorInicio();  // Atualiza a lista de jogadores para a escolha
});

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
        playerDiv.innerHTML = `
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

// Atualizar o select para escolher o jogador que vai começar
function atualizarSelectJogadorInicio() {
    selectJogadorInicio.innerHTML = '';  // Limpa as opções
    jogadores.forEach((jogador, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = jogador.nome;
        selectJogadorInicio.appendChild(option);
    });
}

// Adicionar pedaço para um jogador
function adicionarPeca(index) {
    if (tempoJogador > 0) {  // Só adicionar pedaços se o tempo não tiver acabado
        jogadores[index].contador++;
        totalPizzas++;
        atualizarInterface();
    } else {
        alert("O tempo acabou para esse jogador! A vez foi para o próximo.");
    }
}

// Calcular progresso da barra (em %)
function calcularProgresso(pedacos) {
    const maiorConsumo = Math.max(...jogadores.map(j => j.contador), 1);
    return (pedacos / maiorConsumo) * 100;
}

// Atualiza a interface inicialmente
atualizarInterface();

// Variáveis para o modo competição
let jogadorAtual = 0;
let tempoJogador = 10;  // Tempo de 10 segundos para cada jogador
let interval;

// Iniciar o modo competição
function iniciarModoCompeticao() {
    // Garantir que há jogadores suficientes
    if (jogadores.length < 2) {
        alert("Adicione pelo menos 2 jogadores para iniciar a competição!");
        return;
    }

    // Verifica se o jogador de início foi selecionado
    const jogadorSelecionado = selectJogadorInicio.value;
    if (jogadorSelecionado === "") {
        alert("Selecione o jogador que começará a competição.");
        return;
    }

    jogadorAtual = parseInt(jogadorSelecionado);  // Define o jogador selecionado como o primeiro
    tempoJogador = 10;  // Resetar o tempo do jogador
    atualizarTempo();  // Atualizar o tempo na interface

    // Iniciar o temporizador
    interval = setInterval(function () {
        tempoJogador--;
        atualizarTempo();

        if (tempoJogador <= 0) {
            tempoJogador = 10;  // Resetar tempo para o próximo jogador
            jogadorAtual++;

            if (jogadorAtual >= jogadores.length) {
                clearInterval(interval);
                alert('Modo Competição finalizado!');
                mostrarRanking();
            }
        }
    }, 1000);
}

// Atualizar tempo na interface
function atualizarTempo() {
    tempoCompeticaoDiv.textContent = `Tempo para ${jogadores[jogadorAtual].nome}: ${tempoJogador}s`;
}

// Exibir ranking final
function mostrarRanking() {
    jogadores.sort((a, b) => b.contador - a.contador);  // Ordenar jogadores pelo número de pedaços
    let ranking = 'Ranking:\n';
    
    jogadores.forEach((jogador, index) => {
        ranking += `${index + 1}. ${jogador.nome}: ${jogador.contador} pedaços\n`;
    });

    alert(ranking);
}

// Iniciar o modo competição ao clicar no botão
document.getElementById('modoCompeticaoBtn').addEventListener('click', iniciarModoCompeticao);
