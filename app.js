const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('./data/data.csv')
    .pipe(csv())
    .on('data', (row) => {
    console.log(row);
})
    .on('end', () => {
    console.log('CSV file read');
});