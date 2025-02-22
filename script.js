// script.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, set, push, remove, onValue, update } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyDU0_pk_UzpaudRkHAUkBDuvysWuAE1YEQ",
    authDomain: "pizza-88154.firebaseapp.com",
    databaseURL: "https://pizza-88154-default-rtdb.firebaseio.com",
    projectId: "pizza-88154",
    storageBucket: "pizza-88154.firebasestorage.app",
    messagingSenderId: "494260841198",
    appId: "1:494260841198:web:8576c107cebef0e0f461ff"
};

// Inicializar o Firebase e o Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const jogadoresRef = ref(db, "jogadores");

document.addEventListener("DOMContentLoaded", () => {
    // Remova a verificação de "firebase" global, pois ela não é necessária com módulos

    // Elementos da página
    const playersDiv = document.getElementById('players');
    const addPlayerButton = document.getElementById('addPlayer');
    const resetButton = document.getElementById('reset');
    const leaderDiv = document.getElementById('leader');
    const avatarModal = document.getElementById('avatarModal');
    const avatarGallery = document.getElementById('avatarGallery');
    const customAvatarInput = document.getElementById('customAvatar');

    let jogadorAtual = null;

    if (addPlayerButton) {
        addPlayerButton.addEventListener('click', () => {
            const nome = prompt("Digite o nome do jogador:");
            if (nome) {
                jogadorAtual = { nome, contador: 0, avatar: null };
                if (avatarModal) {
                    avatarModal.style.display = 'block';
                } else {
                    console.error("Elemento avatarModal não encontrado.");
                }
            }
        });
    } else {
        console.error("Botão 'addPlayer' não encontrado!");
    }

    if (avatarGallery) {
        avatarGallery.addEventListener('click', (e) => {
            if (e.target.classList.contains('avatar-option')) {
                jogadorAtual.avatar = e.target.getAttribute('data-avatar');
                adicionarJogador();
            }
        });
    }

    if (customAvatarInput) {
        customAvatarInput.addEventListener('change', function (e) {
            const reader = new FileReader();
            reader.onload = function (event) {
                jogadorAtual.avatar = event.target.result;
                adicionarJogador();
            };
            reader.readAsDataURL(e.target.files[0]);
        });
    }

    function adicionarJogador() {
        if (!jogadorAtual || !jogadorAtual.nome) {
            console.error("Jogador inválido!");
            return;
        }
        const novoJogador = push(jogadoresRef);
        set(novoJogador, jogadorAtual)
            .then(() => {
                console.log("Jogador adicionado com sucesso:", jogadorAtual);
                if (avatarModal) avatarModal.style.display = 'none';
                jogadorAtual = null;
            })
            .catch(error => {
                console.error("Erro ao adicionar jogador:", error);
            });
    }

    onValue(jogadoresRef, (snapshot) => {
        const jogadores = snapshot.val() ? Object.entries(snapshot.val()).map(([id, obj]) => ({ id, ...obj })) : [];
        atualizarInterface(jogadores);
    });

    function atualizarInterface(jogadores) {
        playersDiv.innerHTML = '';
        let maiorContador = 0;
        let lideres = [];

        jogadores.forEach((jogador) => {
            if (jogador.contador > maiorContador) {
                maiorContador = jogador.contador;
                lideres = [jogador.nome];
            } else if (jogador.contador === maiorContador && maiorContador > 0) {
                lideres.push(jogador.nome);
            }

            const playerDiv = document.createElement('div');
            playerDiv.classList.add('player');
            const avatarHTML = jogador.avatar.startsWith('data:image')
                ? `<img src="${jogador.avatar}" class="player-avatar" alt="Avatar">`
                : `<i class="fas ${jogador.avatar} player-avatar"></i>`;

            playerDiv.innerHTML = `
                ${avatarHTML}
                <span>${jogador.nome}: ${jogador.contador} pedaços</span>
                <button onclick="adicionarPeca('${jogador.id}')">+1</button>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${calcularProgresso(jogador.contador, jogadores)}%;"></div>
                </div>
            `;
            playersDiv.appendChild(playerDiv);
        });

        leaderDiv.textContent = lideres.length === 1 ? `Líder: ${lideres[0]} com ${maiorContador} pedaços!`
            : lideres.length > 1 ? `Empate entre: ${lideres.join(", ")} com ${maiorContador} pedaços!`
            : "Ninguém está ganhando ainda!";
    }

    // Para atualizar o contador de pedaços
    window.adicionarPeca = function (jogadorId) {
        const jogadorRef = ref(db, `jogadores/${jogadorId}`);
        // Utilize uma leitura única para atualizar
        onValue(jogadorRef, (snapshot) => {
            const jogador = snapshot.val();
            update(jogadorRef, { contador: (jogador.contador || 0) + 1 });
        }, { onlyOnce: true });
    };

    function calcularProgresso(pedacos, jogadores) {
        const maiorConsumo = Math.max(...jogadores.map(j => j.contador), 1);
        return (pedacos / maiorConsumo) * 100;
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            remove(jogadoresRef);
        });
    } else {
        console.error("Botão de reset não encontrado!");
    }
});
