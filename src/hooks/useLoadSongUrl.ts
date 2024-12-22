import { Song } from "@/types/song.types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadSongUrl = (songPath: Song["song_path"]) => {
  const supabaseClient = useSupabaseClient();
  if (!songPath || songPath.length === 0) return;
  const { data } = supabaseClient.storage.from("songs").getPublicUrl(songPath);

  return data?.publicUrl;
};

export default useLoadSongUrl;
