export type Artist = {
  _id: string;
  artist: string;
  rate: number;
  streams: number;
  payout: number;
  monthlyPayout: number;
  isCompletelyPaid: boolean;
}