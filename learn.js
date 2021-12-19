// Quantidade de jogos que serão realizados.
const times = 10000; 

// Define se a aprendizagem vai ser aleatória (rápida/pouco eficiente) ou consultando o banco (demorada/eficiente).
const randomLearn = false; 

require('./app/db'); // DB Connection
const History = require('./app/history.model');
var core = require('./core');

// Define um vencedor ou empate
async function setWinner (player, gameHistory) {
  let data = {};
  data.steps = gameHistory.join(';');
  data.winner = (player) ? player : 'D';
  
  const count = await History.countDocuments(data)
  if (count === 0) {
    console.log('Learning:', data.steps);
    let history = new History(data);
    await history.save();
  }
}

function checkBestChoice (player, steps) {
  if (steps.length === 0) return Promise.resolve([]);
  
  const step = (steps.match(/;/g) || []).length;
  const startPlayer = steps.charAt(0);
  const winPoints = (player === startPlayer) ? 2 : 1;
  const drawPoints = (player !== startPlayer) ? 2 : 0;
  
  return History.aggregate([
    {
      $match: {
        "steps": { "$regex": "^" + steps }
      }
    },
    {
      $addFields: {
        nextStep: {
          $arrayElemAt: [ { $split: ["$steps", ";"] }, step+1 ]
        }
      }
    },
    {
      $group: {
        _id: "$nextStep",
        winRate: {
          $sum: {
            $switch: {
              branches: [
                { case: { $eq: ["$winner", "O"] }, then: (player === 'O' ? winPoints : -1) },
                { case: { $eq: ["$winner", "X"] }, then: (player === 'X' ? winPoints : -1) },
                { case: { $eq: ["$winner", "D"] }, then: drawPoints }
              ]
            }
          }
        }
      }
    }
  ]).exec();
}

async function doRandomGame (player, gameHistory, availablePlaces) {
  availablePlaces = availablePlaces.sort(() => Math.random() - 0.5)
  const place = availablePlaces.shift();
  
  gameHistory.push(player + place);
  
  player = (player === 'X') ? 'O' : 'X';
  
  const winner = core.checkResult(gameHistory);
  if (!winner) {
    await doRandomGame(player, gameHistory, availablePlaces);
  } else {
    await setWinner(winner, gameHistory);
  }
}

async function doCheckedGame (player, gameHistory, availablePlaces) {
  const result = await checkBestChoice(player, gameHistory.join(';'));
  let place;
  if (result.length === 0) {
    availablePlaces = availablePlaces.sort(() => Math.random() - 0.5)
    place = availablePlaces.shift();
  } else {
    let moves = {};
    for (let i in result) {
      let r = result[i];
      moves[r._id.substring(1)] = r.winRate;
    }
    
    availablePlaces.forEach(function(move) {
      moves[move] = (moves[move] ? moves[move] : 0);
    });
    
    // https://stackoverflow.com/a/1069840/6101515
    const sortable = Object.fromEntries(
      Object.entries(moves).sort(([,a],[,b]) => b-a)
    );
      
    place = Object.keys(sortable)[0];
    availablePlaces.splice(availablePlaces.indexOf(place), 1);
  }
    
  gameHistory.push(player + place);
  
  player = (player === 'X') ? 'O' : 'X';
  
  const winner = core.checkResult(gameHistory);
  if (!winner) {
    await doCheckedGame(player, gameHistory, availablePlaces);
  } else {
    await setWinner(winner, gameHistory);
  }
}
  
console.log('Learning...');
async function startLearn (i) {
  console.log('Playing match:', i, `of ${i}`);
  let player = i%2 === 0 ? 'X' : 'O';
  let gameHistory = [];
  let availablePlaces = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
  
  if (randomLearn) {
    await doRandomGame(player, gameHistory, availablePlaces);
  } else {
    await doCheckedGame(player, gameHistory, availablePlaces);
  }
  
  if (i < times) {
    startLearn(++i)
  } else {
    console.log('FINISHED.');
    process.exit()
  }
}

startLearn(0)