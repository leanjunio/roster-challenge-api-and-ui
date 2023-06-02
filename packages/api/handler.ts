import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Schema, model, connect } from 'mongoose';
 
export interface IArtist {
  artist: string;
  rate: number;
  streams: number;
}

const artistSchema = new Schema<IArtist>({
  artist: String,
  rate: Number,
  streams: Number,
});

const artist = model<IArtist>('Artist', artistSchema);

let cachedDb = null
async function connectToDatabase(uri) {
  if (cachedDb) {
    return cachedDb
  }

  const client = await connect(uri);

  return client;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  console.log({ db: process.env.MONGODB_URI })
  await connectToDatabase(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/rebel-db');

  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (request.method === 'GET') {
    const artists = await artist.find({}).exec();
    return response.status(200).send(artists);
  }
}
