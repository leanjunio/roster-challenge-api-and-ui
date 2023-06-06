import express, { Express, Request, Response } from 'express';
import { connectDB } from './config/db';
import { Artist } from './models/artist';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

connectDB();

app.get('/health', (_: Request, res: Response) => {
  res.send('OK');
});

app.get('/api/artists', async (_: Request, res: Response) => {
  const artists = await Artist.find({});
  res.send(artists);
});

app.patch('/api/artists/:id/isCompletelyPaid', async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);
  if (artist) {
    artist.isCompletelyPaid = !artist.isCompletelyPaid;
    await artist.save();
    res.send(artist);
  } else {
    res.status(404).send({ message: 'Artist not found' });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});