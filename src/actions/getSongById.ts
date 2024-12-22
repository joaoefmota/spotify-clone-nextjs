import { Song } from "@/types/song.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongById = async (id: string): Promise<Song | null> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getUser();

  if (sessionError) {
    console.error(sessionError);
    return null;
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("id", id)
    .eq("user_id", sessionData.user.id)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  return data as Song;
};

export default getSongById;
