import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "../../../components/Layout/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Artist } from "../../../types/artist";
import { useNavigate } from "react-router-dom";

const createArtistSchema = z.object({
  artist: z.string()
    .min(1, { message: "Artist name is required" })
    .max(20, { message: "Artist name cannot exceed 20 characters" }),
  rate: z.number()
    .min(0.0000000001, { message: "Rate is required" })
    .max(5000, { message: "Exceeded max rate (5000)" }),
  streams: z.number()
    .min(1, { message: "Must have at least 1 stream" })
    .max(10000000000, { message: "Exceeded max streams (10000000000)" }),
  isCompletelyPaid: z.boolean(),
});

type CreateArtistFormData = z.infer<typeof createArtistSchema>;

export function CreateArtistPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<CreateArtistFormData>({
    resolver: zodResolver(createArtistSchema)
  });

  const mutation = useMutation({
    onSuccess: (data: Artist) => {
      toast.success(`Successfully added ${data.artist}!`);
      queryClient.invalidateQueries({ queryKey: ['artists'] });
      navigate("/");
    },
    mutationFn: (data: CreateArtistFormData) => fetch(`${process.env.REACT_APP_API_URL}/artists/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
  });

  function onSubmit(data: CreateArtistFormData) {
    mutation.mutate(data);
  }

  return (
    <Layout>
      <div className="flex flex-row justify-between my-10">
        <article className="prose">
          <h1>Create Artist</h1>
        </article>
      </div>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl my-10">Enter artist details</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Artist Name</span>
            </label>
            <input {...register("artist")} type="text" placeholder="Taylor Swift" className="input input-bordered w-full" />
            <label className="label">
              {!!errors.artist?.message && (
                <span className="label-text-alt text-error">{errors.artist?.message}</span>
              )}
            </label>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Artist Rate</span>
            </label>
            <label className="input-group">
              <span>$</span>
              <input {...register("rate", {
                valueAsNumber: true,
              })} placeholder="0.25" className="input input-bordered w-full" />
            </label>
            {!!errors.rate?.message && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.rate?.message}</span>
              </label>
            )}
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text"># of Streams</span>
            </label>
            <input {...register("streams", {
              valueAsNumber: true,
            })} placeholder="1000" className="input input-bordered w-full" />
            {!!errors.streams?.message && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.streams?.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Is Completely Paid</span>
              <input {...register("isCompletelyPaid")} type="checkbox" className="checkbox" />
            </label>
          </div>
          <div className="flex gap-2">
            <button className="btn" type="submit">Submit</button>
            <button className="btn btn-outline btn-error" type="button" onClick={() => navigate("/")}>Cancel</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
