import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../../components/Layout/Layout";
import { Artist } from "../../../types/artist";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Error } from "../../../components/Error";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { UpdateArtistForm } from "./UpdateArtistForm";

export const updateArtistSchema = z.object({
  artist: z.string().min(1, { message: "Artist name is required" }),
  rate: z.number({
    required_error: "Required"
  }).min(0.0000000001, { message: "Rate is required" }).max(5000, { message: "Exceeded max rate (5000)" }),
  streams: z.number().min(0, { message: "Streams is required" }).max(10000000000, { message: "Exceeded max rate (10000000000)" }),
  isCompletelyPaid: z.boolean(),
});

export type UpdateArtistFormData = z.infer<typeof updateArtistSchema>;

export function UpdateArtistPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery<Artist>({
    queryKey: ['artists', { id }],
    queryFn: () => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}`).then(res => res.json()),
    enabled: !!id
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateArtistFormData) => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  });


  function onSubmit(data: UpdateArtistFormData) {
    updateMutation.mutate(data, {
      onSuccess: () => {
        toast.success(`Successfully updated ${data.artist}!`);
        queryClient.invalidateQueries({ queryKey: ['artists'] });
        navigate("/")
      }
    });
  }

  function onCancel() {
    navigate("/")
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
          <h1>Update Artists</h1>
        </article>
      </div>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl my-10">Updating {data.artist} record</h1>
        <UpdateArtistForm onSubmit={onSubmit} onCancel={onCancel} data={data} />
      </div>
    </Layout>
  );
}