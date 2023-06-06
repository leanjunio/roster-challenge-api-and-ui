import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { Artist } from "../../types/artist";

export function UpdateArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isSuccess } = useQuery<Artist>({
    queryKey: ['artist', id],
    queryFn: () => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}`).then(res => res.json()),
    enabled: !!id
  });

  return (
    <Layout>
      {isLoading && <p>Loading...</p>}
      {isSuccess && (
        <h1>Updating {data.artist} record</h1>
      )}
    </Layout>
  );
}