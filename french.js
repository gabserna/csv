const csv = require('csv-parser');
const fs = require('fs');

const results = [];

fs.createReadStream('./data/languages.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (data.language === 'French') {
      results.push(data);
      
      console.log(`people talking French: ${counter}`)
    }
  })
  .on('end', () => {
    console.log(results);
});