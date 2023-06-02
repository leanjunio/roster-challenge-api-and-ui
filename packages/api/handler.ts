import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connect } from 'mongoose'
 
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
  const db = await connectToDatabase(process.env.MONGODB_URI ?? 'mongodb://localhost:27017/rebel-db');
  response.status(200).send("Hello world!!");
}
