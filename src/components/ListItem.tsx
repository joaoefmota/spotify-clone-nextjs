"use client";
import { useRouter } from "next/navigation";
import React, { FunctionComponent } from "react";
import { FaPlay } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

type ListItemProps = {
  href: string;
  name: String;
};

export const ListItem: FunctionComponent<ListItemProps> = ({ href, name }) => {
  const router = useRouter();

  const onClick = () => {
    //add authentication check here
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className="
      relative 
      group 
      flex 
      items-center 
      rounded-md 
      overflow-hidden 
      gap-x-4 
      bg-neutral-100/10 
      hover:bg-neutral-100/20 
      transition
      pr-4
      "
    >
      <div className="relative min-h-[64px] min-w-[64px]">
        <div className="flex items-center gap-4 ps-3">
          <FaHeart className="text-green-500" size={32} />
          <p className="font-medium truncate py-5">{name}</p>
        </div>
      </div>
      <div
        className="
        absolute 
        transition
         opacity-0 
         rounded-full 
         flex 
         items-center          
         bg-green-500 
         p-4 
         drop-shadow-md 
         right-5 
         group-hover:opacity-100 
         hover:scale-110"
      >
        <FaPlay className="text-black" />
      </div>
    </button>
  );
};
