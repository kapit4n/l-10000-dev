const fs = require("fs");
const readline = require('readline')
const nodeHtmlToImage = require('node-html-to-image')

const srcRoot = './src';

const configLn = [
  {
    ln: 'denti-code',
    title: "JavaScript Denti",
    subjects: [
      "react,", "hooks"
    ],
    src: ['../../node/denti-code/ui/src', '../../node/denti-code/server'],
    goal: 1500
  },
  {
    ln: 'react-shopping-cart',
    title: "React Shopping Cart",
    subjects: [
      "react,", "hooks", 'Redux'
    ],
    src: [ '../../react/react-shopping-cart'],
    goal: 1500
  },
  {
    ln: 'js',
    title: "JavaScript",
    subjects: [
      "react, ", "angular, sequelize, mongoose, prisma, node js."
    ],
    goal: 6000
  },
  {
    ln: 'ts',
    title: "TS",
    subjects: [
      "angular, microORM, typeORM, node js."
    ],
    goal: 500
  },
  {
    ln: 'java',
    title: "java",
    subjects: ["reflexion", "strings", "generics", "documentation"],
    goal: 2000
  },
  {
    ln: 'scala',
    title: "scala",
    subjects: ["play framework", "akka", "collections"],
    goal: 2000
  },
  {
    ln: 'dotnet',
    title: "dotnet",
    subjects: [],
    goal: 500
  },
  {
    ln: 'words',
    title: "words",
    subjects: [],
    goal: 500
  },
  {
    ln: 'go',
    title: "go",
    subjects: ["structs", "loops"],
    goal: 3000
  },
  {
    ln: 'python',
    title: "python",
    subjects: ["collections", ""],
    goal: 2000
  },
  {
    ln: 'ruby',
    title: "ruby",
    subjects: ["migrations", "ruby on rails", "presenters", "models"],
    goal: 2000
  },
  {
    ln: 'sql',
    title: "sql",
    subjects: [],
    goal: 500
  },
  {
    ln: 'html',
    title: "html",
    subjects: [],
    goal: 500
  },
  {
    ln: 'css',
    title: "css",
    subjects: [],
    goal: 500
  },
]

let totals = {};

configLn.forEach(ln => {
  totals[ln.ln] = [];
})

configLn.forEach(ln => {
  if (ln.src && ln.src.length > 0) {
    ln.src.forEach(fil => {
      countFileByLanguage(fil, totals[ln.ln]);
    })
  } else {
    countFileByLanguage(srcRoot + "/" + ln.ln, totals[ln.ln]);
  }
})


setTimeout(function () {
  var result = [];
  let displayOrdered = true;

  reduced = {}

  configLn.forEach(ln => {
    reduced[ln.ln] = totals[ln.ln].reduce(sumFunc, 0)
    appendFile(ln.ln + ".txt", reduced[ln.ln]);
    result.push({
      lan: ln.ln,
      lines: reduced[ln.ln],
      goal: ln.goal
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

  let colHeaders = "\n|Language" + "|Goal" + "|Lines" + "|" + "%|" + "%|" + "%|";
  colHeaders += "\n|----------|-------|-------|--------|--------|--------|";
  let countInfo =
    "# All count" +
    result.reduce(
      (x, y) => {
        let goal = Number(y.goal);
        if (Number(y.goal) < Number(y.lines)) {
          goal = 10000
        }
        return  x +
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
        "|";
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
  console.log(countInfo);

  writeCountAll('total.txt', total)

  // param to save previous
  // read previous after it
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

function countLinesFiles(srcFile, files, collection) {
  files.forEach(f => {
    let isDirectory = false;
    try {
      isDirectory = fs.lstatSync(srcFile + "/" + f).isDirectory()
    } catch (e) {
      console.log(e);
    }
    
    if (f === 'node_modules') return;
    if (f === '.git') return;
    if (f === '.gitignore') return;
    if (f === '.editorconfig') return;
    if (f === 'karma.conf.js') return;
    if (f === 'browserslist') return;
    if (f === 'polyfills.ts') return;
    if (f === 'e2e') return;
    if (f.endsWith('.json')) return;
    if (f.endsWith('.ico')) return;
    if (f.endsWith('.png')) return;
    // console.log(f); // display directories used to count

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
          <canvas id="${title}" width="500" height="300"></canvas>
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