import express, { Express, Request, Response } from 'express';
import { connectDB } from './config/db';
import { Artist } from './models/artist';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

connectDB();

app.get('/health', (_: Request, res: Response) => {
  res.send('OK');
});

app.get('/api/artists', async (_: Request, res: Response) => {
  const artists = await Artist.find({});
  res.send(artists);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});