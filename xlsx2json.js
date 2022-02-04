const xlsx = require("xlsx");
const xlsxj = require("xlsx-to-json");

const sheetArr = xlsx.readFile('./src/assets/input.xlsx').SheetNames;
for (const item of sheetArr) {
	const name = item.split(',')[0].split(' ').join('');
	xlsxj(
		{
			input: "./src/assets/input.xlsx",
			output:`./src/assets/${name}.json`,
			sheet: item,  
		},
		function (err, result) {
			if (err) {
				console.error(err);
			} else {
				console.log(result);
			}
		}
	);
}
