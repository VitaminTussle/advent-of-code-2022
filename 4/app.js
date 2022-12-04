const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    let sum1 = 0;
    let sum2 = 0;
    for (const line of lines) {
        const elves = line.split(',');
        const e1 = elves[0].split('-');
        const e2 = elves[1].split('-');
        const range1 = [parseInt(e1[0]), parseInt(e1[1])];
        const range2 = [parseInt(e2[0]), parseInt(e2[1])];
        //part 1
        if (
            (range1[0] <= range2[0] && range1[1] >= range2[1]) ||
            (range2[0] <= range1[0] && range2[1] >= range1[1])
        ) {
            sum1++;
        }
        //part 2
        if (
            (
                (range1[0] >= range2[0] && range1[0] <= range2[1]) ||
                (range1[1] >= range2[0] && range1[1] <= range2[1])
            ) ||
            (
                (range2[0] >= range1[0] && range2[0] <= range1[1]) ||
                (range2[1] >= range1[0] && range2[1] <= range1[1])
            )
        ) {
            sum2++;
        }
    }
    console.log('part 1: ' + sum1);
    console.log('part 2: ' + sum2);
});