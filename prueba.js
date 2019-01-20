const fs = require("fs");

fs.readFile('Workbook1.xlsx', { encoding: 'UTF8' }, (err, data) => {
  if (err) {
    console.log('ERROR!@')
    throw err;
  } else {
    console.log('=====>', data);
    // const lines = data.split("\n");

    // for (let line of lines) {
    //   if (line) {
    //     console.log('=>', line);
    //   }
    // }
  }
});
