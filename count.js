const fs = require('fs');
const srcFilejs = './src/js';
const srcFileJava = './src/java';
const srcFileScala = './src/scala';
const srcFileDotnet = './src/dotnet';

const countLines = function(filePath, callback) {
    let i;
    let count = 0;
    fs.createReadStream(filePath)
        .on('error', e => callback(e))
        .on('data', chunk => {
            for (i=0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
        })
        .on('end', () => callback(null, count));
};

var totalCountsJs = [];
var totalCountsJava = [];
var totalCountsScala = [];
var totalCountsDotnet = [];

function countLinesFiles(srcFile, files, collection) {
    files.forEach(f => {
        countLines(srcFile + "/" + f, function(err, data) {
            collection.push(data + 1);
        });
    })
}

function countFileByLanguage(srcFile, collection) {
    fs.readdir(srcFile, (err, files) => {
        console.log("Files: " + files.join(", "));
        countLinesFiles(srcFile, files, collection);
      })
}

countFileByLanguage(srcFilejs, totalCountsJs);
countFileByLanguage(srcFileJava, totalCountsJava);
countFileByLanguage(srcFileScala, totalCountsScala);
countFileByLanguage(srcFileDotnet, totalCountsDotnet);

function writeCount(fileName, content) {
    fs.writeFile(fileName, content, function(err) {
        if (err) return console.log(error);
    });
}

function sumFunc(x, y) {
    return x + y;
}

setTimeout(function() {
    reducedJs = totalCountsJs.reduce(sumFunc, 0);
    writeCount('jsCount.txt', reducedJs);
    console.log("Javascript is: " + reducedJs)
    
    
    reducedJava = totalCountsJava.reduce(sumFunc, 0);
    writeCount('javaCount.txt', reducedJava);
    console.log("Java is: " + reducedJava)
    
    reducedScala = totalCountsScala.reduce(sumFunc, 0);
    writeCount('scalaCount.txt', reducedScala);
    console.log("Scala is: " + reducedScala)

    reducedDotnet = totalCountsDotnet.reduce(sumFunc, 0);
    writeCount('dotnetCount.txt', reducedDotnet);
    console.log("DotNet is: " + reducedDotnet)

    console.log("total is: "  + (reducedJs + reducedJava + reducedScala + reducedDotnet));

}, 5000);

