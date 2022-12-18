const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    const cubes = [];
    for (const line of lines) {
        cubes.push(line.split(',').map(el => parseInt(el)));
    }
    // I only did part 1 today because I started 2 hours late and am also just kinda losing the spirit of the thing
    // part 2 doesn't seem all that hard but I don't really feel like doing it
    // O(n^2) isn't the best but I splattered this code out in like 2 minutes and got a right answer after a quarter second
    //   of runtime so if I had actually started on time my leaderboard placement for part 1 would be insanely high
    // anyway gooooooooood morning vietnam considering time zones
    // im out
    // peace
    let surfaceArea = 0;
    for (const cube of cubes) {
        const xUp = [cube[0] + 1, cube[1], cube[2]];
        const xDown = [cube[0] - 1, cube[1], cube[2]];
        const yUp = [cube[0], cube[1] + 1, cube[2]];
        const yDown = [cube[0], cube[1] - 1, cube[2]];
        const zUp = [cube[0], cube[1], cube[2] + 1];
        const zDown = [cube[0], cube[1], cube[2] - 1];
        const checks = [xUp, xDown, yUp, yDown, zUp, zDown];
        const exposed = [true, true, true, true, true, true];
        for (const c of cubes) {
            for (let i = 0; i < 6; i++) {
                if (c.every((el, ind) => el === checks[i][ind])) {
                    exposed[i] = false;
                }
            }
        }
        surfaceArea += exposed.reduce((prev, curr) => curr ? (prev + 1) : prev, 0);
    }
    console.log(surfaceArea);
});