const fs = require('fs');
// might want to import a package for this in case the alphabet gets another update in the future
const letters = 'abcdefghijklmnopqrstuvwxyz';

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    const map = [];
    let selfPos = [0, 0];
    let goalPos = [0, 0];
    for (let i = 0; i < lines.length; i++) {
        const mapLine = [];
        for (let j = 0; j < lines[i].length; j++) {
            let letter = lines[i][j];
            let dist = Number.MAX_SAFE_INTEGER;
            if (letter === 'S') {
                selfPos = [i, j];
                letter = 'a';
                dist = 0;
            } else if (letter === 'E') {
                goalPos = [i, j];
                letter = 'z';
            }
            mapLine.push({letter, dist});
        }
        map.push(mapLine);
    }
    console.log(`map dimensions: ${map.length} x ${map[0].length}`);

    // bfs sounds good for this
    // same algo for part 1 and 2, just slightly different application
    let visited = {};
    let toVisit = [];
    const bfs = (curr, goal) => {
        toVisit.push(curr);
        while (toVisit.length !== 0) {
            const dequeued = toVisit.shift();
            visited[`${dequeued[0]},${dequeued[1]}`] = true;

            if (dequeued[0] === goal[0] && dequeued[1] === goal[1]) {
                return map[dequeued[0]][dequeued[1]].dist;
            }

            const currUp = dequeued[1] === 0 ? null : [dequeued[0], dequeued[1] - 1];
            const currDown = dequeued[1] === map[dequeued[0]].length - 1 ? null : [dequeued[0], dequeued[1] + 1];
            const currLeft = dequeued[0] === 0 ? null : [dequeued[0] - 1, dequeued[1]];
            const currRight = dequeued[0] === map.length - 1 ? null : [dequeued[0] + 1, dequeued[1]];
            const letterAtCurr = map[dequeued[0]][dequeued[1]].letter;
            const withinOne = (letter) => {
                const letterNum = letters.indexOf(letter);
                const currNum = letters.indexOf(letterAtCurr);
                const res = letterNum - currNum;
                return res <= 1;
            };
            const options = [currUp, currDown, currLeft, currRight];

            for (const option of options) {
                if (option && !visited[`${option[0]},${option[1]}`] && withinOne(map[option[0]][option[1]].letter)) {
                    map[option[0]][option[1]].dist = map[dequeued[0]][dequeued[1]].dist + 1;
                    if (!toVisit.find(el => el[0] === option[0] && el[1] === option[1])){
                        toVisit.push(option);
                    }
                }
            }
        }
    };

    console.log(`part 1: ${bfs(selfPos, goalPos)}`);
    
    // part 2, ezpz
    const possibleStartingPos = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j].letter === 'a') {
                possibleStartingPos.push([i, j]);
            }
        }
    }
    const allPaths = [];
    for (const pos of possibleStartingPos) {
        visited = {};
        toVisit = [];
        // reset distances
        for (const line of map) {
            for (const el of line) {
                el.dist = 0;
            }
        }
        allPaths.push(bfs(pos, goalPos));
    }
    console.log(`part 2: ${allPaths.sort((a, b) => a - b)[0]}`);
});