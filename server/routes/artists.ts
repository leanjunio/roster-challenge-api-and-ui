import express, { Request, Response } from "express";
import { Artist } from "../models/artist";
import { artistLookup } from "..";

export const ArtistRoutes = express.Router();

/**
 * @route GET /api/artists - Get all artists
 */
ArtistRoutes.get('/', async (_: Request, res: Response) => {
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

