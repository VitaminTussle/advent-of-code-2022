const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');

    const trees = [];
    // visible coordinate format: [rowNum],[colNum] (origin at top left, element [0, 0])
    for (const line of lines) {
        trees.push(line.split('').map(el => parseInt(el)));
    }
    let innerVisible = 0;
    const perimVisible = (trees.length * 2) + ((trees[0].length - 2) * 2);
    let maxScore = 0;

    for (let r = 1; r < trees.length - 1; r++) {
        for (let c = 1; c < trees[r].length - 1; c++) {
            // setup
            const left = trees[r].slice(0, c);
            const right = trees[r].slice(c + 1);
            const up = [];
            const down = [];
            for (let r2 = 0; r2 < trees.length; r2++) {
                if (r2 < r) up.push(trees[r2][c]);
                else if (r2 > r) down.push(trees[r2][c]);
            }

            // part 1
            const testMethod = el => el < trees[r][c];
            if (left.every(testMethod) || right.every(testMethod) || up.every(testMethod) || down.every(testMethod)) {
                innerVisible++;
            }

            // part 2
            let leftScore = 0;
            let rightScore = 0;
            let upScore = 0;
            let downScore = 0;
            for (let l = left.length - 1; l >= 0; l--) {
                leftScore++;
                if (trees[r][l] >= trees[r][c]) {
                    break;
                }
            }
            for (let t = 0; t < right.length; t++) {
                rightScore++;
                if (trees[r][c + 1 + t] >= trees[r][c]) {
                    break;
                }
            }
            for (let u = up.length - 1; u >= 0; u--) {
                upScore++;
                if (trees[u][c] >= trees[r][c]) {
                    break;
                }
            }
            for (let d = 0; d < down.length; d++) {
                downScore++;
                if (trees[r + 1 + d][c] >= trees[r][c]) {
                    break;
                }
            }
            const totalScore = leftScore * rightScore * upScore * downScore;
            if (totalScore > maxScore) {
                maxScore = totalScore;
            }
        }
    }
    console.log('part 1: ' + (innerVisible + perimVisible));
    console.log('part 2: ' + maxScore);
});