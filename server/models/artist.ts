import { Schema, model, connect } from 'mongoose';

type Artist = {
  artist: string;
  rate: number;
  streams: number;
}

const artistSchema = new Schema<Artist>({
  artist: String,
  rate: Number,
  streams: Number,
});

export const Artist = model<Artist>('Artist', artistSchema);