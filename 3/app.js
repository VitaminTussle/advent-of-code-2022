const fs = require('fs');
const charToAscii = require('char-to-ascii');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    let sum1 = 0;
    let sum2 = 0;
    let group = [];
    lines.forEach(line => {
        // form groups for part 2
        if (group.length < 3) {
            group.push(line);
        }
        // part 1
        const comp1 = line.substring(0, line.length / 2);
        const comp2 = line.substring(line.length / 2);
        let checked = [];
        let dupe1 = '';
        for (const c of comp1) {
            if (!checked.includes(c)) {
                checked.push(c);
                if (comp2.includes(c)) {
                    dupe1 = c;
                    break;
                }
            }
        }
        // in ascii: A = 65, Z = 90, a = 97, z = 122
        const dupe1Ascii = charToAscii(dupe1)[0];
        const priority1 = dupe1Ascii >= 97 && dupe1Ascii <= 122 ? (dupe1Ascii - 96) : (dupe1Ascii - 64 + 26);
        sum1 += priority1;

        // part 2
        if (group.length === 3) {
            checked = [];
            let dupe2 = '';
            for (const c of group[0]) {
                if (!checked.includes(c)) {
                    checked.push(c);
                    if (group[1].includes(c) && group[2].includes(c)) {
                        dupe2 = c;
                        break;
                    }
                }
            }
            const dupe2Ascii = charToAscii(dupe2)[0];
            const priority2 = dupe2Ascii >= 97 && dupe2Ascii <= 222 ? (dupe2Ascii - 96) : (dupe2Ascii - 64 + 26);
            sum2 += priority2;
            group = [];
        }
    });
    // results
    console.log(sum1);
    console.log(sum2);
});