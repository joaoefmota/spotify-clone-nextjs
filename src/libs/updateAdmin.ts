import { Price, Product } from "@/types/stripe.types";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { stripe } from "./stripe";
import { Database } from "@/types/database.types";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    image: product.images[0] ?? "",
    metadata: product.metadata,
    active: product.active,
  };

  const { error } = await supabaseAdmin.from("products").upsert([productData]);

  if (error) {
    throw new Error(error.message);
  }

  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    description: price.nickname ?? "",
    unit_amount: price.unit_amount ?? 0,
    currency: price.currency,
    type: price.type,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days ?? 0,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdmin.from("prices").upsert([priceData]);

  if (error) {
    throw new Error(`Error Adding / Chaning product: ${error.message}`);
  }

  console.log(`Price inserted/updated: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: number;
}) => {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", uuid)
    .single();

  if (error || !data.stripe_customer_id) {
    const customerData: { metadata: { supabaseUUID: string }; email?: string } =
      { metadata: { supabaseUUID: uuid.toString() } };
    if (email) customerData.email = email;

    const customer = await stripe.customers.create(customerData);
    const { error: supabaseError } = await supabaseAdmin
      .from("customers")
      .insert([
        {
          id: uuid,
          stripe_customer_id: customer.id,
        },
      ]);
    if (supabaseError) {
      throw new Error(supabaseError.message);
    }
    console.log(`New customer created and inserted for ${uuid}`);
    return customer.id;
  }

  return data.stripe_customer_id;
};

const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  const customer = payment_method.customer as string;
  const { address, email, name, phone } = payment_method.billing_details;
  if (!name || !email || !address || !phone) return;

  await stripe.customers.update(customer, {
    name,
    email,
    address: {
      city: address.city ?? "",
      country: address.country ?? "",
      line1: address.line1 ?? "",
      line2: address.line2 ?? "",
      postal_code: address.postal_code ?? "",
      state: address.state ?? "",
    },
    phone,
  });

  const { error } = await supabaseAdmin
    .from("customers")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);

  if (error) {
    throw new Error(error.message);
  }
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  const { data: customerData, error: customerError } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (customerError) {
    throw new Error(customerError.message);
  }

  const { id: uuid } = customerData;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_behaviour"],
  });

  console.log("subscription", subscription);

  const subscriptionData: Database["public"]["Tables"]["subscriptions"]["Insert"] =
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      price_id: subscription.items.data[0].price.id,
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? new Date(subscription.cancel_at).toISOString()
        : null,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at).toISOString()
        : null,
      current_period_start: new Date(
        subscription.current_period_start
      ).toISOString(),
      created: new Date(subscription.created).toISOString(),
      ended_at: subscription.ended_at
        ? new Date(subscription.ended_at).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end).toISOString()
        : null,
    };

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert([subscriptionData]);

  if (error) return new Error(error.message);

  console.log(
    `Subscription inserted/updated: ${subscription.id} for user ${uuid}`
  );
  if (createAction) {
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
  }
};

const deleteProductRecord = async (producId: Stripe.Product["id"]) => {
  const { error: priceError } = await supabaseAdmin
    .from("prices")
    .delete()
    .eq("product_id", producId);

  const { error: productError } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", producId);

  if (productError || priceError) {
    throw new Error(
      `Error deleting product: ${productError?.message ?? "Unknown error"}`
    );
  }

  console.log(`Product deleted: ${producId}`);
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  deleteProductRecord,
};
