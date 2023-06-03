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

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}


async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  console.log({ db: process.env.MONGODB_URI })
  await connectToDatabase(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/rebel-db');

  if (request.method === 'GET') {
    const artists = await artist.find({}).exec();
    return response.status(200).send(artists);
  }
}

export default allowCors(handler);