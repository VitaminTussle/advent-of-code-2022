const fs = require('fs');
const PART = 2;

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    const dirs = lines[0];
    const rocks = [
        {
            height: 1,
            diffs: [[0, 0], [1, 0], [2, 0], [3, 0]]
        },
        {
            height: 3,
            diffs: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]
        },
        {
            height: 3,
            diffs: [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2]]
        },
        {
            height: 4,
            diffs: [[0, 0], [0, 1], [0, 2], [0, 3]]
        },
        {
            height: 2,
            diffs: [[0, 0], [1, 0], [0, 1], [1, 1]]
        }
    ];
    const room = [];
    let dirInd = 0;
    const printRoom = () => {
        for (const row of room.reverse()) {
            let str = '';
            for (const pt of row) {
                if (pt) {
                    str += '#';
                } else {
                    str += '.';
                }
            }
            console.log(`|${str}|`);
        }
        console.log('+-------+');
    };
    // hello, I just tried this on part 2 targeting a trillion rocks.
    // by a rough estimate that each million rocks takes half a percent longer to calculate than the million that came before it,
    //   we could replay the time between now and the estimated heat death of the universe about this many times before my program completed on a trillion rocks in its current form:
    //   429822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340167753960857409133271202236719478098788443616029822926374650512581547064305684995340
    //   ...not to mention that after 23.5 million rocks, I hit the javascript max heap allocation.
    // I don't feel like staying awake another 4 hours working on this, so I'm just gonna call it here I think.
    // thanks for understanding.
    // I have a rough idea on how to stop the calculation time from growing beyond a certain point by only saving a snapshot of the highest x rows of the room,
    //   but honestly I'm tired and don't feel like implementing it. it's left as an exercise for the reader. qed or whatever.
    for (let i = 0; i < (PART === 1 ? 2022 : 1000000000000); i++) {
        if (i % 1000 === 0) console.log(i);
        const initHeight = room.length;
        for (let j = 0; j < rocks[i % 5].height + 3; j++) {
            room.push([false, false, false, false, false, false, false]);
        }
        const rockOrigin = [2, initHeight + 3];
        const rockLocs = rocks[i % 5].diffs.map(pt => [rockOrigin[0] + pt[0], rockOrigin[1] + pt[1]]);
        let hit = false;
        while (!hit) {
            const gas = dirs[dirInd];
            const dir = gas === '>' ? 1 : -1;
            let canMove = true;
            for (const loc of rockLocs) {
                const newX = loc[0] + dir;
                if (newX < 0 || newX > 6 || room[loc[1]][newX]) {
                    canMove = false;
                    break;
                }
            }
            if (canMove) {
                for (let j = 0; j < rockLocs.length; j++) {
                    const newLoc = [rockLocs[j][0] + dir, rockLocs[j][1]];
                    rockLocs[j] = newLoc;
                }
            }
            canMove = true;
            for (const loc of rockLocs) {
                const newY = loc[1] - 1;
                if (newY < 0 || room[newY][loc[0]]) {
                    canMove = false;
                    break;
                }
            }
            if (canMove) {
                for (let j = 0; j < rockLocs.length; j++) {
                    const newLoc = [rockLocs[j][0], rockLocs[j][1] - 1];
                    rockLocs[j] = newLoc;
                }
            } else {
                hit = true;
                for (const loc of rockLocs) {
                    room[loc[1]][loc[0]] = true;
                }
            }
            dirInd++;
            dirInd %= dirs.length;
        }
        while (room[room.length - 1].every(pt => !pt)) {
            room.pop();
        }
    }
    // printRoom();
    console.log(room.length);
});