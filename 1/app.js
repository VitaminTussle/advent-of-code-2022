const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const lines = data.split('\n');
    const sums = [];
    let sum = 0;
    for (const line of lines) {
        if (line !== '') {
            sum += Number(line);
        } else {
            sums.push(sum);
            sum = 0;
        }
    }
    sums.push(sum);
    const sorted = sums.sort((a, b) => a - b).reverse();
    const top3 = sorted[0] + sorted[1] + sorted[2];
    console.log(top3);
});