const fs = require('fs');
const PART = 2;

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    const sensors = [];
    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    const manhattanDist = (src, dest) => Math.abs(src[0] - dest[0]) + Math.abs(src[1] - dest[1]);
    for (const line of lines) {
        const halves = line.split(':');
        const sensorHalf = halves[0].split(' ');
        const beaconHalf = halves[1].split(' ');
        const sensorXStr = sensorHalf[2];
        const sensorYStr = sensorHalf[3];
        const sensorXNum = sensorXStr.substring(0, sensorXStr.length - 1).split('=')[1];
        const sensorYNum = sensorYStr.split('=')[1];
        const beaconXStr = beaconHalf[5];
        const beaconYStr = beaconHalf[6];
        const beaconXNum = beaconXStr.substring(0, beaconXStr.length - 1).split('=')[1];
        const beaconYNum = beaconYStr.split('=')[1];
        const sensorPos = [parseInt(sensorXNum), parseInt(sensorYNum)];
        const beaconPos = [parseInt(beaconXNum), parseInt(beaconYNum)];
        const beaconDist = manhattanDist(sensorPos, beaconPos);
        if ((sensorPos[0] - beaconDist) < minX) {
            minX = sensorPos[0] - beaconDist;
        }
        if ((sensorPos[0] + beaconDist) > maxX) {
            maxX = sensorPos[0] + beaconDist;
        }
        if (beaconPos[0] < minX) {
            minX = beaconPos[0];
        }
        if (beaconPos[0] > maxX) {
            maxX = beaconPos[0];
        }
        sensors.push({
            pos: sensorPos,
            beacon: beaconPos,
            beaconDist: beaconDist
        });
    }

    if (PART === 1) {
        // part 1
        let noBeacon = 0;
        const rowToExamine = 2000000;
        for (let i = minX; i <= maxX; i++) {
            let inRange = false;
            let hasBeacon = false;
            for (const sensor of sensors) {
                if (sensor.beacon[0] === i && sensor.beacon[1] === rowToExamine) {
                    hasBeacon = true;
                }
                if (manhattanDist(sensor.pos, [i, rowToExamine]) <= sensor.beaconDist) {
                    inRange = true;
                    break;
                }
            }
            if (inRange && !hasBeacon) {
                noBeacon++;
            }
        }
        console.log(`part 1: ${noBeacon}`);
    } else {
        // part 2
        let perimPoints = [];
        for (const sensor of sensors) {
            let x = sensor.pos[0];
            let y = sensor.pos[1] - sensor.beaconDist - 1;
            while (x < sensor.pos[0] + sensor.beaconDist + 1 && y < sensor.pos[1]) {
                if (x >= 0 && x <= 4000000 && y >= 0 && y <= 4000000) {
                    perimPoints.push([x, y]);
                }
                x++;
                y++;
            }
            while (x > sensor.pos[0] && y < sensor.pos[1] + sensor.beaconDist + 1) {
                if (x >= 0 && x <= 4000000 && y >= 0 && y <= 4000000) {
                    perimPoints.push([x, y]);
                }
                x--;
                y++;
            }
            while (x > sensor.pos[0] - sensor.beaconDist - 1 && y > sensor.pos[1]) {
                if (x >= 0 && x <= 4000000 && y >= 0 && y <= 4000000) {
                    perimPoints.push([x, y]);
                }
                x--;
                y--;
            }
            while (x < sensor.pos[0] && y > sensor.pos[1] - sensor.beaconDist - 1) {
                if (x >= 0 && x <= 4000000 && y >= 0 && y <= 4000000) {
                    perimPoints.push([x, y]);
                }
                x++;
                y--;
            }
        }
        let beaconCoords = [-1, -1];
        for (let i = 0; i < perimPoints.length; i++) {
            let inRange = false;
            for (const sensor of sensors) {
                if (manhattanDist(sensor.pos, perimPoints[i]) <= sensor.beaconDist) {
                    inRange = true;
                    break;
                }
            }
            if (!inRange) {
                beaconCoords = perimPoints[i];
            }
        }
        console.log(`part 2: ${(beaconCoords[0] * 4000000) + beaconCoords[1]}`);
    }
});