import XLSX from 'xlsx';
import { join } from 'path';

const filePath = String.raw`C:\Users\Abel Martínez\Downloads\ruta_edomex.xlsx`;
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log("Total Rows:", jsonData.length);
console.log("First 10 Rows:");
jsonData.slice(0, 10).forEach((row, i) => {
    console.log(JSON.stringify(row));
});
