const fs = require("fs");
const readline = require('readline')
const nodeHtmlToImage = require('node-html-to-image')

const srcRoot = './src';

const configLn = [
  {
    ln: 'js',
    title: "JavaScript"
  },
  {
    ln: 'ts',
    title: "TS"
  },

  {
    ln: 'java',
    title: "java"
  },
  {
    ln: 'scala',
    title: "scala"
  },
  {
    ln: 'dotnet',
    title: "dotnet"
  },
  {
    ln: 'words',
    title: "words"
  },
  {
    ln: 'go',
    title: "go"
  },
  {
    ln: 'python',
    title: "python"
  },
  {
    ln: 'ruby',
    title: "ruby"
  },
  {
    ln: 'sql',
    title: "sql"
  },
]

let totals = {};

configLn.forEach(ln => {
  totals[ln.ln] = [];
})

configLn.forEach(ln => {
  countFileByLanguage(srcRoot + "/" + ln.ln, totals[ln.ln]);
})


setTimeout(function () {
  var result = [];
  let displayOrdered = true;

  reduced = {}

  configLn.forEach(ln => {
    reduced[ln.ln] = totals[ln.ln].reduce(sumFunc, 0)
    writeCount(ln.ln + ".txt", reduced[ln.ln]);
    result.push({
      lan: ln.ln,
      lines: reduced[ln.ln]
    });
  })

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

  let total = 0;

  configLn.forEach(ln => {
    total += reduced[ln.ln]
  })

  let countGoal = 1000;
  let goalPercent = Number((total / countGoal) * 100).toFixed(3);

  countInfo += "\n|TOTAL|" + total + "|" + goalPercent + "%|";
  console.log(countInfo);

  writeCountAll('total.txt', total)

  // param to save previous
  // read previous after it
  let previous = 0;
  countInfo += "\n" + "10/02(" + (previous) + ")\n";
  countInfo += "\n" + "10/03(" + (total - previous) + ")\n";
  countInfo += "\n" + run + "\n" + enfore + activity + purposes + technologies;

  writeCount("Readme.md", countInfo);

  configLn.forEach(ln => {
    buildCharts(ln.ln, ln.ln + ".txt")
  })
  buildCharts("total", "./total.txt");
}, 5000);


function writeCount(fileName, content) {
  fs.appendFile(fileName, content + ", " + new Date().toISOString() + "\n", function (err) {
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
          <canvas id="${title}" width="500" height="500"></canvas>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
        <script>
          var ctx = document.getElementById("${title}").getContext("2d");
          const goLabelsDates = ${labelDates};
          var chart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: goLabelsDates.map(x => new Date(x).getDate() + "-" + (new Date(x).getMonth() + 1) + "-" + new Date(x).getFullYear()),
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