"use client";
import React from "react";
import { Modal } from "./Modal";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";

export const AuthModal = () => {
  const supbaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onClose, isOpen } = useAuthModal();

  const onChangeHandler = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChangeHandler}
    >
      <Auth
        supabaseClient={supbaseClient}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: { colors: { brand: "#404040", brandAccent: "#22c55e" } },
          },
        }}
        theme="dark"
        providers={["github"]}
      />
    </Modal>
  );
};
