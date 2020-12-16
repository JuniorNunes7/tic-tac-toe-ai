const times = 1000; // Quantidade de jogos que serão realizados.

require('./app/db'); // DB Connection
const History = require('./app/history.model');

// Define um vencedor ou empate
function setWinner (player) {
    let data = {};
    data.steps = gameHistory.join(';');
    data.winner = (player) ? player : 'D';

    let history = new History(data);
    let x = history.save();
}

var core = require('./core');

var gameHistory = [];
let player = 'X';

function doRandomGame (availablePlaces) {
    availablePlaces = availablePlaces.sort(() => Math.random() - 0.5)

    const place = availablePlaces.shift();

    gameHistory.push(player + place);

    player = player === 'X' ? 'O' : 'X';

    const winner = core.checkResult(gameHistory);
    if (!winner) {
        doRandomGame(availablePlaces);
    } else {
        setWinner(winner);
    }
}

for (let i = 0; i < times; i++) { // Loop de jogos
    gameHistory = [];
    let availablePlaces = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];

    doRandomGame(availablePlaces);
}

console.log('Finishing...');