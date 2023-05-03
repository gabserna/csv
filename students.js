const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "./data/students.csv",
  header: [
    { id: "name", title: "First" },
    { id: "gender", title: "Gender" },
  ],
});

const data = [
  { name: "John", gender: "M" },
  { name: "Anna", gender: "F",},
];
csvWriter.writeRecords(data).then(() =>console.log("..DONE"));
