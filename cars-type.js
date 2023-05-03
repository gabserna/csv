const csv = require('csv-parser');
const fs = require('fs');
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
    startMenu();
  });

function startMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    'Select type (make, model, color, year): ',
    async (type) => {
      const count = await typeFilter(type);
      console.log(`Cars by type ${type} found are: ${count}`);
      rl.close();
    }
  );
}

function typeFilter(type) {
  return new Promise((resolve) => {
    const uniqueValues = new Set();
    Object.keys(cars).forEach((make) => {
      Object.keys(cars[make]).forEach((model) => {
        Object.keys(cars[make][model]).forEach((color) => {
          cars[make][model][color].forEach((car) => {
            const value = car[type] && car[type].trim();
            if (value && !uniqueValues.has(value)) {
              uniqueValues.add(value);
            }
          });
        });
      });
    });
    resolve(uniqueValues.size);
  });
}
