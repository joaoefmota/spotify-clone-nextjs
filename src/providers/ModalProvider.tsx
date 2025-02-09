"use client";

import { AuthModal } from "@/components/AuthModal";
import { SubscribeModal } from "@/components/SubscribeModal";
import { UploadModal } from "@/components/UploadModal";
import { ProductWithPrice } from "@/types/stripe.types";
import { useEffect, useState } from "react";

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
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
      <SubscribeModal products={products} />
    </>
  );
};

export default ModalProvider;
