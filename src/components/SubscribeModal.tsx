"use client";

import React, { FC, useState } from "react";
import { Modal } from "./Modal";
import { Price, ProductWithPrice } from "@/types/stripe.types";
import Button from "./Button";
import formatPrice from "@/utils/stripe/formatPrice";
import { useUser } from "@/hooks/useUser";
import toast from "react-hot-toast";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

export const SubscribeModal: FC<SubscribeModalProps> = ({ products }) => {
  const { isLoading, user, subscription } = useUser();
  const [priceIsLoading, setPriceIsLoading] = useState<string | null>(null);
  const handleCheckout = async (price: Price) => {
    setPriceIsLoading(price.id);

    if (!user) {
      setPriceIsLoading(null);
      return toast.error("You need to be logged in to subscribe");
    }

    if (subscription) {
      setPriceIsLoading(null);
      return toast("Already subscribed");
    }

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPriceIsLoading(null);
    }
  };
  let content = <div className="text-center">No products available</div>;

  if (products.length) {
    console.log("products from Subscribe Modal: ", products);
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available</div>;
          }
          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              className="w-full mb-4"
              disabled={isLoading ?? price.id === priceIsLoading}
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = <div className="text-center">Already subscribed</div>;
  }

  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Spotify Premium"
      isOpen
      onChange={() => {}}
    >
      {content}
    </Modal>
  );
};
