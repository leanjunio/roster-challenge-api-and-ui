type Pagination = {
  page: number;
  limit: number;
  sort: {
    payout: string;
  };
};

export type Artist = {
  _id: string;
  artist: string;
  rate: number;
  streams: number;
  isCompletelyPaid: boolean;
  __v?: number;
  payout: number;
  yearsStreamed: number;
  monthlyPayout: number;
};

type PaginationResult = {
  docs: Artist[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: null | number;
  nextPage: null | number;
};

export type ArtistsQueryResponse = {
  pagination: Pagination;
  artists: PaginationResult;
};
