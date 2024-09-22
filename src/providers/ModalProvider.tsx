"use client";

import { AuthModal } from "@/components/AuthModal";
import { UploadModal } from "@/components/UploadModal";
import { useEffect, useState } from "react";

const ModalProvider: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // prevents errors being caused by modals. Because we are using server side rendering,
    // we need to make sure that the modal is only rendered on the client side, and therefore prevent hydration errors.
  }, []);

  if (!isMounted) return null; // prevents errors being caused by modals. Because we are using server side rendering,

  return (
    <>
      <AuthModal />
      <UploadModal />
    </>
  );
};

export default ModalProvider;
