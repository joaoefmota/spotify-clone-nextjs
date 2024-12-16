import { PlayButton } from "@/components/PlayButton";
import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types/song.types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { FunctionComponent } from "react";
import toast from "react-hot-toast";

interface SongItemProps {
  onClick: (id: string) => void;
  song: Song;
}

export const SongItem: FunctionComponent<SongItemProps> = ({
  onClick,
  song,
}) => {
  const imageDataPath = useLoadImage(song);

  const router = useRouter();

  const { supabaseClient } = useSessionContext();

  const deleteSong = async (id: string) => {
    try {
      const { data: sessionData } = await supabaseClient.auth.getUser();
      const { error, statusText } = await supabaseClient
        .from("songs")
        .delete()
        .eq("id", id)
        .eq("user_id", sessionData?.user?.id);

      if (error) {
        return toast.error(statusText);
      } else {
        toast.success("Song deleted");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    router.refresh();
  };

  return (
    <div
      onClick={() => onClick(song.id)}
      className="relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-4 bg-neutral-400/5 cursor-pointer hover:bg-neutral-400/10 transition p-3"
    >
      <div className="relative aspect-square w-full h-full rounded-md overfow-hidden">
        <Image
          className="object-cover"
          src={imageDataPath ?? "/images/placeholder.png"}
          fill
          alt={"Image"}
        />
      </div>
      <div className="flex flex-col items-start w-full p-4 gap-y-1">
        <p className="font-semibold truncate w-full">{song.title}</p>
        <p className="text-neutral-400 text-sm pg-4 w-full truncate">
          by {song.author}
        </p>
      </div>
      <div className="absolute bottom-24 right-5">
        <PlayButton />
      </div>
    </div>
  );
};
