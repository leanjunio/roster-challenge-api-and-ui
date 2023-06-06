import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery } from '@tanstack/react-query';
import { formatToCAD } from './utils/currency';

type Artist = {
  _id: string;
  artist: string;
  rate: number;
  streams: number;
}

function App() {
  const { isLoading, isSuccess, error, data } = useQuery<Artist[]>({
    queryKey: ['artists'],
    queryFn: () => fetch(`${process.env.REACT_APP_API_URL}/artists`).then(res => res.json())
  });

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
              </tr>
            </thead>
            <tbody>
              {data.map(artist => (
                <tr key={artist._id}>
                  <td>{artist.artist}</td>
                  <td>{artist.rate}</td>
                  <td>{artist.streams}</td>
                  <td>{formatToCAD(artist.streams * artist.rate)}</td>
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
