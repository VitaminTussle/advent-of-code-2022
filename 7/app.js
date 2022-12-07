const fs = require('fs');

fs.readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    let lines = data.split('\n');
    lines = lines.filter(el => el !== '');
    // ignore the first line since it's just putting us in the root dir
    lines = lines.slice(1);
    let fileSys = {
        name: '/',
        contents: []
    };
    let currentLoc = {
        parent: '',
        data: fileSys
    };
    for (const line of lines) {
        const info = line.split(' ');
        if (info[0] === '$') {
            if (info[1] === 'cd') {
                if (info[2] === '..' && currentLoc.parent) {
                    const fileChain = currentLoc.parent.split('\\');
                    const noHome = fileChain.slice(2);
                    let temp = fileSys;
                    for (const folder of noHome) {
                        temp = temp.contents.find(el => el.name === folder);
                    }
                    currentLoc = {
                        parent: fileChain.slice(0, fileChain.length - 1).join('\\'),
                        data: temp
                    };
                } else {
                    for (const content of currentLoc.data.contents) {
                        if (content.name === info[2]) {
                            const temp = {
                                parent: currentLoc.parent + '\\' + currentLoc.data.name,
                                data: content
                            }
                            currentLoc = temp;
                            break;
                        }
                    }
                }
            }
        } else {
            if (info[0] === 'dir' && !currentLoc.data.contents.find(el => el.name === info[1])) {
                const temp = {
                    name: info[1],
                    contents: []
                };
                currentLoc.data.contents.push(temp);
            } else if (!currentLoc.data.contents.find(el => el.name === info[1])) {
                const temp = {
                    name: info[1],
                    size: parseInt(info[0])
                }
                currentLoc.data.contents.push(temp);
            }
        }
    }

    const addDirectory = loc => {
        let sum = 0;
        for (let content of loc.contents) {
            if (content.size) {
                sum += content.size;
            } else {
                content = addDirectory(content);
                
                sum += content.size;
            }
        }
        loc.size = sum;
        return loc;
    };
    fileSys = addDirectory(fileSys);

    const sumApplicableDirectories = loc => {
        let sum = 0;
        for (let content of loc.contents) {
            if (content.contents) {
                if (content.size <= 100000) {
                    sum += content.size;
                }
                sum += sumApplicableDirectories(content);
            }
        }
        return sum;
    };

    const getDeletableDirectories = loc => {
        const deletable = [];
        for (let content of loc.contents) {
            if (content.contents) {
                if ((70000000 - (fileSys.size - content.size)) >= 30000000) {
                    deletable.push(content.size);
                }
                deletable.push(...getDeletableDirectories(content));
            }
        }
        return deletable;
    };

    console.log('part 1: ' + sumApplicableDirectories(fileSys));
    console.log('part 2: ' + Math.min(...getDeletableDirectories(fileSys)));
});