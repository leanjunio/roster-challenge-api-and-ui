import express, { Express, Request, Response } from 'express';
import { connectDB } from './config/db';
import { Artist } from './models/artist';
import dotenv from 'dotenv';
import csv from "csv-parser"
import fs from "fs";
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

connectDB();

type ArtistLookup = {
  [key: string]: number;
}

let artistLookup: ArtistLookup = {};

fs.createReadStream('artist-genre-decade.csv')
  .pipe(csv(['Artist', 'Genre', 'Decade']))
  .on('data', (data) => artistLookup[data.Artist] = data.Decade)
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.get('/health', (_: Request, res: Response) => {
  res.send('OK');
});

app.get('/api/artists', async (_: Request, res: Response) => {
  const SPOTIFY_CUTOFF_YEAR = 2006;
  const artists = await Artist.find({});
  const sortedArtists = artists.map(artist => {
    const totalPayout = artist.rate * artist.streams;
    const monthsStreamed = artistLookup[artist.artist] < SPOTIFY_CUTOFF_YEAR ? new Date().getFullYear() - SPOTIFY_CUTOFF_YEAR : new Date().getFullYear() - artistLookup[artist.artist];
    const artistWithPayout = { ...artist.toJSON(), payout: totalPayout, monthlyPayout: totalPayout / monthsStreamed };
    return artistWithPayout;
  }).sort((artistA, artistB) => artistB.payout - artistA.payout);
  res.send(sortedArtists);
});

app.get('/api/artists/:id', async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);

  if (artist) {
    res.send(artist);
  } else {
    res.status(404).send({ message: 'Artist not found' });
  }
});

app.post('/api/artists', async (req: Request, res: Response) => {
  const artist = new Artist({
    artist: req.body.artist,
    rate: req.body.rate,
    streams: req.body.streams,
    isCompletelyPaid: req.body.isCompletelyPaid,
  });

  const newArtist = await artist.save();
  res.send(newArtist);
});

app.delete('/api/artists/:id', async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);

  if (artist) {
    await artist.deleteOne();
    res.send({ message: 'Artist removed' });
  } else {
    res.status(404).send({ message: 'Artist not found' });
  }
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

app.put('/api/artists/:id', async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);

  if (artist) {
    const updated = await Artist.replaceOne({ _id: req.params.id }, req.body);
    res.send(updated);
  } else {
    res.status(404).send({ message: 'Artist not found' });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});