import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createOrder, confirmOrder } from "@/lib/printful";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (!metadata?.imageUrl || !metadata?.printfulVariantId) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    const shipping = session.collected_information?.shipping_details;
    if (!shipping?.address) {
      console.error("Missing shipping address in session:", session.id);
      return NextResponse.json({ received: true });
    }

    try {
      const order = await createOrder(
        {
          name: shipping.name || "Customer",
          address1: shipping.address.line1 || "",
          address2: shipping.address.line2 || undefined,
          city: shipping.address.city || "",
          state_code: shipping.address.state || "",
          country_code: shipping.address.country || "US",
          zip: shipping.address.postal_code || "",
        },
        [
          {
            variant_id: Number(metadata.printfulVariantId),
            quantity: 1,
            files: [
              {
                type: "default",
                url: metadata.imageUrl,
              },
            ],
          },
        ]
      );

      // Confirm the order so Printful starts fulfillment
      if (order?.result?.id) {
        await confirmOrder(order.result.id);
        console.log("Printful order confirmed:", order.result.id);
      }
    } catch (err) {
      console.error("Failed to create Printful order:", err);
      // Don't return error to Stripe — payment already succeeded.
      // Check Printful dashboard manually if this happens.
    }
  }

  return NextResponse.json({ received: true });
}
