'use strict';

const express = require('express');
const app = express();
app.use(express.json());

// Your code starts here. Placeholders for .get and .post are provided for
//  your convenience.

var data = [];
var nextId = 0;

app.post('/candidates', function (req, res) {
  // ...
  data.push(req.body);
  res.status(200).send({})
});

app.get('/candidates/search', function (req, res) {
  if (data.length === 0) {
    res.status(404).json({});
  } else {
    console.log(req.query);
    //console.log(data);
    if (req.query.skills) {

      const skills = req.query.skills.split(",");
      const bestOne = {};
      const counterAux = 0;


      console.log("GO2")
      data.forEach(can => {
        console.log("GO3")

        let counter = 0;
        skills.forEach(sk => {
          if (can.skills.includes(sk)) {
            counter++;
          }
        });
        if (counter > counterAux) {
          bestOne = can;
        }
      });


      console.log(bestOne);

      if (bestOne.id) {
        res.status(200).send(bestOne);
        return;
      }
    }

    res.status(404).send({});
  }
});

app.listen(process.env.HTTP_PORT || 3000);
