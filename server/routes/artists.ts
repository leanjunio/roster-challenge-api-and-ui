import express, { Request, Response } from "express";
import { Artist } from "../models/artist";
import { artistLookup } from "..";

export const ArtistRoutes = express.Router();

const SPOTIFY_CUTOFF_YEAR = 2006;
const ITEMS_PER_PAGE = 10;

/**
 * @route GET /api/artists - Get all artists
 */
ArtistRoutes.get('/', async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 0);
  const size = Number(req.query.size ?? ITEMS_PER_PAGE);
  const query = {};
  const skip = page * size;
  const count = await Artist.estimatedDocumentCount(query);
  const pageCount = Math.ceil(count / size);
  const artists = await Artist.find(query).limit(size).skip(skip);

  const artistWithPayout = artists.map(artist => {
    const totalPayout = artist.rate * artist.streams;
    const yearsStreamed = artistLookup[artist.artist] < SPOTIFY_CUTOFF_YEAR ? new Date().getFullYear() - SPOTIFY_CUTOFF_YEAR : new Date().getFullYear() - artistLookup[artist.artist];
    const monthsStreamed = yearsStreamed * 12;
    const artistWithPayout = { ...artist.toJSON(), payout: totalPayout, monthlyPayout: totalPayout / monthsStreamed };
    return artistWithPayout;
  });

  res.json({
    pagination: {
      count,
      pageCount
    },
    artists: artistWithPayout
  });
});

/**
 * @route GET /api/artists/:id - Retrieve an artist by id
 */
ArtistRoutes.get('/:id', async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);

  if (artist) {
    res.send(artist);
  } else {
    res.status(404).send({ message: 'Artist not found' });
  }
});

/**
 * @route POST /api/artists - Create a new artist
 */
ArtistRoutes.post('/', async (req: Request, res: Response) => {
  const artist = new Artist({
    artist: req.body.artist,
    rate: req.body.rate,
    streams: req.body.streams,
    isCompletelyPaid: req.body.isCompletelyPaid,
  });

  const newArtist = await artist.save();
  res.send(newArtist);
});

/**
 * @route DELETE /api/artists/:id - Delete an artist by id
 */
ArtistRoutes.delete('/:id', async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);

  if (artist) {
    await artist.deleteOne();
    res.send({ message: 'Artist removed' });
  } else {
    res.status(404).send({ message: 'Artist not found' });
  }
});

/**
 * @route PATCH /api/artists/:id/isCompletelyPaid - Toggle an artist's `isCompletelyPaid` field
 */
ArtistRoutes.patch('/:id/isCompletelyPaid', async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);
  if (artist) {
    artist.isCompletelyPaid = !artist.isCompletelyPaid;
    await artist.save();
    res.send(artist);
  } else {
    res.status(404).send({ message: 'Artist not found' });
  }
});

/**
 * @route PUT /api/artists/:id - Replace an artist record by id
 */
ArtistRoutes.put('/:id', async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id);

  if (artist) {
    const updated = await Artist.replaceOne({ _id: req.params.id }, req.body);
    res.send(updated);
  } else {
    res.status(404).send({ message: 'Artist not found' });
  }
});

