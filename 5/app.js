const fs = require('fs');

const PART = 2;

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    const stacks = [];
    let lineCnt = 0;
    while (lines[lineCnt][0] !== ' ') {
        for(let i = 0; i < lines[lineCnt].length; i += 4){
            if (!stacks[i / 4]) {
                stacks.push([]);
            }
            const sub = lines[lineCnt].substring(i, i + 4);
            const rBrack = sub.indexOf('[');
            const lBrack = sub.indexOf(']');
            if (rBrack !== -1 && lBrack !== -1) {
                const letter = sub.substring(rBrack + 1, lBrack);
                stacks[i / 4].push(letter);
            }
        }
        lineCnt++;
    }
    for (let i = 0; i < stacks.length; i++) {
        stacks[i] = stacks[i].reverse();
    }
    lineCnt++;
    for (let i = lineCnt; i < lines.length; i++) {
        const instructions = lines[i].split(' ');
        const numToMove = parseInt(instructions[1]);
        const fromStack = parseInt(instructions[3]) - 1;
        const toStack = parseInt(instructions[5]) - 1;
        if (PART === 1) {
            for (let j = 0; j < numToMove; j++) {
                const popped = stacks[fromStack].pop();
                stacks[toStack].push(popped);
            }
        } else if (PART === 2) {
            const transferArr = stacks[fromStack].slice(stacks[fromStack].length - numToMove);
            stacks[fromStack] = stacks[fromStack].slice(0, stacks[fromStack].length - numToMove);
            stacks[toStack].push(...transferArr);
        }
    }
    console.log(stacks.reduce((str, stack) => {
        return str += (stack.length ? stack[stack.length - 1] : ' ');
    }, ''));
});