"use client";
import { usePathname } from "next/navigation";
import React, { FunctionComponent, PropsWithChildren, useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { Box } from "./Box";
import { SidebarItem } from "./SidebarItem";
import { Library } from "./Library";
import { Song } from "@/types/song.types";
import usePlayer from "@/hooks/usePlayer";

interface SideBarProps extends PropsWithChildren {
  songs: Song[];
}

export const SideBar: FunctionComponent<SideBarProps> = ({
  songs,
  children,
}) => {
  const pathname = usePathname();

  const player = usePlayer();

  const routes = useMemo(
    () => [
      {
        label: "Home",
        href: "/",
        active: pathname !== "/search",
        icon: HiHome,
      },
      {
        label: "Search",
        href: "/search",
        active: pathname === "/search",
        icon: BiSearch,
      },
    ],
    [pathname]
  );
  return (
    <div
      className={["flex h-full", player.activeId && "h-[calc(100%-80px)]"].join(
        " "
      )}
    >
      <div className="hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2">
        <Box>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            {routes.map((route) => (
              <SidebarItem key={route.href} {...route} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} />
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto py-2">{children}</main>
    </div>
  );
};
