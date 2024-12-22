import getSongById from "@/actions/getSongById";
import { Song } from "@/types/song.types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { error } from "console";
import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";

export const useGetSongsById = (id: string) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [song, setSong] = React.useState<Song | null>(null);
  const { supabaseClient } = useSessionContext();

  useEffect(() => {
    if (!id) return;

    setIsLoading(true);
    const fetchSong = async () => {
      try {
        const { data: sessionData } = await supabaseClient.auth.getSession();
        const { data, error } = await supabaseClient
          .from("songs")
          .select()
          .eq("id", id)
          .eq("user_id", sessionData.session?.user.id)
          .single();
        if (error || !data) toast.error("Failed to fetch song");
        setSong(data);
      } catch (error) {
        toast.error("Failed to fetch song");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSong();
  }, [id, supabaseClient]);

  const songData = useMemo(() => {
    return { song, isLoading };
  }, [song, isLoading]);

  return songData;
};
