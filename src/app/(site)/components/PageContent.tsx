"use client";

import { Song } from "@/types/song.types";
import React, { FunctionComponent, useEffect } from "react";
import { SongItem } from "./SongItem";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useOnPlay from "@/hooks/useOnPlay";

interface PageContentProps {
  songs: Song[];
}

export const PageContent: FunctionComponent<PageContentProps> = ({ songs }) => {
  const onPlay = useOnPlay(songs);
  if (!songs) {
    return <div className="mt-4 text-neutral-400">No songs available</div>;
  } else {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
        {songs.map((song) => (
          <SongItem
            key={song.id}
            onClick={(id: string) => onPlay(id)}
            song={song}
          />
        ))}
      </div>
    );
  }
};
