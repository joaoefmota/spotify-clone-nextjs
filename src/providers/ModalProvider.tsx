"use client";

import { AuthModal } from "@/components/AuthModal";
import { PropsWithChildren, useEffect, useState } from "react";

const ModalProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // prevents errors being caused by modals. Because we are using server side rendering,
    // we need to make sure that the modal is only rendered on the client side, and therefore prevent hydration errors.
  }, []);

  if (!isMounted) return null; // prevents errors being caused by modals. Because we are using server side rendering,

  return (
    <>
      <AuthModal />
    </>
  );
};

export default ModalProvider;
