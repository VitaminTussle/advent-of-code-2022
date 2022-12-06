const fs = require('fs');

const PART = 2;

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    const max = PART === 1 ? 4 : 14;
    for (let i = 0; i < lines[0].length; i++) {
        const sub = lines[0].substring(i, i + max);
        let dupe = false;
        for (let j = max - 1; j > 0; j--) {
            const subsub = sub.substring(0, j);
            if (subsub.includes(sub[j])) {
                dupe = true;
                break;
            }
        }
        if (!dupe) {
            console.log(i + max);
            break;
        }
    }
});