import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Artist } from "../../../types/artist";
import { UpdateArtistFormData, updateArtistSchema } from "./UpdateArtistPage";

type UpdateArtistFormProps = {
  data: Artist;
  onSubmit: (data: UpdateArtistFormData) => void;
  onCancel: () => void;
};

export function UpdateArtistForm({ data, onSubmit, onCancel }: UpdateArtistFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateArtistFormData>({
    resolver: zodResolver(updateArtistSchema),
    defaultValues: data,
    shouldUnregister: true
  });

  function handleFormSubmit(data: UpdateArtistFormData) {
    onSubmit(data);
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, e => console.log({ e }))} className="flex flex-col gap-3">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Artist Name</span>
        </label>
        <input {...register("artist")} type="text" placeholder="Taylor Swift" className="input input-bordered w-full" />
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
            valueAsNumber: true
          })} placeholder="0.25" className="input input-bordered w-full" />
        </label>
        {!!errors.rate?.message && (
          <label className="label">
            <span className="label-text-alt">{errors.rate?.message}</span>
          </label>
        )}

      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text"># of Streams</span>
        </label>
        <input {...register("streams", {
          valueAsNumber: true
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
          <input
            id="isCompletedPaid"
            type="checkbox"
            className="checkbox"
            {...register("isCompletelyPaid")}
          />
        </label>
        {!!errors.rate?.message && (
          <label className="label">
            <span className="label-text-alt">{errors.isCompletelyPaid?.message}</span>
          </label>
        )}
      </div>
      <div className="flex gap-2">
        <button className="btn" type="submit">Submit</button>
        <button className="btn btn-outline btn-error" type="button" onClick={() => onCancel()}>Cancel</button>
      </div>
    </form>
  )
}