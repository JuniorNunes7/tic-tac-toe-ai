// Groupby function
// https://stackoverflow.com/a/34890276
function groupBy (xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
};

// Verifica o resultado
function checkResult (gameHistory) {
    const xHistory = gameHistory.filter(function(entry) {
        return entry[0] === 'X';
    });
    const oHistory = gameHistory.filter(function(entry) {
        return entry[0] === 'O';
    });

    const xResult = checkPlayerResult(xHistory);
    const oResult = checkPlayerResult(oHistory);

    if (!xResult && !oResult && gameHistory.length >= 9) {
        if (typeof setWinner !== 'undefined') setWinner();
        return 'D';
    }

    if (xResult) {
        return 'X';
    } else if (oResult) {
        return 'O';
    }

    return false;
}

// Verifica o resultado do jogador
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
            if (typeof setWinner !== 'undefined') setWinner(player, rowCount[i]);
            return player;
        }
    }

    // Verificando se o jogador ganhou em coluna
    for (let i in colCount) {
        if (colCount[i].length === 3) {
            if (typeof setWinner !== 'undefined') setWinner(player, colCount[i]);
            return player;
        }
    }

    // Verificando se o jogador ganhou em diagonal
    if (entries.includes('A1') && entries.includes('B2') && entries.includes('C3')) {
        if (typeof setWinner !== 'undefined') setWinner(player, ['A1', 'B2', 'C3']);
        return player;
    }

    // Verificando se o jogador ganhou em diagonal
    else if (entries.includes('A3') && entries.includes('B2') && entries.includes('C1')) {
        if (typeof setWinner !== 'undefined') setWinner(player, ['A3', 'B2', 'C1']);
        return player;
    }

    return false;
}

if (typeof module !== 'undefined') {
    module.exports = {
        checkResult: checkResult
    }
}