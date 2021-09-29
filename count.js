const fs = require("fs");
const readline = require('readline')
const nodeHtmlToImage = require('node-html-to-image')

const configLn = require('./config').configLn

const srcRoot = './src';

let totals = {};
let lnSubjects = {};

function countAllLns() {
  configLn.forEach(ln => {
    totals[ln.ln] = [];
  })

  configLn.forEach(ln => {
    lnSubjects[ln.ln] = [];
  })

  configLn.forEach(ln => {
    if (ln.src && ln.src.length > 0) {
      ln.src.forEach(fil => {
        countFileByLanguage(fil, totals[ln.ln], ln.ln);
      })
    } else {
      countFileByLanguage(srcRoot + "/" + ln.ln, totals[ln.ln], ln.ln);
    }
  })
}

function buildTotalCounts() {
  setTimeout(async () => {
    var result = [];
    let displayOrdered = true;

    reduced = {}

    await configLn.forEach(async ln => {
      reduced[ln.ln] = totals[ln.ln].reduce(sumFunc, 0)

      console.log('###################')
      console.log(`${ln.ln}: ${reduced[ln.ln]}`)
      console.log("Reading data")

      let lastLine = 0;
      appendFile(ln.ln + ".txt", reduced[ln.ln]);
      result.push({
        lan: ln.ln,
        lines: reduced[ln.ln],
        goal: ln.goal,
        diff: Number(reduced[ln.ln]) - Number(lastLine)
      });
    })

    if (displayOrdered) {
      result = result.sort((a, b) => {
        let aGoal = Number(a.goal) > Number(a.lines) ? Number(a.goal) : 10000
        let bGoal = Number(b.goal) > Number(b.lines) ? Number(b.goal) : 10000

        return ((b.lines / bGoal) - (a.lines / aGoal));
      });
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

    let colHeaders = "\n|Language" + "|Goal" + "|Lines" + "%|" + "%|" + "%|"+ "%|" + "Subjects|";
    
    colHeaders += "\n|----------|-------|-------|--------|--------|--------|--------|";

    let countInfo =
      "# All count" +
      result.reduce(
        (x, y) => {
          let goal = Number(y.goal);
          if (Number(y.goal) < Number(y.lines)) {
            goal = 10000
          }
          
          console.log(y)
          console.log(lnSubjects)

          return x +
            "\n|" +
            y.lan +
            "|" +
            goal +
            "|" +
            y.lines +
            "|" +
            Number((y.lines / goal) * 100).toFixed(0) +
            "|" +
            `![${y.lan}](https://raw.githubusercontent.com/kapit4n/l-10000-dev/master/${y.lan}.png)` +
            "|" +
            `${configLn.find(l => l.ln == y.lan).subjects.join(", ")}` +
            "|"
            +
            `${lnSubjects[y.lan].join(", ")}` +
            "|"
            ;
        }
        ,
        colHeaders
      );

    let total = 0;

    configLn.forEach(ln => {
      total += reduced[ln.ln]
    })

    let countGoal = 10000 * configLn.length;
    let goalPercent = Number((total / countGoal) * 100).toFixed(3);

    countInfo += "\n|TOTAL|" + total + "|" + goalPercent + "%|";

    writeCountAll('total.txt', total)

    let previous = 0;
    countInfo += "\n" + "10/02(" + (previous) + ")\n";
    countInfo += "\n" + "10/03(" + (total - previous) + ")\n";
    countInfo += "\n" + run + "\n" + enfore + activity + purposes + technologies;

    writeFile("Readme.md", countInfo);

    configLn.forEach(ln => {
      buildCharts(ln.ln, ln.ln + ".txt")
    })
    buildCharts("total", "./total.txt");
  }, 5000);

}

function appendFile(fileName, content) {
  fs.appendFile(fileName, content + ", " + new Date().toISOString() + "\n", function (err) {
    if (err) return console.log(error);
  });
}

function writeFile(fileName, content) {
  fs.writeFile(fileName, content + ", " + new Date().toISOString() + "\n", function (err) {
    if (err) return console.log(error);
  });
}

function writeCountAll(fileName, content) {
  fs.appendFile(fileName, content + ", " + new Date().toISOString() + "\n", function (err) {
    if (err) return console.log(error);
  });
}

function sumFunc(x, y) {
  return x + y;
}

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

function countLinesFiles(srcFile, files, collection, ln) {
  files.forEach(fileName => {
    let isDirectory = false;
    
    try {
      isDirectory = fs.lstatSync(srcFile + "/" + fileName).isDirectory()
    } catch (e) {
      console.log(e);
    }

    if (fileName === 'node_modules') return;
    if (fileName === '.git') return;
    if (fileName === '.gitignore') return;
    if (fileName === '.editorconfig') return;
    if (fileName === 'karma.conf.js') return;
    if (fileName === 'browserslist') return;
    if (fileName === 'polyfills.ts') return;
    if (fileName === 'e2e') return;
    if (fileName.endsWith('.json')) return;
    if (fileName.endsWith('.ico')) return;
    if (fileName.endsWith('.png')) return;

    const filePath = srcFile + "/" + fileName
    if (!filePath.includes('/old')) {
      console.log(srcFile + "/" + fileName); // display directories used to count
      const subjectName = fileName.split('.')[0]
      console.log(subjectName)
      console.log(ln)
      console.log(ln)
      console.log(ln)
      console.log(ln)
      lnSubjects[ln].push(subjectName)
    }

    if (isDirectory) {
      // console.log("make recursive count");
      countFileByLanguage(srcFile + "/" + fileName, collection, ln, false);
    } else {
      countLines(srcFile + "/" + fileName, function (err, data) {
        collection.push(data + 1);
      });
    }
  });
}

function countFileByLanguage(srcFile, collection, ln, displayFiles) {
  fs.readdir(srcFile, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // console.log(files);

    if (displayFiles) console.log("Files: " + files.join(", "));

    countLinesFiles(srcFile, files, collection, ln);
  });
}

function buildCharts(title, file) {

  var fileText = "";
  var labelDates = '[';
  var valuesData = '[';
  const fileStream = fs.createReadStream(file);
  const readInterface = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  readInterface.on('line', (line) => {
    const values = line.split(",")
    valuesData += values[0] + ","
    labelDates += '"' + values[1].trim() + '",'
  })

  readInterface.on('close', () => {

    valuesData += "]"
    labelDates += ']'
    fileText = `
      <!DOCTYPE HTML>
      <html>
      <head></head>
      <body>
        <div style="width: 500px;">
          <canvas id="${title}" width="300" height="150"></canvas>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
        <script>
          var ctx = document.getElementById("${title}").getContext("2d");
          const goLabelsDates = ${labelDates};
          var chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: goLabelsDates.map(x => new Date(x).getDate() + "-" + (new Date(x).getMonth() + 1)),
              datasets: [{
                label: '${title} Progress',
                backgroundColor: 'rgb(255, 0, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: ${valuesData}
              }]
            },
          });
        </script>
      </body>
      </html>  
      `;


    nodeHtmlToImage({
      output: `./${title}.png`,
      html: fileText,
      content: { name: title }
    })
      .then(() => console.log('The image was created successfully!'))

    fs.writeFileSync(title + ".html", fileText)
  })
}

countAllLns();

buildTotalCounts()
