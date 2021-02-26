const fs = require("fs");
const srcFilejs = "./src/js";
const srcFilets = "./src/ts";
const srcFileJava = "./src/java";
const srcFileScala = "./src/scala";
const srcFileDotnet = "./src/dotnet";
const srcFileWords = "./src/words";
const srcFileGo = "./src/go";
const srcFilePy = "./src/python";
const srcFileRb = "./src/ruby";
const srcFileSql = "./src/sql";

const countLines = function (filePath, callback) {
  let i;
  let count = 0;
  fs.createReadStream(filePath)
    .on("error", e => callback(e))
    .on("data", chunk => {
      for (i = 0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
    })
    .on("end", () => callback(null, count));
};

var totalCountsJs = [];
var totalCountsTs = [];
var totalCountsGo = [];
var totalCountsPy = [];
var totalCountsRb = [];
var totalCountsSql = [];
var totalCountsJava = [];
var totalCountsScala = [];
var totalCountsDotnet = [];
var totalCountsWords = [];

function countLinesFiles(srcFile, files, collection) {
  files.forEach(f => {
    let isDirectory = false;
    try {
      isDirectory = fs.lstatSync(srcFile + "/" + f).isDirectory()
    } catch (e) {
      console.log(e);
    }

    if (f === 'node_modules') return;
    if (f === '.gitignore') return;
    if (f === '.editorconfig') return;
    if (f === 'karma.conf.js') return;
    if (f === 'browserslist') return;
    if (f === 'polyfills.ts') return;
    if (f === 'e2e') return;
    if (f.endsWith('.json')) return;
    if (f.endsWith('.ico')) return;
    if (isDirectory) {
      console.log("make recursive count");
      countFileByLanguage(srcFile + "/" + f, collection, false);
    } else {
      countLines(srcFile + "/" + f, function (err, data) {
        collection.push(data + 1);
      });
    }
  });
}

function countFileByLanguage(srcFile, collection, displayFiles) {
  fs.readdir(srcFile, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(files);

    if (displayFiles) console.log("Files: " + files.join(", "));

    countLinesFiles(srcFile, files, collection);
  });
}

countFileByLanguage(srcFileGo, totalCountsGo);
countFileByLanguage(srcFilejs, totalCountsJs);
countFileByLanguage(srcFilets, totalCountsTs);
countFileByLanguage(srcFilePy, totalCountsPy);
countFileByLanguage(srcFileRb, totalCountsRb);
countFileByLanguage(srcFileSql, totalCountsSql);
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
  let displayOrdered = true;

  reducedJs = totalCountsJs.reduce(sumFunc, 0);
  writeCount("jsCount.txt", reducedJs);
  result.push({
    lan: "JS   ",
    lines: reducedJs
  });

  reducedTs = totalCountsTs.reduce(sumFunc, 0);
  writeCount("tsCount.txt", reducedTs);
  result.push({
    lan: "TS   ",
    lines: reducedTs
  });

  reducedGo = totalCountsGo.reduce(sumFunc, 0);
  writeCount("goCount.txt", reducedGo);
  result.push({
    lan: "GO   ",
    lines: reducedGo
  });

  reducedPy = totalCountsPy.reduce(sumFunc, 0);
  writeCount("pyCount.txt", reducedPy);
  result.push({
    lan: "Python ",
    lines: reducedPy
  });
  
  reducedRb = totalCountsRb.reduce(sumFunc, 0);
  writeCount("RbCount.txt", reducedRb);
  result.push({
    lan: "Ruby",
    lines: reducedRb
  });

  reducedSql = totalCountsSql.reduce(sumFunc, 0);
  writeCount("sqlCount.txt", reducedSql);
  result.push({
    lan: "Sql ",
    lines: reducedSql
  });

  reducedJava = totalCountsJava.reduce(sumFunc, 0);
  writeCount("javaCount.txt", reducedJava);

  result.push({
    lan: "Java ",
    lines: reducedJava
  });

  reducedScala = totalCountsScala.reduce(sumFunc, 0);
  writeCount("scalaCount.txt", reducedScala);
  result.push({
    lan: "Scala",
    lines: reducedScala
  });

  reducedDotnet = totalCountsDotnet.reduce(sumFunc, 0);
  writeCount("dotnetCount.txt", reducedDotnet);
  result.push({
    lan: "CS   ",
    lines: reducedDotnet
  });

  reducedWords = totalCountsWords.reduce(sumFunc, 0);
  writeCount("wordsCount.txt", reducedWords);
  result.push({
    lan: "WD   ",
    lines: reducedWords
  });

  if (displayOrdered) {
    result = result.sort((a, b) => b.lines - a.lines);
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

  let technologies = `
# Technologies
* Angular, React, Vue
* Spring, Play
* Scala, Java
`;

  let colHeaders = "\n|Language" + "|Lines" + "|" + "%|" + "%|";
  colHeaders += "\n|----------|-------|--------|--------|";
  let countInfo =
    "# All count" +
    result.reduce(
      (x, y) =>
        x +
        "\n|" +
        y.lan +
        "|" +
        y.lines +
        "" +
        "|" +
        Number((y.lines / 10000) * 100 * 5).toFixed(0) +
        "|" +
        //"![progress](http://progressed.io/bar/" +
        Number((y.lines / 10000) * 100 * 5).toFixed(0) +
        //' "progress")' +
        "|",
      colHeaders
    );

  let total =
    reducedJs +
    reducedTs +
    reducedGo +
    reducedPy +
    reducedRb +
    reducedSql +
    reducedJava +
    reducedScala +
    reducedDotnet +
    reducedWords;
  let countGoal = 1000;
  let goalPercent = Number((total / countGoal) * 100).toFixed(3);

  countInfo += "\n|TOTAL|" + total + "|" + goalPercent + "%|";
  console.log(countInfo);

  // param to save previous
  // read previous after it
  let previous = 0;
  countInfo += "\n" + "10/02(" + (previous) + ")\n";
  countInfo += "\n" + "10/03(" + (total - previous) + ")\n";
  countInfo += "\n" + run + "\n" + enfore + activity + purposes + technologies;

  writeCount("Readme.md", countInfo);
}, 5000);
