const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const readline = require('readline');
const path = require('path');

const cars = {};

// Leer archivo usedCars.csv y crear índice por make, model y color
fs.createReadStream(path.join(__dirname, 'data', 'usedCars.csv'))
  .pipe(csv())
  .on('data', (data) => {
    const { make, model, color } = data;
    if (!cars[make]) {
      cars[make] = {};
    }
    if (!cars[make][model]) {
      cars[make][model] = {};
    }
    if (!cars[make][model][color]) {
      cars[make][model][color] = [];
    }
    cars[make][model][color].push(data);
  })
  .on('end', () => {
    console.log('Loaded usedCars.csv');
    console.log(`Found ${Object.keys(cars).length} unique makes`);
    startMenu();
  });

function startMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    'Select an option: filter, type, report, exit\n',
    async (option) => {
      switch (option.trim().toLowerCase()) {
        case 'filter':
          const year = await askQuestion(rl, 'Enter a year to filter: ');
          const results = yearFilter(year);
          console.log(`Cars built on ${year} or earlier: ${results.length}`);
          break;
        case 'type':
          const type = await askQuestion(
            rl,
            'Select type (make, model, color, year): '
          );
          const count = typeFilter(type);
          console.log(`Cars by type ${type} found are: ${count}`);
          break;
          case 'report':
            const confirm = await askQuestion(rl, 'Do you want to proceed? (Y/N)');
            if (confirm.trim().toLowerCase() === 'y') {
              await generateReport(rl);
            }
            break;
        case 'exit':
          console.log('Bye!');
          rl.close();
          process.exit(0);
          break;
        default:
          console.log('Invalid option');
          break;
      }
      startMenu();
    }
  );
}

async function askQuestion(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

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
      console.log(results);
    });
  return results;
}

function typeFilter(type) {
  const count = Object.keys(cars).reduce((total, make) => {
    Object.keys(cars[make]).forEach((model) => {
      Object.keys(cars[make][model]).forEach((color) => {
        cars[make][model][color].forEach((car) => {
          if (car[type]) {
            total++;
          }
        });
      });
    });
    return total;
  }, 0);
  return count;
}


// Función para generar el reporte
async function generateReport(rl) {
  const confirmation = await askQuestion(rl, 'Do you want to generate a report? (Y/N) ');
  if (confirmation.toLowerCase() !== 'y') {
    rl.prompt();
    return;
  }

  const outputFile = path.join(__dirname, 'data', '2010PlusUsedCars.csv');

  const csvWriter = createCsvWriter({
    path: outputFile,
    header: [
      { id: 'make', title: 'Make' },
      { id: 'model', title: 'Model' },
      { id: 'color', title: 'Color' },
      { id: 'year', title: 'Year' },
    ],
  });

  const filteredData = [];

  fs.createReadStream('./data/usedCars.csv')
    .pipe(csv())
    .on('data', (data) => {
      if (data.year >= 2010) {
        filteredData.push({
          make: data.make,
          model: data.model,
          color: data.color,
          year: data.year,
        });
      }
    })
    .on('end', () => {
      csvWriter.writeRecords(filteredData).then(() => {
        console.log(`Report generated successfully. Output file: ${outputFile}`);
        rl.prompt();
      });
    });
}

// Función para preguntar al usuario
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}
