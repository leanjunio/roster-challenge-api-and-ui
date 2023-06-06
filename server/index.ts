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
  const sortedArtists = artists.map(artist => ({ ...artist.toJSON(), payout: artist.rate * artist.streams })).sort((artistA, artistB) => artistB.payout - artistA.payout);
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