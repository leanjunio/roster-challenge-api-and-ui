import { Schema, model, connect } from 'mongoose';

type Artist = {
  artist: string;
  rate: number;
  streams: number;
  isCompletelyPaid: boolean;
}

const artistSchema = new Schema<Artist>({
  artist: String,
  rate: Number,
  streams: Number,
  isCompletelyPaid: {
    type: Boolean,
    default: false,
  }
});

export const Artist = model<Artist>('Artist', artistSchema);