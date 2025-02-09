import { getUrl } from "@/libs/helpers";
import { stripe } from "@/libs/stripe";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { price, quantity = 1, metadata = {} } = await request.json();

  try {
    const supabase = createRouteHandlerClient({ cookies: cookies });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const customer = await createOrRetrieveCustomer({
      email: user?.email ?? "",
      uuid: user?.id ?? "",
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      line_items: [{ price: price.id, quantity }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: `${getUrl()}/account`,
      cancel_url: `${getUrl()}`,
      subscription_data: { metadata },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}
