let csvToJson = require('convert-csv-to-json');

let fileInputName = '525_dataset.csv'; 
let fileOutputName = './src/assets/NewYork.json';

csvToJson.fieldDelimiter(',').formatValueByType().generateJsonFileFromCsv(fileInputName,fileOutputName);