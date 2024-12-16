"use client";
import { MediaItem } from "@/components/MediaItem";
import { Song } from "@/types/song.types";
import React, { FunctionComponent } from "react";
import { LikeButton } from "./LikeButton";

interface SearchContentProps {
  songs: Song[];
}

export const SearchContent: FunctionComponent<SearchContentProps> = ({
  songs,
}) => {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 txt-neutral-400">
        No songs found
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-y-2 w-full">
        {songs.map((song) => (
          <div key={song.id} className="flex items-center gap-x-4 w-full">
            <div className="flex-1">
              <MediaItem onClick={() => {}} data={song} />
            </div>
            <LikeButton songId={song.id} />
          </div>
        ))}
      </div>
    );
  }
};
