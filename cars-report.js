//"cars-report.js" debe leer el archivo "./data/usedCars.csv" y filtrar todos los valores de "year" que sean igual o menor de 2010 unicamente,  y entonces crear un archivo llamado "./data/2010PlusUsedCars.csv" exportando unicamente los valores de las columnas "make", "model", "color" y "year" con sus valores que correspondan al valor filtrado, ademas devolver una confirmacion de realizado.



const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const inputFilePath = "./data/usedCars.csv";
const outputFilePath = "./data/2010PlusUsedCars.csv";

const csvWriter = createCsvWriter({
  path: outputFilePath,
  header: [
    { id: "make", title: "make" },
    { id: "model", title: "model" },
    { id: "color", title: "color" },
    { id: "year", title: "year" },
  ],
});

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on("data", (row) => {
    if (parseInt(row["year"]) <= 2010) {
      const { make, model, color, year } = row;
      const newData = { make, model, color, year };
      csvWriter.writeRecords([newData]);
    }
  })
  .on("end", () => {
    console.log(`El archivo ${outputFilePath} se ha generado exitosamente.`);
  });



/*
const fs = require("fs");
const csv = require("csv-parser");

const outputFilePath = "./data/2010PlusUsedCars.csv";

fs.createReadStream("./data/usedCars.csv")
  .pipe(csv())
  .on("data", (row) => {
    if (parseInt(row["year"]) <= 2010) {
      const { make, model, color, year } = row;
      const newData = { make, model, color, year };
      fs.appendFileSync(outputFilePath, `${JSON.stringify(newData)}\n`);
    }
  })
  .on("end", () => {
    console.log(`El archivo ${outputFilePath} se ha generado exitosamente.`);
  });
*/