import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatToCAD } from './utils/currency';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Layout } from './components/Layout/Layout';
import { Artist } from './types/artist';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Error } from "./components/Error";

function App() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, error, data, isError } = useQuery<Artist[]>({
    queryKey: ['artists'],
    queryFn: () => fetch(`${process.env.REACT_APP_API_URL}/artists`).then(res => res.json())
  });

  const mutation = useMutation({
    mutationFn: (id: Artist["_id"]) => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}/isCompletelyPaid`, { method: 'PATCH' }).then(res => res.json())
  });

  const deleteMutation = useMutation({
    onSuccess: () => queryClient.invalidateQueries(['artists']),
    mutationFn: (id: Artist["_id"]) => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}`, { method: 'DELETE' }).then(res => res.json())
  });


  function handleCompletedPayoutChange(id: Artist["_id"]) {
    mutation.mutate(id, {
      onSuccess: () => queryClient.invalidateQueries(['artists'])
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
      <section>
        <table className='table'>
          <thead>
            <tr>
              <th>Artist Name</th>
              <th>Rate</th>
              <th>Streams</th>
              <th>Total Payout</th>
              <th>Monthly Payout</th>
              <th>Completed Payout?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(artist => (
              <tr key={artist._id}>
                <td>{artist.artist}</td>
                <td>{artist.rate}</td>
                <td>{artist.streams}</td>
                <td>{formatToCAD(artist.payout)}</td>
                <td>{formatToCAD(artist.monthlyPayout)}</td>
                <td>
                  <input type="checkbox" checked={artist.isCompletelyPaid} disabled={mutation.isLoading} onChange={() => handleCompletedPayoutChange(artist._id)} id="completedPayout" name="completedPayout" />
                </td>
                <td className="flex gap-2">
                  <button className="btn btn-sm" onClick={() => onUpdateArtistClick(artist._id)}>Update</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDeleteArtist(artist._id, artist.artist)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Layout>
  );
}

export default App;
