import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { Artist } from "../../types/artist";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const updateArtistSchema = z.object({
  artist: z.string().min(1).max(255),
  rate: z.number().min(1).max(5),
  streams: z.number().min(0),
  isCompletelyPaid: z.boolean(),
});

type UpdateArtistFormData = z.infer<typeof updateArtistSchema>;

export function UpdateArtistPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isSuccess } = useQuery<Artist>({
    queryKey: ['artist', id],
    queryFn: () => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}`).then(res => res.json()),
    enabled: !!id
  });

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateArtistFormData>();

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
        queryClient.invalidateQueries(['artists']);
        navigate("/")
      }
    });
  }

  return (
    <Layout>
      <div className="flex flex-row justify-between my-10">
        <article className="prose">
          <h1>Update Artists</h1>
        </article>
      </div>
      {isLoading && <p>Loading...</p>}
      {isSuccess && (
        <>
          <div className="max-w-lg mx-auto">
            <h1 className="text-2xl my-10">Updating {data.artist} record</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Artist Name</span>
                </label>
                <input {...register("artist", {
                  value: data.artist,
                })} type="text" placeholder="Taylor Swift" className="input input-bordered w-full" />
                {!!errors.artist?.message && (
                  <label className="label">
                    <span className="label-text-alt">{errors.artist?.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Artist Rate</span>
                </label>
                <label className="input-group">
                  <span>$</span>
                  <input {...register("rate", {
                    value: data.rate,
                  })} placeholder="0.25" className="input input-bordered w-full" />
                  {!!errors.rate?.message && (
                    <label className="label">
                      <span className="label-text-alt">{errors.rate?.message}</span>
                    </label>
                  )}
                </label>

              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text"># of Streams</span>
                </label>
                <input {...register("streams", {
                  value: data.streams,
                })} placeholder="1000" className="input input-bordered w-full" />
                {!!errors.streams?.message && (
                  <label className="label">
                    <span className="label-text-alt">{errors.streams?.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Is Completely Paid</span>
                  <input {...register("isCompletelyPaid", {
                    value: data.isCompletelyPaid,
                  })} type="checkbox" defaultChecked={data.isCompletelyPaid} className="checkbox" />
                </label>
              </div>
              <div className="flex gap-2">
                <button className="btn" type="submit">Submit</button>
                <button className="btn btn-outline btn-error" type="button" onClick={() => navigate("/")}>Cancel</button>
              </div>
            </form>
          </div>
        </>
      )}
    </Layout>
  );
}