import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatToCAD } from './utils/currency';

type Artist = {
  _id: string;
  artist: string;
  rate: number;
  streams: number;
  isCompletelyPaid: boolean;
}

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
    <div className="App">
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
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      )}
    </div>
  );
}

export default App;
