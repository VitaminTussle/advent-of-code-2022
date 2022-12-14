const fs = require('fs');
const PART = 2;

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    const valves = {};
    for (const line of lines) {
        const parts = line.split('; ');
        const valvePart = parts[0];
        const pathPart = parts[1];
        const valveWords = valvePart.split(' ');
        const pathWords = pathPart.split(' ');
        const valveName = valveWords[1];
        const rateWord = valveWords[4];
        const rate = parseInt(rateWord.split('=')[1]);
        const pathOptions = pathWords.slice(4);
        const formattedPaths = pathOptions.map(el => el.replace(',', ''));
        const valve = {
            rate: rate,
            paths: formattedPaths
        };
        valves[valveName] = valve;
    }

    if (PART === 1) {
        // part 1
        const getRoutes = (valve, minsLeft, currPpm, totalReleased, parent, visited) => {
            let newPpm = currPpm;
            let newMinsLeft = minsLeft;
            let newTotal = totalReleased;
            let newVisited = [];
            for (const v of visited) {
                newVisited.push(v);
            }
            if (valves[valve].rate > 0 && minsLeft > 0 && !newVisited.includes(valve)) {
                newTotal += currPpm;
                newPpm += valves[valve].rate;
                newMinsLeft--;
                newVisited.push(valve);
            }
            if (newMinsLeft === 0) {
                return {
                    ppm: newPpm,
                    total: newTotal,
                    path: valve
                };
            }
            const paths = [];
            for (const v of valves[valve].paths) {
                if (v !== parent) {
                    const routeOutput = getRoutes(v, newMinsLeft - 1, newPpm, newTotal + newPpm, valve, newVisited);
                    paths.push(routeOutput);
                }
            }
            if (!paths.length && valves[valve].paths.includes(parent)) {
                const routeOutput = getRoutes(parent, newMinsLeft - 1, newPpm, newTotal + newPpm, valve, newVisited);
                paths.push(routeOutput);
            }
            const sorted = paths.sort((a, b) => a.total > b.total ? -1 : 1);
            const best = sorted[0];
            best.path = valve + ' ' + best.path;
            return best;
        };
        console.log('part 1:');
        const util = require('util');
        console.log(util.inspect(getRoutes('AA', 30, 0, 0, '', []), false, null, true));
    } else {
        // part 2

        // hahaha I let this run overnight and it didn't finish, then I optimized it and let it run for like 3 hours and got a wrong answer, I'm done with it for now
        const getRoutes = (meValve, eleValve, meParent, eleParent, minsLeft = 26, currPpm = 0, total = 0, visited = []) => {
            if (minsLeft <= 0) {
                return total;
            }
            const newTotal = total + currPpm;
            let newPpm = currPpm;
            let newVisited = [];
            for (const v of visited) {
                newVisited.push(v);
            }
            let meOpened = false;
            let eleOpened = false;
            if (valves[meValve].rate && !visited.includes(meValve)) {
                newPpm += valves[meValve].rate;
                newVisited.push(meValve);
                meOpened = true;
            }
            if (valves[eleValve].rate && !visited.includes(eleValve)) {
                newPpm += valves[eleValve].rate;
                newVisited.push(eleValve);
                eleOpened = true;
            }
            let mePoss = meOpened ? [meValve] : valves[meValve].paths.filter(el => !newVisited.includes(el));
            let elePoss = eleOpened ? [eleValve] : valves[eleValve].paths.filter(el => !newVisited.includes(el));
            mePoss = mePoss.filter(m => m !== meParent);
            mePoss = mePoss.length ? mePoss : [meParent];
            elePoss = elePoss.filter(e => e !== eleParent);
            elePoss = elePoss.length ? elePoss : [eleParent];
            const paths = [];
            for (const m of mePoss) {
                for (const e of elePoss) {
                    if (m !== e) {
                        paths.push(getRoutes(m, e, meValve, eleValve, minsLeft - 1, newPpm, newTotal, newVisited));
                    }
                }
            }
            if (!paths.length) {
                return (minsLeft - 1) * newPpm;
            }
            const sorted = paths.sort((a, b) => b - a);
            return sorted[0];
        };
        const results = getRoutes('AA', 'AA', '', '');
        console.log(results);
    }
});