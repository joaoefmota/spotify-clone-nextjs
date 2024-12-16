import { Song } from "@/types/song.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[] | []> => {
  const supabse = createServerComponentClient({
    cookies: cookies,
  });

  const { data, error } = await supabse
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return data as Song[] | [];
};

export default getSongs;
