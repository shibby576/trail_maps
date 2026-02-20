import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { POSTER_SIZES } from "@/lib/constants";
import type { CheckoutRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const { sizeKey, imageUrl } = body;

    const size = POSTER_SIZES.find((s) => s.key === sizeKey);
    if (!size) {
      return NextResponse.json({ error: "Invalid size" }, { status: 400 });
    }

    if (!imageUrl || !imageUrl.startsWith("https://")) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: size.priceCents,
            product_data: {
              name: `Trail Map Poster — ${size.label}`,
              description: "Enhanced Matte Paper Poster",
              images: [imageUrl],
            },
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        sizeKey: size.key,
        imageUrl,
        printfulVariantId: String(size.printfulVariantId),
      },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/preview`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
