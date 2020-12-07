let player = 1;
let gameHistory = [];

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
    checkResult();
}

function checkResult () {
    const xHistory = gameHistory.filter(function(entry) {
        return entry[0] === 'X';
    });
    const oHistory = gameHistory.filter(function(entry) {
        return entry[0] === 'O';
    });

    const xResult = checkPlayerResult(xHistory);
    const yResult = checkPlayerResult(oHistory);

    if (!xResult && !yResult && gameHistory.length >= 9) {
        setWinner();
    }
}

function checkPlayerResult (history) {
    if (history.length === 0) return;

    const player = history[0][0];

    const entries = history.map(function(entry) {
        return entry.substring(1);
    });

    const rowCount = groupBy(entries, 0);
    const colCount = groupBy(entries, 1);
    
    // Verificando se o jogador ganhou em linha
    for (let i in rowCount) {
        if (rowCount[i].length === 3) {
            setWinner(player, rowCount[i]);
            return true;
        }
    }

    // Verificando se o jogador ganhou em coluna
    for (let i in colCount) {
        if (colCount[i].length === 3) {
            setWinner(player, colCount[i]);
            return true;
        }
    }

    // Verificando se o jogador ganhou em diagonal
    if (entries.includes('A1') && entries.includes('B2') && entries.includes('C3')) {
        setWinner(player, ['A1', 'B2', 'C3']);
        return true;
    }

    // Verificando se o jogador ganhou em diagonal
    else if (entries.includes('A3') && entries.includes('B2') && entries.includes('C1')) {
        setWinner(player, ['A3', 'B2', 'C1']);
        return true;
    }

    return false;
}

function setWinner (player, places) {
    if (!player) {
        document.getElementById('winner').innerHTML = 'Deu velha!';
    } else {
        document.getElementById('winner').innerHTML = player + ' venceu!';
    }

    document.querySelectorAll('.play-area div').forEach(function(elem) {
        elem.removeEventListener('click', clickBlock);
    });

    for (let i in places) {
        document.getElementById(places[i]).style.color = 'red';
    }
}

function reset () {
    document.getElementById('winner').innerHTML = '';
    load();
}

function load () {
    gameHistory = [];
    document.querySelectorAll('.play-area div').forEach(function(elem) {
        elem.innerHTML = '';
        elem.style.color = '';
        elem.addEventListener('click', clickBlock)
    });
}

window.onload = function () {
    load();    
}

// https://stackoverflow.com/a/34890276
function groupBy (xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
};