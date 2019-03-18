const fs = require('fs');
const srcFilejs = './src/js';
const srcFileJava = './src/java';
const srcFileScala = './src/scala';
const srcFileDotnet = './src/dotnet';
const srcFileWords = './src/words';

const countLines = function (filePath, callback) {
    let i;
    let count = 0;
    fs.createReadStream(filePath)
        .on('error', e => callback(e))
        .on('data', chunk => {
            for (i = 0; i < chunk.length; ++i)
                if (chunk[i] == 10) count++;
        })
        .on('end', () => callback(null, count));
};

var totalCountsJs = [];
var totalCountsJava = [];
var totalCountsScala = [];
var totalCountsDotnet = [];
var totalCountsWords = [];

function countLinesFiles(srcFile, files, collection) {
    files.forEach(f => {
        countLines(srcFile + "/" + f, function (err, data) {
            collection.push(data + 1);
        });
    })
}

function countFileByLanguage(srcFile, collection, displayFiles) {
    fs.readdir(srcFile, (err, files) => {
        if (displayFiles) console.log("Files: " + files.join(", "));
        countLinesFiles(srcFile, files, collection);
    })
}

countFileByLanguage(srcFilejs, totalCountsJs);
countFileByLanguage(srcFileJava, totalCountsJava);
countFileByLanguage(srcFileScala, totalCountsScala);
countFileByLanguage(srcFileDotnet, totalCountsDotnet);
countFileByLanguage(srcFileWords, totalCountsWords);

function writeCount(fileName, content) {
    fs.writeFile(fileName, content, function (err) {
        if (err) return console.log(error);
    });
}

function writeCountAll(fileName, content) {
    fs.writeFile(fileName, content, function (err) {
        if (err) return console.log(error);
    });
}

function sumFunc(x, y) {
    return x + y;
}

setTimeout(function () {

    var result = [];
    let displayOrderd = true;

    reducedJs = totalCountsJs.reduce(sumFunc, 0);
    writeCount('jsCount.txt', reducedJs);
    result.push({
        lan: "JS   ",
        lines: reducedJs
    });



    reducedJava = totalCountsJava.reduce(sumFunc, 0);
    writeCount('javaCount.txt', reducedJava);

    result.push({
        lan: "Java ",
        lines: reducedJava
    });

    reducedScala = totalCountsScala.reduce(sumFunc, 0);
    writeCount('scalaCount.txt', reducedScala);
    result.push({
        lan: "Scala",
        lines: reducedScala
    });

    reducedDotnet = totalCountsDotnet.reduce(sumFunc, 0);
    writeCount('dotnetCount.txt', reducedDotnet);
    result.push({
        lan: "CS   ",
        lines: reducedDotnet
    });

    reducedWords = totalCountsWords.reduce(sumFunc, 0);
    writeCount('wordsCount.txt', reducedWords);
    result.push({
        lan: "WD   ",
        lines: reducedWords
    });


    if (displayOrderd) {
        result.sort((a, b) => a.lines > b.lines);
    }


    let run = `
# run it
node ./count.js
    `;

    let activity = `
# Activities
* Write source code related to any topic
* Comment the understanding part of it
    `;

    let purposes = `
# Purposes
* Reach to 100 lines daily
* 2000 lines of source code monthly
* 20 commits more
`;

    let enfore = `# Enforce
* Algorithms
* Code writing velocity
`;

    let countInfo = "# All count" + result.reduce((x, y) => x + "\n- " + y.lan + ":\t" + y.lines, "");
    
    result.forEach(x => console.log("*    " + x.lan + ":\t" + x.lines));
    console.log("*    TOTAL:\t" + (reducedJs + reducedJava + reducedScala + reducedDotnet + reducedWords));
    countInfo += "\n- TOTAL:\t" + (reducedJs + reducedJava + reducedScala + reducedDotnet + reducedWords);
    countInfo += "\n" + run +"\n" + enfore +  activity +  purposes;
    
    writeCount('Readme.md', countInfo);

}, 5000);
