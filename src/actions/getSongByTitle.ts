import { Song } from "@/types/song.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getSongs from "./getSongs";

const getSongByTitle = async (title: string): Promise<Song[] | []> => {
  const supabse = createServerComponentClient({
    cookies: cookies,
  });

  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }
  const { data, error } = await supabse
    .from("songs")
    .select("*")
    .ilike("title", `%${title}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return data as Song[] | [];
};

export default getSongByTitle;
