const fs = require('fs');
const PART = 2;

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    const map = [];
    // build map
    for (const line of lines) {
        let coords = line.split(' ');
        coords = coords.filter((el, ind) => ind % 2 == 0); // get rid of arrows
        for (let i = 0; i < coords.length - 1; i++) {
            const numsSrc = coords[i].split(',');
            const xSrc = parseInt(numsSrc[0]);
            const ySrc = parseInt(numsSrc[1]);
            const numsDest = coords[i + 1].split(',');
            const xDest = parseInt(numsDest[0]);
            const yDest = parseInt(numsDest[1]);
            let min;
            let max;
            let changing;
            if (xSrc < xDest) {
                min = xSrc;
                max = xDest;
                changing = 'x';
            } else if (xDest < xSrc) {
                min = xDest;
                max = xSrc;
                changing = 'x';
            } else if (ySrc < yDest) {
                min = ySrc;
                max = yDest;
                changing = 'y';
            } else {
                min = yDest;
                max = ySrc;
                changing = 'y';
            }
            if (xSrc === '507' && ySrc === '97') {
                console.log(numsSrc);
                console.log(numsDest);
                console.log(min);
                console.log(max);
                console.log(changing);
                console.log('---');
            }
            for (let j = min; j <= max; j++) {
                const placeX = changing === 'x' ? j : xSrc;
                const placeY = changing === 'y' ? j : ySrc;
                if (!map[placeX]) {
                    map[placeX] = [];
                }
                map[placeX][placeY] = true;
            }
        }
    }

    if (PART === 1) {
        // part 1
        let fallIntoVoid = false;
        let sandCounter = -1;
        if (!map[500]) {
            map[500] = [];
        }
        while (!fallIntoVoid) {
            sandCounter++;
            let sandPos = [500, 0];
            while ((!map[sandPos[0]][sandPos[1] + 1] || !map[sandPos[0] - 1][sandPos[1] + 1] || !map[sandPos[0] + 1][sandPos[1] + 1]) && map[sandPos[0]].length > sandPos[1]) {
                if (!map[sandPos[0]]) {
                    map[sandPos[0]] = [];
                }
                if (map[sandPos[0]][sandPos[1] + 1]) {
                    if (!map[sandPos[0] - 1][sandPos[1] + 1]) {
                        sandPos[0] -= 1;
                    } else {
                        sandPos[0] += 1;
                    }
                }
                sandPos[1] += 1;
                // sometimes it gets mad without these since the array size isn't predefined, better safe than sorry
                if (!map[sandPos[0]]) {
                    map[sandPos[0]] = [];
                }
                if (!map[sandPos[0] - 1]) {
                    map[sandPos[0] - 1] = [];
                }
                if (!map[sandPos[0] + 1]) {
                    map[sandPos[0] + 1] = [];
                }
            }
            if (map[sandPos[0]].length <= sandPos[1]) {
                map[sandPos[0]][sandPos[1]] = 2;
                fallIntoVoid = true;
            } else {
                map[sandPos[0]][sandPos[1]] = 1;
            }
        }
        console.log(`part 1: ${sandCounter}`);
    } else {
        // part 2
        let maxHeight = 0;
        for (let i = 0; i < map.length; i++) {
            if (!map[i]) {
                map[i] = [];
            }
            if (map[i].length > maxHeight) {
                maxHeight = map[i].length;
            }
        }
        maxHeight++;
        for (const line of map) {
            line[maxHeight] = true;
        }
        let sandCounter = 0;
        if (!map[500]) {
            map[500] = [];
            map[500][maxHeight] = true;
        }
        while (!map[500][0]) {
            sandCounter++;
            let sandPos = [500, 0];
            while ((!map[sandPos[0]][sandPos[1] + 1] || !map[sandPos[0] - 1][sandPos[1] + 1] || !map[sandPos[0] + 1][sandPos[1] + 1])) {
                if (!map[sandPos[0]]) {
                    map[sandPos[0]] = [];
                    map[sandPos[0]][maxHeight] = true;
                }
                if (map[sandPos[0]][sandPos[1] + 1]) {
                    if (!map[sandPos[0] - 1][sandPos[1] + 1]) {
                        sandPos[0] -= 1;
                    } else {
                        sandPos[0] += 1;
                    }
                }
                sandPos[1] += 1;
                // good chance it gets mad without these in pt 2 since the array size isn't predefined and sand goes much farther
                if (!map[sandPos[0]]) {
                    map[sandPos[0]] = [];
                    map[sandPos[0]][maxHeight] = true;
                }
                if (!map[sandPos[0] - 1]) {
                    map[sandPos[0] - 1] = [];
                    map[sandPos[0] - 1][maxHeight] = true;
                }
                if (!map[sandPos[0] + 1]) {
                    map[sandPos[0] + 1] = [];
                    map[sandPos[0] + 1][maxHeight] = true;
                }
            }
            map[sandPos[0]][sandPos[1]] = 1;
        }
        console.log(`part 2: ${sandCounter}`);
    }
});