const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    let ind = -1;
    let register = 1;
    let crt = '';
    let numToAdd = 0;
    let opTimer = 0;
    const results = [];
    for (let i = 0; i <= 800; i++) {
        if (i > 0) {
            if ((i - 20) % 40 === 0) {
                results.push(i * register);
            }
            // part 2 ////////////////////////
            const horizLoc = (i - 1) % 40;
            if (horizLoc >= register - 1 && horizLoc <= register + 1) {
                crt += '#';
            } else {
                crt += '.';
            }
            //////////////////////////////////
        }
        if (opTimer === 0) {
            register += numToAdd;
            ind++;
            if (ind === lines.length) {
                break;
            }
            const instruction = lines[ind].split(' ');
            if (instruction[0] === 'noop') {
                opTimer = 1;
                numToAdd = 0;
            } else if (instruction[0] === 'addx') {
                opTimer = 2;
                numToAdd = parseInt(instruction[1]);
            }
        }
        opTimer--;
    }
    console.log(`part 1: ${results.reduce((tot, el) => tot + el, 0)}`);
    console.log('part 2:');
    for (let i = 0; i < crt.length / 40; i++) {
        const str = crt.substring(i * 40, ((i + 1) * 40));
        let toPrint = '';
        for (let j = 0; j < 8; j++) {
            toPrint += str.substring(j * 5, (j + 1) * 5);
            toPrint += ' ';
        }
        console.log(toPrint);
    }
});