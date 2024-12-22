"use client";

import { useGetSongsById } from "@/hooks/useGetSongsById";
import useLoadSongUrl from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import React from "react";
import { PlayerContent } from "./PlayerContent";

export const Player = () => {
  const player = usePlayer();
  const { song, isLoading } = useGetSongsById(player.activeId ?? "");
  const songUrl = useLoadSongUrl(song?.song_path ?? "");

  if (!song || !songUrl || !player.activeId) return null;

  return (
    <div className="fixed bottom-0 bg-black w-full py-2 h-[80px] px-4">
      <PlayerContent key={song.id} song={song} songUrl={songUrl} />
    </div>
  );
};
