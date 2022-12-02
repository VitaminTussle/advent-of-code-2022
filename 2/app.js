const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    const scores = lines.map(line => {
        let sum = 0;
        let opp = line[0];
        if (opp === 'A') opp = 'rock';
        else if (opp === 'B') opp = 'paper';
        else opp = 'scissors';
        let me = line[line.length - 1];
        if (me === 'X') me = 'rock';
        else if (me === 'Y') me = 'paper';
        else me = 'scissors';
        switch (me) {
            case 'rock':
                sum += 1;
                break;
            case 'paper':
                sum += 2;
                break;
            case 'scissors':
                sum += 3;
                break;
            default:
                break;
        }
        if ((me === 'rock' && opp === 'scissors') || (me === 'paper' && opp === 'rock') || (me === 'scissors' && opp === 'paper')) {
            sum += 6;
        } else if (me === opp) {
            sum += 3;
        }
        return sum;
    });
    const total = scores.reduce((prev, curr) => prev + curr, 0);
    console.log('part 1: total score');
    console.log(total);

    // look I could do this all in one map but I really don't feel like it okay
    const newScores = lines.map(line => {
        let sum = 0;
        let opp = line[0];
        if (opp === 'A') opp = 'rock';
        else if (opp === 'B') opp = 'paper';
        else opp = 'scissors';
        let outcome = line[line.length - 1];
        if (outcome === 'Y') sum += 3;
        else if (outcome === 'Z') sum += 6;

        switch (opp) {
            case 'rock':
                if (outcome === 'X') {
                    // I have to pick scissors to lose, 3pts
                    sum += 3;
                } else if (outcome === 'Y') {
                    // I have to pick rock to tie, 1pt
                    sum += 1;
                } else {
                    // I have to pick paper to win, 2pts
                    sum += 2;
                }
                break;
            case 'paper':
                if (outcome === 'X') {
                    // I have to pick rock to lose, 1pt
                    sum += 1;
                } else if (outcome === 'Y') {
                    // I have to pick paper to tie, 2pts
                    sum += 2;
                } else {
                    // I have to pick scissors to win, 3pts
                    sum += 3;
                }
                break;
            case 'scissors':
                if (outcome === 'X') {
                    // I have to pick paper to lose, 2pts
                    sum += 2;
                } else if (outcome === 'Y') {
                    // I have to pick scissors to tie, 3pts
                    sum += 3;
                } else {
                    // I have to pick rock to win, 1pt
                    sum += 1;
                }
                break;
            default:
                break;
        }
        return sum;
    });
    const total2 = newScores.reduce((prev, curr) => prev + curr, 0);
    console.log('part 2: new total score');
    console.log(total2);
});