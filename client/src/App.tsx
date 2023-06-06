import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatToCAD } from './utils/currency';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Artist } from './types/artist';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  Button,
  Link
} from '@chakra-ui/react'

function App() {
  const navigate = useNavigate();
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

  function onUpdateArtistClick(id: Artist["_id"]) {
    navigate(`/artists/${id}`);
  }

  return (
    <Layout>
      <Text fontSize="3xl">Artists</Text>
      {isLoading && <p>Loading...</p>}
      {isSuccess && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Artist Name</Th>
                <Th>Rate</Th>
                <Th>Streams</Th>
                <Th>Payout</Th>
                <Th>Completed Payout?</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map(artist => (
                <Tr key={artist._id}>
                  <Td>{artist.artist}</Td>
                  <Td>{artist.rate}</Td>
                  <Td>{artist.streams}</Td>
                  <Td>{formatToCAD(artist.streams * artist.rate)}</Td>
                  <Td>
                    <input type="checkbox" checked={artist.isCompletelyPaid} disabled={mutation.isLoading} onChange={() => handleCompletedPayoutChange(artist._id)} id="completedPayout" name="completedPayout" />
                  </Td>
                  <Td className="artist__actions">
                    <Button onClick={() => onUpdateArtistClick(artist._id)} colorScheme='teal' variant='solid'>
                      Update
                    </Button>
                    <Button colorScheme='red' variant='solid'>
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  );
}

export default App;
