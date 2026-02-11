import XLSX from 'xlsx';
import fs from 'fs';

const filePath = String.raw`C:\Users\Abel Martínez\Downloads\ruta_edomex.xlsx`;
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const out = jsonData.slice(0, 50).map(row => JSON.stringify(row.slice(0, 20))).join('\n');
fs.writeFileSync('debug_output.txt', out);
console.log("Written to debug_output.txt");
