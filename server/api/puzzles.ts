import csv from 'csv-parser';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../../public/data/puzzles.csv');

const router = express.Router();

router.use(cors());

router.get('/', async (req, res) => {
  try {
    const rating = req.query.rating;
    const keyword = req.query.keyword;

    console.log('rating', rating);
    console.log('keyword', keyword);

    const data = await readAndProcessCSV();

    // Apply filtering if the parameters are provided
    const filteredData = filterData(data, rating, keyword);

    res.json(getRandomSubset(filteredData, 1));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing CSV');
  }
});

function readAndProcessCSV() {
  const results: any = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
}

function filterData(data: any, rating: any, keyword: any) {
  console.log(data);
  return data.filter((row: any) => {
    const isWithinRatingRange = Math.abs(row.Rating - rating) <= 100;
    const containsKeyword = row.Themes.includes(keyword);
    return isWithinRatingRange && containsKeyword;
  });
}

function getRandomSubset(data: any, count: any) {
  // Shuffle array using the Fisher-Yates algorithm
  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }
  return data.slice(0, count);
}

export default router;
