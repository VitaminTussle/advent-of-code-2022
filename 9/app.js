const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');

    // part 1
    let tailPositions = ['0,0'];
    let lastTailPosition = [0, 0];
    const headTailDiff = [0, 0];

    const calcAndPerformMove = () => {
        let moveX = 0;
        let moveY = 0;
        if (
            (Math.abs(headTailDiff[0]) > 1 && Math.abs(headTailDiff[1]) > 0) ||
            (Math.abs(headTailDiff[0]) > 0 && Math.abs(headTailDiff[1]) > 1)
        ) {
            moveX = headTailDiff[0] / Math.abs(headTailDiff[0]);
            moveY = headTailDiff[1] / Math.abs(headTailDiff[1]);
        } else if (Math.abs(headTailDiff[0]) > 1) {
            moveX = headTailDiff[0] / Math.abs(headTailDiff[0]);
        } else if (Math.abs(headTailDiff[1]) > 1) {
            moveY = headTailDiff[1] / Math.abs(headTailDiff[1]);
        }
        lastTailPosition[0] += moveX;
        lastTailPosition[1] += moveY;
        const posStr = lastTailPosition.join(',');
        if (!tailPositions.includes(posStr)) {
            tailPositions.push(posStr);
        }
        headTailDiff[0] -= moveX;
        headTailDiff[1] -= moveY;
    };

    for (const line of lines) {
        const instructions = line.split(' ');
        const dir = instructions[0];
        const cnt = parseInt(instructions[1]);
        for (let i = 0; i < cnt; i++) {
            if (dir === 'U') {
                headTailDiff[1]++;
            } else if (dir === 'D') {
                headTailDiff[1]--;
            } else if (dir === 'L') {
                headTailDiff[0]--;
            } else if (dir === 'R') {
                headTailDiff[0]++;
            }
            calcAndPerformMove();
        }
        calcAndPerformMove();
    }

    console.log('part 1: ' + tailPositions.length);

    // part 2
    tailPositions = ['0,0'];
    lastTailPosition = [0, 0];
    const posDiffs = [];
    // rope is of length 10, so 9 segment interactions
    for (let i = 0; i < 9; i++) {
        posDiffs.push([0, 0]);
    }

    const calcAndPerformMove2 = () => {
        let moveX = 0;
        let moveY = 0;
        for (let i = 0; i < posDiffs.length; i++) {
            if (
                (Math.abs(posDiffs[i][0]) > 1 && Math.abs(posDiffs[i][1]) > 0) ||
                (Math.abs(posDiffs[i][0]) > 0 && Math.abs(posDiffs[i][1]) > 1)
            ) {
                moveX = posDiffs[i][0] / Math.abs(posDiffs[i][0]);
                moveY = posDiffs[i][1] / Math.abs(posDiffs[i][1]);
            } else if (Math.abs(posDiffs[i][0]) > 1) {
                moveX = posDiffs[i][0] / Math.abs(posDiffs[i][0]);
            } else if (Math.abs(posDiffs[i][1]) > 1) {
                moveY = posDiffs[i][1] / Math.abs(posDiffs[i][1]);
            }
            posDiffs[i][0] -= moveX;
            posDiffs[i][1] -= moveY;
            if (i < posDiffs.length - 1) {
                posDiffs[i + 1][0] += moveX;
                posDiffs[i + 1][1] += moveY;
                moveX = 0;
                moveY = 0;
            }
        }
        lastTailPosition[0] += moveX;
        lastTailPosition[1] += moveY;
        const posStr = lastTailPosition.join(',');
        if (!tailPositions.includes(posStr)) {
            tailPositions.push(posStr);
        }
    };

    for (const line of lines) {
        const instructions = line.split(' ');
        const dir = instructions[0];
        const cnt = parseInt(instructions[1]);
        for (let i = 0; i < cnt; i++) {
            if (dir === 'U') {
                posDiffs[0][1]++;
            } else if (dir === 'D') {
                posDiffs[0][1]--;
            } else if (dir === 'L') {
                posDiffs[0][0]--;
            } else if (dir === 'R') {
                posDiffs[0][0]++;
            }
            calcAndPerformMove2();
        }
        calcAndPerformMove2();
    }

    console.log('part 2: ' + tailPositions.length);
});