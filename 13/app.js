const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');

    // helper method
    const rightOrder = (arr1, arr2) => {
        let count = 0;
        while (count < arr1.length && count < arr2.length) {
            if (typeof arr1[count] === 'number' && typeof arr2[count] === 'number') {
                if (arr1[count] < arr2[count]) {
                    return true;
                } else if (arr1[count] > arr2[count]) {
                    return false;
                }
            } else if (typeof arr1[count] === 'number') {
                const temp = [arr1[count]];
                const result = rightOrder(temp, arr2[count]);
                if (result !== undefined) {
                    return result;
                }
            } else if (typeof arr2[count] === 'number') {
                const temp = [arr2[count]];
                const result = rightOrder(arr1[count], temp);
                if (result !== undefined) {
                    return result;
                }
            } else {
                const result = rightOrder(arr1[count], arr2[count]);
                if (result !== undefined) {
                    return result;
                }
            }
            count++;
        }
        if (arr1.length < arr2.length) {
            return true;
        } else if (arr2.length < arr1.length) {
            return false;
        }
    };

    // part 1
    let sum = 0;
    for (let i = 0; i + 1 < lines.length; i += 2) {
        const list1 = JSON.parse(lines[i]);
        const list2 = JSON.parse(lines[i + 1]);
        const right = rightOrder(list1, list2);
        if ([true, undefined].includes(right)) {
            sum += ((i / 2) + 1);
        }
    }
    console.log(`part 1: ${sum}`);

    // part 2
    // add divider packets
    lines.push('[[2]]');
    lines.push('[[6]]');
    const sorted = lines.sort((a, b) => {
        const list1 = JSON.parse(a);
        const list2 = JSON.parse(b);
        const right = rightOrder(list1, list2);
        if ([true, undefined].includes(right)) {
            return -1;
        } else {
            return 1;
        }
    });
    const dividerPos1 = sorted.indexOf('[[2]]') + 1;
    const dividerPos2 = sorted.indexOf('[[6]]') + 1;
    const decodeKey = dividerPos1 * dividerPos2;
    console.log(`part 2: ${decodeKey}`);
});