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
  const page = Number(req.query.page) + 1;
  const size = Number(req.query.size) ?? ITEMS_PER_PAGE;
  const sortBy = String(req.query.sortBy) ?? 'payout';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; 
  const aggregate = Artist.aggregate([
    {
      $addFields: {
        payout: { $multiply: ['$rate', '$streams'] },
        yearsStreamed: { 
          $cond: [
            { $lt: [artistLookup['$artist'], SPOTIFY_CUTOFF_YEAR] }, 
            { $subtract: [new Date().getFullYear(), SPOTIFY_CUTOFF_YEAR] }, 
            { $subtract: [new Date().getFullYear(), artistLookup['$artist']] }
          ] 
        },
      }
    }, {
      $addFields: {
        monthlyPayout: { $divide: ['$payout', { $multiply: ['$yearsStreamed', 12] }] }
      }
    }
  ]);

  const options = {
    page,
    limit: size,
    sort: { [sortBy]: sortOrder },
  }
  
  const artists = await (Artist as any).aggregatePaginate(aggregate, options);

  res.json({
    pagination: options,
    artists
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

