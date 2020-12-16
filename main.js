const baseUrl = 'http://localhost:8080';

// Define se o jogo será player x player (true) ou player x computer (false).
const pvp = false;

let player = 1;
let gameHistory = [];

// Jogadas automáticas e aleatórias do computador
function computerRandom() {
    const elements = document.querySelectorAll('.play-area div:empty');
    if (elements[0]) {
        const elem = elements[Math.floor(Math.random() * elements.length)];
        elem.innerHTML = 'O';
        gameHistory.push('O' + elem.id);
        player = 1;
        elem.removeEventListener('click', clickBlock);
        checkResult(gameHistory);
    }
}

// Marca o bloco e checa o resultado depois
function clickBlock (e) {
    const elem = e.target

    if (player === 1) {
        elem.innerHTML = 'X';
        gameHistory.push('X' + elem.id);
        player = 2;
    } else {
        elem.innerHTML = 'O';
        gameHistory.push('O' + elem.id);
        player = 1;
    }

    elem.removeEventListener('click', clickBlock);
    if (checkResult(gameHistory)) {
        return;
    }

    // Jogar automaticamente caso o jogo não seja pvp
    if (!pvp && player === 2) {
        checkNextStep();
    }
}



// Define um vencedor ou empate
function setWinner (player, places) {
    if (!player) {
        document.getElementById('winner').innerHTML = 'Deu velha!';
        sendHistory('D', gameHistory.join(';'));
    } else {
        document.getElementById('winner').innerHTML = player + ' venceu!';
        sendHistory(player, gameHistory.join(';'));
    }

    document.querySelectorAll('.play-area div').forEach(function(elem) {
        elem.removeEventListener('click', clickBlock);
    });

    for (let i in places) {
        document.getElementById(places[i]).style.color = 'red';
    }
}

// Reinicia o jogo
function reset () {
    document.getElementById('winner').innerHTML = '';
    load();
}

// Carrega o jogo
function load () {
    gameHistory = [];
    document.querySelectorAll('.play-area div').forEach(function(elem) {
        elem.innerHTML = '';
        elem.style.color = '';
        elem.addEventListener('click', clickBlock)
    });

    // Fazer jogada, caso o player 2 inicie e não seja um jogo pvp
    if (player === 2 && !pvp) {
        computerRandom();
    }
}

function sendHistory (winner, steps) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `${baseUrl}/register-history`, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

    let data = "";
    const obj = { winner, steps };
    for (let key in obj) {
        if (data != "") {
            data += "&";
        }
        data += key + "=" + encodeURIComponent(obj[key]);
    }
    xhr.send(data);
}

function checkNextStep (callback) {
    fetch(`${baseUrl}/check?history=${gameHistory.join(';')}`).then((result) => {
        result.json().then((rates) => {
            if (rates.length === 0) {
                computerRandom();
            } else {
                const elements = document.querySelectorAll('.play-area div:empty');
                const moves = {};
                elements.forEach(function(x) {
                    const move = x.id;
                    moves[move] = (rates[move] ? rates[move] : 0);
                });
                
                // https://stackoverflow.com/a/1069840/6101515
                const sortable = Object.fromEntries(
                    Object.entries(moves).sort(([,a],[,b]) => b-a)
                );

                const first = Object.keys(sortable)[0];
                const elem = document.getElementById(first);
                elem.innerHTML = 'O';
                gameHistory.push('O' + first);
                player = 1;
                elem.removeEventListener('click', clickBlock);
                checkResult(gameHistory);
            }
        }).catch((e) => {
            computerRandom();
        });;
    }).catch((e) => {
        computerRandom();
    });
}

// Iniciar o jogo
window.onload = function () {
    load();    
}