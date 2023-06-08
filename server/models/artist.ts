import mongoose, { Schema, model, AggregatePaginateModel } from 'mongoose';
import mongoosePaginate from "mongoose-aggregate-paginate-v2";

type TArtist = {
  artist: string;
  rate: number;
  streams: number;
  isCompletelyPaid: boolean;
}

const artistSchema = new Schema<TArtist>({
  artist: String,
  rate: Number,
  streams: Number,
  isCompletelyPaid: {
    type: Boolean,
    default: false,
  }
});

artistSchema.plugin(mongoosePaginate);

export const Artist = model<TArtist>('Artist', artistSchema);