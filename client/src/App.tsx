import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatToCAD } from './utils/currency';
import { Link } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Artist } from './types/artist';

function App() {
  const queryClient = useQueryClient();
  const { isLoading, isSuccess, error, data } = useQuery<Artist[]>({
    queryKey: ['artists'],
    queryFn: () => fetch(`${process.env.REACT_APP_API_URL}/artists`).then(res => res.json())
  });

  const mutation = useMutation({
    mutationFn: (id: Artist["_id"]) => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}/isCompletelyPaid`, { method: 'PATCH' }).then(res => res.json())
  });

  function handleCompletedPayoutChange(id: Artist["_id"]) {
    mutation.mutate(id, {
      onSuccess: () => queryClient.invalidateQueries(['artists'])
    });
  }

  return (
    <Layout>
      <h1>Artists</h1>
      {isLoading && <p>Loading...</p>}
      {isSuccess && (
        <main>
          <table>
            <thead>
              <tr>
                <th>Artist Name</th>
                <th>Rate</th>
                <th>Streams</th>
                <th>Payout</th>
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
                  <td>{formatToCAD(artist.streams * artist.rate)}</td>
                  <td>
                    <input type="checkbox" checked={artist.isCompletelyPaid} disabled={mutation.isLoading} onChange={() => handleCompletedPayoutChange(artist._id)} id="completedPayout" name="completedPayout" />
                  </td>
                  <td className="artist__actions">
                    <Link to={`/artists/${artist._id}`}>Update</Link>
                    <button className="artist__delete" onClick={() => handleCompletedPayoutChange(artist._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}
    </Layout>
  );
}

export default App;
