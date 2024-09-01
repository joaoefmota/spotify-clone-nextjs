"use client";
import React, { FunctionComponent, PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";

type HeaderProps = PropsWithChildren<{}> & {
  className?: string;
};

export const Header: FunctionComponent<HeaderProps> = ({
  children,
  className,
}) => {
  const { onOpen } = useAuthModal();
  const router = useRouter();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    //reset any songs playing in the background
    router.refresh();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Logged out successfully");
    }
  };

  return (
    <div className={"h-fit bg-gradient-to-b from-emerald-800 p-6 " + className}>
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
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            type="button"
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
            title="home-button"
          >
            <HiHome size={20} className="text-black" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
            title="home-button"
          >
            <BiSearch size={20} className="text-black" />
          </button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          {user ? (
            <div className="flex gap-x-4 items-center">
              <Button className="bg-white px-6 py-2" onClick={handleLogout}>
                Log out
              </Button>
              <Button
                className="bg-white"
                onClick={() => router.push("/account")}
              >
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  className="bg-transparent text-neutral-300 font-medium"
                  onClick={onOpen}
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button className="bg-white px-6 py-2" onClick={onOpen}>
                  Log In
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
