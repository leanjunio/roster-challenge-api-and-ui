import express, { Express, Request, Response } from 'express';
import { connectDB } from './config/db';
import { Artist } from './models/artist';
import dotenv from 'dotenv';
import csv from "csv-parser"
import fs from "fs";
import cors from 'cors';
import { ArtistRoutes } from './routes/artists';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

connectDB();

type ArtistLookup = {
  [key: string]: number;
}

export let artistLookup: ArtistLookup = {};

fs.createReadStream('artist-genre-decade.csv')
  .pipe(csv(['Artist', 'Genre', 'Decade']))
  .on('data', (data) => artistLookup[data.Artist] = data.Decade)
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.get('/health', (_: Request, res: Response) => {
  res.send('OK');
});

app.use('/api/artists', ArtistRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});