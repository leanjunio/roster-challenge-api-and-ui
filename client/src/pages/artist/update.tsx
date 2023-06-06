import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { Artist } from "../../types/artist";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, Text, VStack, Checkbox } from "@chakra-ui/react";

const updateArtistSchema = z.object({
  artist: z.string().min(1).max(255),
  rate: z.number().min(1).max(5),
  streams: z.number().min(0),
  isCompletelyPaid: z.boolean(),
});

type UpdateArtistForm = z.infer<typeof updateArtistSchema>;

export function UpdateArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isSuccess } = useQuery<Artist>({
    queryKey: ['artist', id],
    queryFn: () => fetch(`${process.env.REACT_APP_API_URL}/artists/${id}`).then(res => res.json()),
    enabled: !!id
  });

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateArtistForm>();

  function onSubmit(data: UpdateArtistForm) {
    console.log(data);
  }

  return (
    <Layout>
      {isLoading && <p>Loading...</p>}
      {isSuccess && (
        <>
          <Text fontSize="3xl">Updating {data.artist} record</Text>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing="1em">
              <FormControl isInvalid={!!errors.artist?.message}>
                <FormLabel htmlFor="artist">Artist Name</FormLabel>
                <Input {...register("artist")} type="text" defaultValue={data.artist} />
                {!!errors.artist?.message && <FormErrorMessage>{!!errors.artist?.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.rate?.message}>
                <FormLabel htmlFor="rate">Rate</FormLabel>
                <Input {...register("rate")} type="number" defaultValue={data.rate} />
                {!!errors.rate?.message && <FormErrorMessage>{!!errors.rate?.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.streams?.message}>
                <FormLabel htmlFor="strams">Streams</FormLabel>
                <Input {...register("streams")} type="number" defaultValue={data.streams} />
                {!!errors.streams?.message && <FormErrorMessage>{!!errors.streams?.message}</FormErrorMessage>}
              </FormControl>
              <FormControl isInvalid={!!errors.streams?.message}>
                <FormLabel htmlFor="strams">Streams</FormLabel>
                <Checkbox {...register("isCompletelyPaid")} type="checkbox" defaultChecked={data.isCompletelyPaid} />
                {!!errors.streams?.message && <FormErrorMessage>{!!errors.streams?.message}</FormErrorMessage>}
              </FormControl>
              <Button type="submit" colorScheme='blue'>Submit</Button>
            </VStack>
          </form>
        </>
      )}
    </Layout>
  );
}