import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Layout } from '../components/Layout/Layout';
import { Artist, ArtistsQueryResponse } from '../types/artist';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Error } from "../components/Error";
import { useState } from 'react';
import { Pagination } from '../types/pagination';
import { ArtistTable, TablePagination } from './artist/table/ArtistTable';
import { SortingState } from '@tanstack/react-table';

export function Home() {
  const [pagination, setPagination] =
    useState<TablePagination>({
      pageIndex: 0,
      pageSize: 10
    });
  const [sorting, setSorting] = useState<SortingState>([{
    id: "payout",
    desc: true
  }]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, error, data, isError } = useQuery<ArtistsQueryResponse>({
    queryKey: ['artists', pagination],
    queryFn: () => fetch(`${process.env.REACT_APP_API_URL}/artists?page=${pagination.pageIndex}&size=${pagination.pageSize}&sortBy=${sorting[0].id}&sortOrder=${sorting[0].desc ? 'desc' : 'asc'}`).then(res => res.json())
  });

  const mutation = useMutation({
    mutationFn: (id: Artist["_id"]) => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}/isCompletelyPaid`, { method: 'PATCH' }).then(res => res.json())
  });

  const deleteMutation = useMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artists'] }),
    mutationFn: (id: Artist["_id"]) => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}`, { method: 'DELETE' }).then(res => res.json())
  });


  function handleCompletedPayoutChange(artist: Artist) {
    mutation.mutate(artist._id, {
      onSuccess: () => {
        toast.success(`Payout status updated for ${artist.artist}`)
        queryClient.invalidateQueries({ queryKey: ['artists'] })
        queryClient.refetchQueries({ queryKey: ['artists', { id: artist._id }] })
      }
    });
  }

  function onUpdateArtistClick(id: Artist["_id"]) {
    navigate(`/artists/${id}`);
  }

  function onAddArtistClick() {
    navigate(`/artists/`);
  }

  function handleDeleteArtist(id: Artist["_id"], artist: Artist["artist"]) {
    if (window.confirm(`Are you sure you want to delete ${artist}?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success(`Successfully deleted ${artist}!`)
      });
    }
  }

  if (isLoading) {
    return (
      <LoadingSpinner />
    )
  }

  if (isError) {
    return (
      <Error error={error as Error} />
    )
  }

  return (
    <Layout>
      <div className="flex flex-row justify-between my-10">
        <article className="prose">
          <h1>Artists</h1>
        </article>
        <button onClick={() => onAddArtistClick()} className="btn btn-accent btn-md">Add Artist</button>
      </div>
      <section className=''>
        <ArtistTable
          onToggleCompletedPayout={handleCompletedPayoutChange}
          data={data.artists.docs}
          onUpdate={onUpdateArtistClick}
          onDelete={handleDeleteArtist}
          pagination={pagination}
          updatePagination={setPagination}
          updateSorting={setSorting}
          sorting={sorting}
          serverPagination={data.pagination}
          pageCount={data.artists.totalPages}
          hasPrevPage={data.artists.hasPrevPage}
          hasNextPage={data.artists.hasNextPage}
        />
      </section>
    </Layout>
  );
}