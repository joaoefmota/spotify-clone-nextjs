"use client";
import { useRouter } from "next/navigation";
import React, { FunctionComponent, PropsWithChildren } from "react";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";

type HeaderProps = PropsWithChildren<{}> & {
  className?: string;
};

export const Header: FunctionComponent<HeaderProps> = ({
  children,
  className,
}) => {
  const router = useRouter();
  const handleLogout = () => {};
  return (
    <div
      className={twMerge(
        "h-fit bg-gradient-to-b from-emerald-800 p-6",
        className
      )}
    >
      <div className="w-full mb-4 flex items-center justify-between">
        <div className="hidden md:flex gap-x-2 items-center">
          <button
            type="button"
            title="caret-left-back"
            onClick={() => router.back()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretLeft size={35} className="text-white" />
          </button>
          <button
            type="button"
            title="caret-right-foward"
            onClick={() => router.forward()}
            className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
          >
            <RxCaretRight size={35} className="text-white" />
          </button>
        </div>
        <div className="flex md_hidden gap-x-2 items-center">
          <button type="button" title="home-button">
            <HiHome size={20} className="text-black" />
          </button>
          <button type="button" title=""></button>
        </div>
      </div>
    </div>
  );
};
