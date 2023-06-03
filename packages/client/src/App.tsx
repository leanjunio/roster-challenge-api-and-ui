import './App.css';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

type Artist = {
  _id: string;
  artist: string;
  rate: number;
  streams: number;
}

const api = process.env.REACT_APP_API_URI ?? 'http://localhost:8000/api/handler';

function App() {
  const { data, error, status } = useQuery<Artist[]>({
    queryKey: ['artists'], queryFn: () => axios.get(api).then(res => res.data)
  });

  if (status === 'loading') {
    return <span>Loading...</span>
  }

  if (status === 'error') {
    return <span>Error: {(error as any).message}</span>
  }

  return (
    <div className="App">
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
            {data.map(({ _id, artist, rate, streams }) => (
              <tr key={_id}>
                <td>{artist}</td>
                <td>{rate}</td>
                <td>{streams}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </main>
    </div>
  );
}

export default App;
