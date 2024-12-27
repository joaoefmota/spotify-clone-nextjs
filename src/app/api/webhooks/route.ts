import { stripe } from "@/libs/stripe";
import {
  deleteProductRecord,
  manageSubscriptionStatusChange,
  upsertPriceRecord,
  upsertProductRecord,
} from "@/libs/updateAdmin";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "product.deleted",
]);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get("Stripe-Signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  console.log("sig", sig);
  console.log("webhookSecret", webhookSecret);

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log("event", event);

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          const product = event.data.object as Stripe.Product;
          await upsertProductRecord(product);
          break;
        case "price.created":
        case "price.updated":
          const price = event.data.object as Stripe.Price;
          await upsertPriceRecord(price);
          break;
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.mode === "subscription") {
          }
          const subscriptionId = session.subscription;
          await manageSubscriptionStatusChange(
            subscriptionId as string,
            session.customer as string,
            true
          );
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "product.deleted":
          const productToDelete = event.data.object as Stripe.Product;
          await deleteProductRecord(productToDelete.id);
          break;
        default:
          throw new Error(`Unhandled event type: ${event.type}`);
      }
    } catch (error: any) {
      console.log(error);
      return new NextResponse("Webhook Error", { status: 400 });
    }
  }
  return NextResponse.json({ received: true }, { status: 200 });
}

// Product delete and 5:58:50
