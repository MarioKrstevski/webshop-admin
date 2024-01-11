import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Acesss-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds, redirectUrl } = await req.json();

  console.log("redirectUrl", redirectUrl);
  // Get the route from where the user comes from, with window.location.href in the frontend so that we can redirect the user back to the cart page after the payment is completed.
  // this will be used in the success_url and cancel_url below
  if (productIds.length === 0) {
    return new NextResponse("Missing productIds, it's required", {
      status: 400,
    });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    [];

  products.forEach((product) => {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: { connect: { id: productId } },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    // success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    // cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    success_url: `${redirectUrl}/cart?success=1`,
    cancel_url: `${redirectUrl}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    { headers: corsHeaders }
  );
}
