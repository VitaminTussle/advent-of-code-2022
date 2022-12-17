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

        const getRoutes = (meValve, eleValve, meParent, eleParent, minsLeft = 26, currPpm = 0, total = 0, visited = []) => {
            // if (minsLeft && minsLeft >= 20) console.log(minsLeft);
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

        // const getRoutes = (meProps, eleProps, visited) => {
        //     const ret = {
        //         me: null,
        //         ele: null
        //     };
        //     let newMe = {};
        //     let newEle = {};
        //     for (const prop in meProps) {
        //         newMe[prop] = meProps[prop];
        //         newEle[prop] = eleProps[prop];
        //     }
        //     let newVisited = [];
        //     for (const v of visited) {
        //         newVisited.push(v);
        //     }
        //     // open valves for Me if necessary
        //     if (valves[meProps.valve].rate > 0 && meProps.minsLeft > 0 && !newVisited.includes(meProps.valve)) {
        //         newMe.total += newMe.currPpm;
        //         newMe.currPpm += valves[meProps.valve].rate;
        //         newMe.minsLeft--;
        //         newVisited.push(meProps.valve);
        //     }
        //     if (newMe.minsLeft <= 0) {
        //         ret.me = {
        //             total: newMe.total,
        //             path: meProps.valve
        //         };
        //     }
        //     // open valves for Elephant if necessary
        //     if (valves[eleProps.valve].rate > 0 && eleProps.minsLeft > 0 && !newVisited.includes(eleProps.valve)) {
        //         newEle.total += newEle.currPpm;
        //         newEle.currPpm += valves[eleProps.valve].rate;
        //         newEle.minsLeft--;
        //         newVisited.push(eleProps.valve);
        //     }
        //     if (newEle.minsLeft <= 0) {
        //         ret.ele = {
        //             total: newEle.total,
        //             path: eleProps.valve
        //         };
        //     }
        //     if (ret.me && ret.ele) {
        //         return ret;
        //     }
        //     // try... every... path... combination.........
        //     // look, I'm not proud of this ok, my fingers are just running while my mind tries to go to sleep
        //     const paths = [];
        //     for (const v of valves[meProps.valve].paths) {
        //         if (v !== meProps.parent && v !== meProps.valve && newMe.minsLeft > 0) {
        //             newMe.valve = (newMe.minsLeft > 0 ? v : meProps.valve);
        //             newMe.minsLeft -= (newMe.minsLeft > 0 ? 1 : 0);
        //             newMe.total += (newMe.minsLeft > 0 ? newMe.currPpm : 0);
        //             newMe.parent = (newMe.minsLeft > 0 ? meProps.valve : meProps.parent);
        //         }
        //         for (const v2 of valves[eleProps.valve].paths) {
        //             if (v2 !== eleProps.parent && v2 !== newMe.valve && newEle.minsLeft > 0) {
        //                 newEle.valve = (newEle.minsLeft > 0 ? v2 : eleProps.valve);
        //                 newEle.minsLeft -= (newEle.minsLeft > 0 ? 1 : 0);
        //                 newEle.total += (newEle.minsLeft > 0 ? newEle.currPpm : 0);
        //                 newEle.parent = (newEle.minsLeft > 0 ? eleProps.valve : eleProps.parent);
        //                 const routeOutput = getRoutes(newMe, newEle, newVisited);
        //                 paths.push(routeOutput);
        //             }
        //         }
        //     }
        //     if (!paths.length) {
        //         newMe.valve = meProps.parent;
        //         newMe.minsLeft -= (newMe.minsLeft > 0 ? 1 : 0);
        //         newMe.total += (newMe.minsLeft > 0 ? newMe.currPpm : 0);
        //         newMe.parent = meProps.valve;
        //         newEle.valve = eleProps.parent;
        //         newEle.minsLeft -= (newEle.minsLeft > 0 ? 1 : 0);
        //         newEle.total += (newEle.minsLeft > 0 ? newEle.currPpm : 0);
        //         newEle.parent = eleProps.valve;
        //         const routeOutput = getRoutes(newMe, newEle, newVisited);
        //         paths.push(routeOutput);
        //     }
        //     const sorted = paths.sort((a, b) => a.me.total + a.ele.total > b.me.total + b.ele.total ? -1 : 1);
        //     const best = sorted[0];
        //     best.me.path = meProps.valve + ' ' + best.me.path;
        //     best.ele.path = eleProps.valve + ' ' + best.ele.path;
        //     ret.me = ret.me ?? best.me;
        //     ret.ele = ret.ele ?? best.ele;
        //     return ret;
        // };
        // console.log('part 2:');
        // const startingMeProps = {
        //     valve: 'AA',
        //     parent: '',
        //     currPpm: 0,
        //     total: 0,
        //     minsLeft: 26
        // };
        // // don't want a shallow copy that would be bad
        // const startingEleProps = {
        //     valve: 'AA',
        //     parent: '',
        //     currPpm: 0,
        //     total: 0,
        //     minsLeft: 26
        // }
        // const results = getRoutes(startingMeProps, startingEleProps, []);
        // const util = require('util');
        // console.log(util.inspect(results, false, null, true));
        // console.log(results.me.total + results.ele.total);
    }
});