import { Song } from "@/types/song.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async (): Promise<Song[] | []> => {
  const supabse = createServerComponentClient({
    cookies: cookies,
  });

  const { data: userData } = await supabse.auth.getUser();
  const { data, error } = await supabse
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", userData?.user?.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error || "No data found");
    return [];
  }

  return data.map((item) => ({
    ...item.songs,
  }));
};

export default getLikedSongs;
