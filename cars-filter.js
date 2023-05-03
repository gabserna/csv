//"cars-filter.js" debe dar opciones: que el usuario ingrese año a buscar y accesar a los datos de "./usedCars.csv" mostrando el resultado del numero de registros hallados en el archivo csv que coinciden con el campo "year", con el siguiente formato: "Cars built on 2010 or earlier:..." al terminar regresa al menu principal de opciones iniciales.

const csv = require('csv-parser');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

function yearFilter(year) {
  const results = [];
  const filePath = path.join(__dirname, 'data', 'usedCars.csv');
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      if (data.year <= year) {
        results.push(data);
      }
    })
    .on('end', () => {
      console.log(`Cars built on ${year} or earlier: ${results.length}`);
      console.log(results);
      startMenu();
    });
}

function startMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    'Enter a year to filter: ',
    async (year) => {
      yearFilter(year);
      rl.close();
    }
  );
}

startMenu();