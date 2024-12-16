import { Song } from "@/types/song.types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadImage = (song: Song) => {
  const supabseClient = useSupabaseClient();

  if (!song) return null;

  const { data: imageData } = supabseClient.storage
    .from("images")
    .getPublicUrl(song.image_path);

  return imageData.publicUrl;
};

export default useLoadImage;
