import XLSX from 'xlsx';
const { readFile, utils } = XLSX;
import { join } from 'path';

const filePath = String.raw`C:\Users\Abel Martínez\Downloads\ruta_edomex.xlsx`;
const workbook = readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

console.log("Headers:", JSON.stringify(jsonData[0], null, 2));
console.log("First Row:", JSON.stringify(jsonData[1], null, 2));
