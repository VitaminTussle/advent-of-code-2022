const fs = require('fs');

const PART = 2;

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    const monkeys = [];
    const equationFactory = equationArr => {
        const operand1 = equationArr[0] === 'old' ? 'old' : parseInt(equationArr[0]);
        const operand2 = equationArr[2] === 'old' ? 'old' : parseInt(equationArr[2]);
        const operation = equationArr[1];
        return worry => {
            const innerOp1 = operand1 === 'old' ? worry : operand1;
            const innerOp2 = operand2 === 'old' ? worry : operand2;
            if (operation === '+') {
                return innerOp1 + innerOp2;
            } else if (operation === '*') {
                return innerOp1 * innerOp2;
            }
        }
    };
    // parse input
    for (let i = 0; i + 6 <= lines.length; i += 6) { // each monkey is explained in 6 lines of input, empty lines are removed above
        const monkey = {};

        const startingItemLine = lines[i + 1];
        let items = startingItemLine.substring(18).split(', ');
        items = items.map(el => parseInt(el));
        monkey.items = items;

        const equationLine = lines[i + 2];
        let equation = equationLine.substring(19).split(' ');
        monkey.equation = equationFactory(equation);

        const testLine = lines[i + 3];
        const testArr = testLine.split(' ');
        monkey.testNum = parseInt(testArr[testArr.length - 1]);

        const trueLine = lines[i + 4];
        const trueArr = trueLine.split(' ');
        monkey.trueDest = parseInt(trueArr[trueArr.length - 1]);

        const falseLine = lines[i + 5];
        const falseArr = falseLine.split(' ');
        monkey.falseDest = parseInt(falseArr[falseArr.length - 1]);

        monkey.inspected = 0;
        monkeys.push(monkey);
    }

    // processing
    const limit = PART === 1 ? 20 : 10000;
    const mod = monkeys.reduce((prev, el) => prev * el.testNum, 1);
    for (let i = 0; i < limit; i++) {
        console.log(i);
        for (const monkey of monkeys) {
            for (let item of monkey.items) {
                monkey.inspected++;
                item = monkey.equation(item);
                if (PART === 1) {
                    item = Math.floor(item / 3);
                }
                item = item % mod;
                if (item % monkey.testNum === 0) {
                    monkeys[monkey.trueDest].items.push(item);
                } else {
                    monkeys[monkey.falseDest].items.push(item);
                }
            }
            monkey.items = [];
        }
    }
    const inspections = monkeys.map(el => el.inspected).sort((a, b) => b - a);
    console.log(inspections);
    const monkeyBusiness = inspections[0] * inspections[1]; // calling a variable monkeyBusiness is very funny
    // console.log(monkeys);
    console.log(monkeyBusiness);
});